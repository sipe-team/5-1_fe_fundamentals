import { Badge } from '@/shared/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { Equipment } from '@/types/reservation';
import { CAPACITY_OPTIONS, EQUIPMENT_LABELS } from '../constants';

interface RoomFilterRootProps {
  children: React.ReactNode;
}

function RoomFilterRoot({ children }: RoomFilterRootProps) {
  return <div className="flex flex-wrap items-center gap-4">{children}</div>;
}

interface FloorSelectProps {
  floors: number[];
  value: number | null;
  onChange: (floor: number | null) => void;
}

function FloorSelect({ floors, value, onChange }: FloorSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">층</span>
      <Select
        value={value?.toString() ?? 'all'}
        onValueChange={(v) => onChange(v === 'all' ? null : Number(v))}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          {floors.map((f) => (
            <SelectItem key={f} value={f.toString()}>
              {f}F
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface CapacitySelectProps {
  value: number;
  onChange: (value: number) => void;
}

function CapacitySelect({ value, onChange }: CapacitySelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">수용 인원</span>
      <Select
        value={value.toString()}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CAPACITY_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface EquipmentFilterProps {
  value: Equipment[];
  onChange: (equipment: Equipment[]) => void;
}

function EquipmentFilter({ value, onChange }: EquipmentFilterProps) {
  const toggle = (eq: Equipment) => {
    if (value.includes(eq)) {
      onChange(value.filter((e) => e !== eq));
    } else {
      onChange([...value, eq]);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-700">장비</span>
      <Badge>
        {(Object.entries(EQUIPMENT_LABELS) as [Equipment, string][]).map(
          ([key, label]) => (
            <Badge.Item
              key={key}
              variant={value.includes(key) ? 'active' : 'default'}
              onClick={() => toggle(key)}
            >
              {label}
            </Badge.Item>
          ),
        )}
      </Badge>
    </div>
  );
}

export const RoomFilter = Object.assign(RoomFilterRoot, {
  Floor: FloorSelect,
  Capacity: CapacitySelect,
  Equipment: EquipmentFilter,
});
