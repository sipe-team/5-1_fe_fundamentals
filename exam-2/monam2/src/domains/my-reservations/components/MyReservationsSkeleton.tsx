import { css } from "@emotion/react";

export default function MyReservationsSkeleton() {
  return (
    <section css={sectionStyle}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`reservation-skeleton-${index}`} css={cardStyle}>
          <div css={titleStyle} />
          <div css={metaRowStyle}>
            <div css={metaChipStyle} />
            <div css={metaChipStyle} />
          </div>
          <div css={descriptionStyle} />
        </div>
      ))}
    </section>
  );
}

const shimmerStyle = {
  background:
    "linear-gradient(90deg, rgba(226,232,240,0.75) 0%, rgba(241,245,249,0.95) 50%, rgba(226,232,240,0.75) 100%)",
  backgroundSize: "200% 100%",
  animation: "my-reservations-pulse 1.4s ease-in-out infinite",
  "@keyframes my-reservations-pulse": {
    "0%": { backgroundPosition: "200% 0" },
    "100%": { backgroundPosition: "-200% 0" },
  },
};

const sectionStyle = css({
  display: "grid",
  gap: "16px",
  marginTop: "24px",
});

const cardStyle = css({
  display: "grid",
  gap: "14px",
  padding: "20px",
  borderRadius: "18px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
});

const titleStyle = css({
  ...shimmerStyle,
  width: "180px",
  height: "22px",
  borderRadius: "8px",
});

const metaRowStyle = css({
  display: "flex",
  gap: "10px",
});

const metaChipStyle = css({
  ...shimmerStyle,
  width: "120px",
  height: "18px",
  borderRadius: "9999px",
});

const descriptionStyle = css({
  ...shimmerStyle,
  width: "100%",
  height: "42px",
  borderRadius: "10px",
});
