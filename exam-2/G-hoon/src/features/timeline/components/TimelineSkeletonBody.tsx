import { TIME_SLOTS_LENGTH } from '../constants';

const SKELETON_ROW_IDS = [
  'skeleton-room-a',
  'skeleton-room-b',
  'skeleton-room-c',
  'skeleton-room-d',
  'skeleton-room-e',
  'skeleton-room-f',
] as const;
const RESERVED_SLOT_PATTERNS = [
  { start: 1, span: 2 },
  { start: 4, span: 3 },
  { start: 8, span: 2 },
  { start: 12, span: 4 },
] as const;

export default function TimelineSkeletonBody() {
  return (
    <tbody aria-hidden="true">
      {SKELETON_ROW_IDS.map((rowId, rowIndex) => (
        <tr key={rowId}>
          <td className="sticky left-0 z-10 bg-white px-3 py-2 border-b border-r border-slate-200">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-2.5 w-12 animate-pulse rounded bg-slate-100" />
          </td>
          {renderSkeletonSlots(rowIndex)}
        </tr>
      ))}
    </tbody>
  );
}

function renderSkeletonSlots(rowIndex: number) {
  const reserved =
    RESERVED_SLOT_PATTERNS[rowIndex % RESERVED_SLOT_PATTERNS.length];
  const cells = [];
  let slotIndex = 0;

  while (slotIndex < TIME_SLOTS_LENGTH) {
    if (slotIndex === reserved.start) {
      cells.push(
        <td
          key={slotIndex}
          colSpan={reserved.span}
          className="h-10 px-1 border-b border-slate-200"
        >
          <div className="h-7 w-full animate-pulse rounded bg-blue-100" />
        </td>,
      );
      slotIndex += reserved.span;
      continue;
    }

    cells.push(
      <td key={slotIndex} className="h-10 px-1 border-b border-slate-200">
        <div className="h-7 w-full animate-pulse rounded bg-slate-100" />
      </td>,
    );
    slotIndex++;
  }

  return cells;
}
