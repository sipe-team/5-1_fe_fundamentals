import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface TimeSlotOption {
  label: string;
  value: string;
}

interface TimeSelectFieldProps<TFieldValues extends FieldValues> {
  id: string;
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  slots: TimeSlotOption[];
  placeholder: string;
}

export function TimeSelectField<TFieldValues extends FieldValues>({
  id,
  name,
  control,
  slots,
  placeholder,
}: TimeSelectFieldProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger id={id} className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {slots.map((slot) => (
              <SelectItem key={slot.value} value={slot.value}>
                {slot.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
