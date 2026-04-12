import { css } from '@emotion/react';

import type { ReservationPlacement } from './TimelineGrid.utils';
import { ROOM_LABEL_WIDTH, SLOT_WIDTH, TIME_SLOTS } from './TimelineGrid.utils';

export const sectionStyle = css({
  marginTop: '32px',
});

export const sectionTitleStyle = css({
  margin: 0,
  fontSize: '1.125rem',
  fontWeight: 700,
});

export const headerStyle = css({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '24px',
  marginBottom: '16px',
});

export const titleGroupStyle = css({
  display: 'grid',
  gap: '6px',
});

export const dateLabelStyle = css({
  margin: 0,
  color: '#4b5563',
  fontSize: '0.9375rem',
});

export const dateInputStyle = css({
  minWidth: '220px',
});

export const timelineWrapperStyle = css({
  overflowX: 'auto',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  background: '#ffffff',
});

export const timelineHeaderStyle = css({
  display: 'grid',
  gridTemplateColumns: `${ROOM_LABEL_WIDTH}px minmax(${TIME_SLOTS.length * SLOT_WIDTH}px, 1fr)`,
  borderBottom: '1px solid #e5e7eb',
  background: '#f8fafc',
});

export const roomHeaderCellStyle = css({
  display: 'flex',
  alignItems: 'center',
  padding: '16px',
  fontSize: '0.875rem',
  fontWeight: 700,
  color: '#374151',
});

export const timelineTrackStyle = css({
  display: 'grid',
  gridTemplateColumns: `repeat(${TIME_SLOTS.length}, ${SLOT_WIDTH}px)`,
});

export const timeCellStyle = css({
  padding: '14px 8px',
  borderLeft: '1px solid #e5e7eb',
  fontSize: '0.75rem',
  fontWeight: 600,
  textAlign: 'center',
  color: '#6b7280',
});

export const timelineRowsStyle = css({
  display: 'grid',
});

export const timelineRowStyle = css({
  display: 'grid',
  gridTemplateColumns: `${ROOM_LABEL_WIDTH}px minmax(${TIME_SLOTS.length * SLOT_WIDTH}px, 1fr)`,
  minHeight: '92px',
  borderBottom: '1px solid #f1f5f9',
});

export const roomCellStyle = css({
  display: 'grid',
  alignContent: 'center',
  gap: '4px',
  padding: '16px',
  borderRight: '1px solid #e5e7eb',
  background: '#fcfcfd',
});

export const roomNameStyle = css({
  fontSize: '0.9375rem',
  color: '#111827',
});

export const roomMetaStyle = css({
  fontSize: '0.8125rem',
  color: '#6b7280',
});

export const timelineLaneStyle = css({
  position: 'relative',
});

export const timelineGridStyle = css({
  display: 'grid',
  gridTemplateColumns: `repeat(${TIME_SLOTS.length}, ${SLOT_WIDTH}px)`,
  height: '100%',
});

export const slotLinkStyle = css({
  borderLeft: '1px solid #f1f5f9',
  background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
  textDecoration: 'none',
  transition: 'background-color 0.18s ease, box-shadow 0.18s ease',
  '&:hover': {
    background: 'rgba(249, 115, 22, 0.08)',
    boxShadow: 'inset 0 0 0 1px rgba(249, 115, 22, 0.14)',
  },
  '&:focus-visible': {
    outline: '2px solid #f97316',
    outlineOffset: '-2px',
    background: 'rgba(249, 115, 22, 0.1)',
  },
});

export const reservationBlockStyle = (placement: ReservationPlacement) =>
  css({
    position: 'absolute',
    top: '12px',
    left: `${placement.left}px`,
    width: `${placement.width}px`,
    minHeight: '68px',
    display: 'grid',
    alignContent: 'center',
    gap: '4px',
    padding: '10px 12px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #ea580c, #f97316)',
    color: '#ffffff',
    textDecoration: 'none',
    boxShadow: '0 10px 24px rgba(249, 115, 22, 0.22)',
    overflow: 'hidden',
  });

export const reservationTitleStyle = css({
  fontSize: '0.875rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const reservationMetaStyle = css({
  fontSize: '0.75rem',
  opacity: 0.88,
});

export const emptyTextStyle = css({
  margin: 0,
  color: '#6b7280',
  fontSize: '0.9375rem',
});

export const visuallyHiddenStyle = css({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});
