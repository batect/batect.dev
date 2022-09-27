import React, { useEffect, useRef } from "react";
import * as AsciinemaPlayerLibrary from "asciinema-player";
import "asciinema-player/dist/bundle/asciinema-player.css";

interface AsciinemaPlayerProps {
  src: string;
  width: number;
  height: number;
  preload: boolean;
  poster: string;
  fit: "width" | "height" | "both" | "none" | false;
}

const AsciinemaPlayer: React.FC<AsciinemaPlayerProps> = ({ src, ...opts }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    const player = AsciinemaPlayerLibrary.create(src, currentRef, opts);

    return () => {
      player.dispose();
    };
  }, [src, opts]);

  return <div ref={ref} />;
};

export default AsciinemaPlayer;
