import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TheBoldFont } from "../load-font";
import { fitText } from "@remotion/layout-utils";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";

const fontFamily = TheBoldFont;

// Configuration object with all editable parameters
const config = {
  // Container styling
  containerBottomPosition: 310,
  containerHeight: 150,
  // Text styling
  desiredFontSize: 120,
  highlightColor: "#39E508",
  textColor: "white",
  strokeWidth: "20px",
  strokeColor: "black",
  textTransform: "uppercase",
  textWidthPercentage: 0.9,
  
  // Animation parameters
  initialScale: 0.8,
  initialYOffset: 50
};

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: config.containerBottomPosition,
  height: config.containerHeight,
};

const DESIRED_FONT_SIZE = config.desiredFontSize;
const HIGHLIGHT_COLOR = config.highlightColor;

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: width * config.textWidthPercentage,
    textTransform: config.textTransform as any,
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          color: config.textColor,
          WebkitTextStroke: `${config.strokeWidth} ${config.strokeColor}`,
          paintOrder: "stroke",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [config.initialScale, 1])),
            translateY(interpolate(enterProgress, [0, 1], [config.initialYOffset, 0])),
          ]),
          fontFamily,
          textTransform: config.textTransform  ,
        }}
      >
        <span
          style={{
            transform: makeTransform([
              scale(interpolate(enterProgress, [0, 1], [config.initialScale, 1])),
              translateY(interpolate(enterProgress, [0, 1], [config.initialYOffset, 0])),
            ]),
          }}
        >
          {page.tokens.map((t) => {
            const startRelativeToSequence = t.fromMs - page.startMs;
            const endRelativeToSequence = t.toMs - page.startMs;

            const active =
              startRelativeToSequence <= timeInMs &&
              endRelativeToSequence > timeInMs;

            return (
              <span
                key={t.fromMs}
                style={{
                  display: "inline",
                  whiteSpace: "pre",
                  color: active ? HIGHLIGHT_COLOR : config.textColor,
                }}
              >
                {t.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
