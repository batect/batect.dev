import React, { Component, Ref, useEffect, useState } from "react";
import paths from "../plugins/asciinema-player/paths";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace asciinema {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace player {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace js {
      function CreatePlayer(ref: Ref<HTMLElement>, url: string, options: PlayerOptions);
      function UnmountPlayer(ref: Ref<HTMLElement>);

      // This is only a subset of the available options - these are the only ones that we use.
      interface PlayerOptions {
        cols: number;
        rows: number;
        preload: boolean;
        poster: string;
      }
    }
  }
}

interface AsciinemaPlayerProps extends asciinema.player.js.PlayerOptions {
  src: string;
}

class AsciinemaPlayer extends Component<AsciinemaPlayerProps> {
  private ref: Ref<HTMLDivElement>;

  bindRef = (ref) => {
    this.ref = ref;
  };

  componentDidMount() {
    asciinema.player.js.CreatePlayer(this.ref, this.props.src, this.props);
  }

  componentWillUnmount() {
    if (!this.ref) return;

    asciinema.player.js.UnmountPlayer(this.ref);
    this.ref = null;
  }

  render() {
    return <div ref={this.bindRef} />;
  }
}

// From https://usehooks.com/useScript/
function useScript(src) {
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(() => {
    if (!src) {
      setStatus("idle");
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      document.body.appendChild(script);

      const setAttributeFromEvent = (event) => {
        script.setAttribute("data-status", event.type === "load" ? "ready" : "error");
      };

      script.addEventListener("load", setAttributeFromEvent);
      script.addEventListener("error", setAttributeFromEvent);
    } else {
      setStatus(script.getAttribute("data-status"));
    }

    const setStateFromEvent = (event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
      }
    };
  }, [src]);

  return status;
}

const AsciinemaPlayerWrapper = (props: AsciinemaPlayerProps) => {
  const status = useScript(paths.js);
  console.log(status);

  if (status !== "ready") {
    return <div>Loading...</div>;
  }

  console.log("Showing");
  return <AsciinemaPlayer {...props} />;
};

export default AsciinemaPlayerWrapper;
