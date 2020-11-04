import React, { Component, Ref } from "react";
import paths from "../plugins/asciinema-player/paths";
import useScript from "../utils/useScript";

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

const AsciinemaPlayerWrapper = (props: AsciinemaPlayerProps) => {
  const status = useScript(paths.js);

  switch (status) {
    case "ready":
      return <AsciinemaPlayer {...props} />;
    case "loading":
      return <div>Loading...</div>;
    case "error":
      return <div>Loading player failed.</div>;
    default:
      throw new Error(`Unknown script status: ${status}`);
  }
};

export default AsciinemaPlayerWrapper;
