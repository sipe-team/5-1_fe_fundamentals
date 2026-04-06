import type { ComponentProps } from 'react';
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form';

import Input from './Input';

type BaseInputProps = ComponentProps<typeof Input>;

interface RHFInputProps<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues,
> extends Omit<
    BaseInputProps,
    'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'error'
  > {
  control: Control<TFieldValues, undefined, TTransformedValues>;
  name: Path<TFieldValues>;
}

export default function RHFInput<
  TFieldValues extends FieldValues,
  TTransformedValues extends FieldValues = TFieldValues,
>({ control, name, ...rest }: RHFInputProps<TFieldValues, TTransformedValues>) {
  const { field, fieldState } = useController<
    TFieldValues,
    Path<TFieldValues>,
    TTransformedValues
  >({
    name,
    control,
  });

  return (
    <Input
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
