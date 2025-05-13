import React, { useRef } from "react";
import { useEyeScene } from "./useEyeScene";

interface EyeComponentProps {
  className?: string;
  style?: React.CSSProperties;
}

const EyeComponent: React.FC<EyeComponentProps> = ({ className = "", style = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEyeScene(
    containerRef,
    chrome.runtime.getURL("assets/Eye-1K.glb"),
    "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr"
  );

  return (
    <div
      ref={containerRef}
      className={`eye-component absolute inset-0 z-0 pointer-events-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "transparent",
        ...style,
      }}
    />
  );
};

export default EyeComponent;
