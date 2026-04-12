import { css, keyframes } from "@emotion/react";

const TIMELINE_START_HOUR = 9;
const TIMELINE_END_HOUR = 18;
const SLOT_WIDTH = 76;
const ROOM_LABEL_WIDTH = 180;
const SLOT_COUNT = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 2; // 18개

const SKELETON_ROWS = 4;

export default function TimelineSkeleton() {
  return (
    <section
      css={css`
        margin-top: 32px;
      `}
    >
      <div css={headerStyle}>
        <div css={titleGroupStyle}>
          <div css={skeletonBlock({ width: 120, height: 20, radius: 6 })} />
          <div css={skeletonBlock({ width: 180, height: 16, radius: 4 })} />
        </div>
        <div css={skeletonBlock({ width: 220, height: 44, radius: 10 })} />
      </div>

      <div css={timelineWrapperStyle}>
        <div css={timelineHeaderStyle}>
          <div css={roomHeaderCellStyle}>
            <div css={skeletonBlock({ width: 40, height: 14, radius: 4 })} />
          </div>
          <div css={timelineTrackStyle}>
            {Array.from({ length: SLOT_COUNT }).map((_, i) => (
              <div key={i} css={timeCellStyle}>
                {i % 2 === 0 && (
                  <div
                    css={skeletonBlock({ width: 32, height: 12, radius: 3 })}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
          <div key={rowIdx} css={timelineRowStyle}>
            <div css={roomCellStyle}>
              <div css={skeletonBlock({ width: 100, height: 15, radius: 5 })} />
              <div css={skeletonBlock({ width: 70, height: 12, radius: 4 })} />
            </div>

            <div css={timelineLaneStyle}>
              <div css={timelineGridStyle}>
                {Array.from({ length: SLOT_COUNT }).map((_, i) => (
                  <div key={i} css={slotCellStyle} />
                ))}
              </div>
              <SkeletonReservationBlock rowIdx={rowIdx} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SkeletonReservationBlock({ rowIdx }: { rowIdx: number }) {
  const variants = [
    { left: SLOT_WIDTH * 1 + 4, width: SLOT_WIDTH * 3 - 8 },
    { left: SLOT_WIDTH * 4 + 4, width: SLOT_WIDTH * 2 - 8 },
    { left: SLOT_WIDTH * 0 + 4, width: SLOT_WIDTH * 4 - 8 },
    { left: SLOT_WIDTH * 6 + 4, width: SLOT_WIDTH * 2 - 8 },
  ];
  const v = variants[rowIdx % variants.length];

  return (
    <div
      css={css`
        position: absolute;
        top: 12px;
        left: ${v.left}px;
        width: ${v.width}px;
        min-height: 68px;
        border-radius: 12px;
        background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        animation: ${shimmer} 1.6s ease-in-out infinite;
      `}
    />
  );
}

const shimmer = keyframes`
  0%   { opacity: 1; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
`;

function skeletonBlock({
  width,
  height,
  radius,
}: {
  width: number;
  height: number;
  radius: number;
}) {
  return css`
    width: ${width}px;
    height: ${height}px;
    border-radius: ${radius}px;
    background: #e5e7eb;
    animation: ${shimmer} 1.6s ease-in-out infinite;
  `;
}

const headerStyle = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 16px;
`;

const titleGroupStyle = css`
  display: grid;
  gap: 6px;
`;

const timelineWrapperStyle = css`
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
`;

const timelineHeaderStyle = css`
  display: grid;
  grid-template-columns: ${ROOM_LABEL_WIDTH}px minmax(
      ${SLOT_COUNT * SLOT_WIDTH}px,
      1fr
    );
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
`;

const roomHeaderCellStyle = css`
  display: flex;
  align-items: center;
  padding: 16px;
`;

const timelineTrackStyle = css`
  display: grid;
  grid-template-columns: repeat(${SLOT_COUNT}, ${SLOT_WIDTH}px);
`;

const timeCellStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 8px;
  border-left: 1px solid #e5e7eb;
`;

const timelineRowStyle = css`
  display: grid;
  grid-template-columns: ${ROOM_LABEL_WIDTH}px minmax(
      ${SLOT_COUNT * SLOT_WIDTH}px,
      1fr
    );
  min-height: 92px;
  border-bottom: 1px solid #f1f5f9;
`;

const roomCellStyle = css`
  display: grid;
  align-content: center;
  gap: 4px;
  padding: 16px;
  border-right: 1px solid #e5e7eb;
  background: #fcfcfd;
`;

const timelineLaneStyle = css`
  position: relative;
`;

const timelineGridStyle = css`
  display: grid;
  grid-template-columns: repeat(${SLOT_COUNT}, ${SLOT_WIDTH}px);
  height: 100%;
`;

const slotCellStyle = css`
  border-left: 1px solid #f1f5f9;
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
`;
