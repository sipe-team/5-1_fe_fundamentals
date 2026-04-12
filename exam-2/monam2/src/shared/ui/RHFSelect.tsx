import type { ComponentProps } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';

import Select from './Select';

type BaseSelectProps = ComponentProps<typeof Select>;

interface RHFSelectProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues,
> extends Omit<
    BaseSelectProps,
    'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error'
  > {
  control: Control<TFieldValues, undefined, TTransformedValues>;
  name: Path<TFieldValues>;
}

export default function RHFSelect<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues,
>({
  control,
  name,
  ...rest
}: RHFSelectProps<TFieldValues, TTransformedValues>) {
  const { field, fieldState } = useController<
    TFieldValues,
    Path<TFieldValues>,
    TTransformedValues
  >({
    name,
    control,
  });

  return (
    <Select
      {...rest}
      name={field.name}
      value={field.value ?? ''}
      onChange={(event) => field.onChange(event.target.value)}
      onBlur={field.onBlur}
      ref={field.ref}
      error={fieldState.error?.message}
    />
  );
}
