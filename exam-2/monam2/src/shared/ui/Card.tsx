import { css } from "@emotion/react";
import {
  type ComponentPropsWithoutRef,
  forwardRef,
  type HTMLAttributes,
} from "react";

interface CardRootProps extends ComponentPropsWithoutRef<"div"> {
  interactive?: boolean;
}

const CardRoot = forwardRef<HTMLDivElement, CardRootProps>(function Card(
  { interactive = false, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      css={[rootStyle, interactive && interactiveStyle]}
      {...rest}
    />
  );
});

function CardHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <div css={headerStyle} {...props} />;
}

function CardTitleGroup(props: HTMLAttributes<HTMLDivElement>) {
  return <div css={titleGroupStyle} {...props} />;
}

function CardTitle(props: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 css={titleStyle} {...props} />;
}

function CardSubtitle(props: HTMLAttributes<HTMLSpanElement>) {
  return <span css={subtitleStyle} {...props} />;
}

function CardBadge(props: HTMLAttributes<HTMLSpanElement>) {
  return <span css={badgeStyle} {...props} />;
}

function CardContent(props: HTMLAttributes<HTMLDivElement>) {
  return <div css={contentStyle} {...props} />;
}

function CardMetaGrid(props: HTMLAttributes<HTMLDivElement>) {
  return <div css={metaGridStyle} {...props} />;
}

function CardMetaItem(props: HTMLAttributes<HTMLDivElement>) {
  return <div css={metaItemStyle} {...props} />;
}

function CardMetaLabel(props: HTMLAttributes<HTMLSpanElement>) {
  return <span css={metaLabelStyle} {...props} />;
}

function CardMetaValue(props: HTMLAttributes<HTMLElement>) {
  return <strong css={metaValueStyle} {...props} />;
}

const rootStyle = css({
  display: "grid",
  gap: "18px",
  padding: "22px",
  borderRadius: "20px",
  border: "2px solid #e5e7eb",
  background: "#ffffff",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.06)",
});

const interactiveStyle = css({
  transition:
    "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 20px 48px rgba(15, 23, 42, 0.09)",
    border: "2px solid #f97316",
  },
});

const headerStyle = css({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "16px",
});

const titleGroupStyle = css({
  display: "grid",
  gap: "6px",
});

const titleStyle = css({
  margin: 0,
  fontSize: "1.125rem",
  fontWeight: 700,
  color: "#0f172a",
});

const subtitleStyle = css({
  fontSize: "0.9375rem",
  color: "#475569",
});

const badgeStyle = css({
  flexShrink: 0,
  padding: "6px 10px",
  borderRadius: "9999px",
  backgroundColor: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "0.8125rem",
  fontWeight: 700,
});

const contentStyle = css({
  display: "grid",
  gap: "14px",
});

const metaGridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
  "@media (max-width: 720px)": {
    gridTemplateColumns: "1fr",
  },
});

const metaItemStyle = css({
  display: "grid",
  gap: "4px",
  padding: "14px 16px",
  borderRadius: "14px",
  backgroundColor: "#f8fafc",
});

const metaLabelStyle = css({
  fontSize: "0.8125rem",
  color: "#64748b",
});

const metaValueStyle = css({
  fontSize: "0.9375rem",
  color: "#0f172a",
});

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  TitleGroup: CardTitleGroup,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Badge: CardBadge,
  Content: CardContent,
  MetaGrid: CardMetaGrid,
  MetaItem: CardMetaItem,
  MetaLabel: CardMetaLabel,
  MetaValue: CardMetaValue,
});

export default Card;
