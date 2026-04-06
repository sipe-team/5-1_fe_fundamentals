import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import type { Equipment } from '@/features/rooms/types';

const CAPACITY_OPTIONS = [2, 4, 6, 8, 10] as const;

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'monitor', label: '모니터' },
  { value: 'whiteboard', label: '화이트보드' },
  { value: 'video_conference', label: '화상회의 장비' },
  { value: 'projector', label: '프로젝터' },
];

interface RoomFilterProps {
  capacity: number | null;
  equipment: Equipment[];
  onCapacityChange: (value: number | null) => void;
  onEquipmentChange: (value: Equipment[]) => void;
}

export function RoomFilter({
  capacity,
  equipment,
  onCapacityChange,
  onEquipmentChange,
}: RoomFilterProps) {
  const handleEquipmentToggle = (item: Equipment, checked: boolean) => {
    if (checked) {
      onEquipmentChange([...equipment, item]);
    } else {
      onEquipmentChange(equipment.filter((e) => e !== item));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <Label
          htmlFor="capacity-filter"
          className="text-sm font-medium text-slate-700 whitespace-nowrap"
        >
          수용 인원
        </Label>
        <Select
          value={capacity !== null ? String(capacity) : 'all'}
          onValueChange={(val) => onCapacityChange(val === 'all' ? null : Number(val))}
        >
          <SelectTrigger id="capacity-filter" className="w-32">
            <SelectValue placeholder="전체" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {CAPACITY_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}명 이상
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {EQUIPMENT_OPTIONS.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-1.5">
              <Checkbox
                id={`equipment-${value}`}
                checked={equipment.includes(value)}
                onCheckedChange={(checked) => handleEquipmentToggle(value, Boolean(checked))}
              />
              <Label
                htmlFor={`equipment-${value}`}
                className="text-sm font-normal text-slate-600 cursor-pointer"
              >
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
