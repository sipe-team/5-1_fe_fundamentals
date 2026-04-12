import { css, type SerializedStyles } from "@emotion/react";

interface FlexProps {
  children: React.ReactNode;
  direction?: "row" | "column";
  justify?: "start" | "center" | "end" | "stretch";
  align?: "start" | "center" | "end" | "stretch";
  gap?: number;
  wrap?: boolean;
  css?: SerializedStyles;
}

const alignmentMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

export default function Flex({
  children,
  direction = "row",
  justify = "start",
  align = "center",
  gap = 16,
  wrap = false,
  css: cssProp,
}: FlexProps) {
  return (
    <div css={[flexStyle(direction, justify, align, gap, wrap), cssProp]}>
      {children}
    </div>
  );
}
const flexStyle = (
  direction: "row" | "column",
  justify: "start" | "center" | "end" | "stretch",
  align: "start" | "center" | "end" | "stretch",
  gap: number,
  wrap: boolean,
) => css`
  display: flex;
  gap: ${toRem(gap)};
  align-items: ${alignmentMap[align]};
  justify-content: ${alignmentMap[justify]};
  flex-direction: ${direction};
  flex-wrap: ${wrap ? "wrap" : "nowrap"};
`;

function toRem(px: number) {
  return `${px / 16}rem`;
}
