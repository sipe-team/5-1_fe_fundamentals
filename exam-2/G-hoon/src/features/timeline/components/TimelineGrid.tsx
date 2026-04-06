import type { ReactNode } from 'react';
import { TIME_SLOTS } from '../constants';

interface TimelineGridProps {
  children: ReactNode;
}

export default function TimelineGrid({ children }: TimelineGridProps) {
  return (
    <div className="overflow-x-auto overflow-y-hidden border border-slate-200 rounded-lg">
      <table className="w-full border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-slate-50">
            <th className="sticky left-0 z-10 bg-slate-50 text-left text-xs font-medium text-slate-500 px-3 py-2 border-b border-r border-slate-200 min-w-[140px]">
              회의실
            </th>
            {TIME_SLOTS.map((time) => (
              <th
                key={time}
                className="text-center text-xs font-medium text-slate-500 px-1 py-2 border-b border-slate-200 min-w-[60px]"
              >
                {time}
              </th>
            ))}
          </tr>
        </thead>
        {children}
      </table>
    </div>
  );
}
