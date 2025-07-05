import { Composition, staticFile } from "remotion";
import { getVideoMetadata } from "@remotion/media-utils";
import {
  CaptionedVideo,
  calculateCaptionedVideoMetadata,
  captionedVideoSchema,
} from "./CaptionedVideo";
import { useCallback, useEffect, useState } from "react";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 1080, height: 1920 });
  const videoPath = "jashwanth.mp4";
  
  const loadVideoDimensions = useCallback(async () => {
    try {
      const metadata = await getVideoMetadata(staticFile(videoPath));
      setDimensions({
        width: metadata.width,
        height: metadata.height
      });
    } catch (error) {
      console.error("Failed to load video dimensions:", error);
    }
  }, []);
  
  useEffect(() => {
    loadVideoDimensions();
  }, [loadVideoDimensions]);
  
  return (
    <Composition
      id="CaptionedVideo"
      component={CaptionedVideo}
      calculateMetadata={calculateCaptionedVideoMetadata}
      schema={captionedVideoSchema}
      width={dimensions.width}
      height={dimensions.height}
      defaultProps={{
        src: staticFile(videoPath),
      }}
    />
  );
};
