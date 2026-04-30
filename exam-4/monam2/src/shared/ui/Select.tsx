import { css } from '@emotion/react';
import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, placeholder, error, hint, fullWidth = true, id, ...rest },
  ref,
) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div css={[wrapperStyle, fullWidth && fullWidthStyle]}>
      {label ? (
        <label css={labelStyle} htmlFor={selectId}>
          {label}
        </label>
      ) : null}
      <div css={selectWrapperStyle}>
        <select
          ref={ref}
          id={selectId}
          css={[selectBaseStyle, error ? selectErrorStyle : selectNormalStyle]}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined
          }
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span css={chevronStyle} aria-hidden="true">
          ▾
        </span>
      </div>
      {error ? (
        <p id={`${selectId}-error`} css={errorStyle} role="alert">
          {error}
        </p>
      ) : null}
      {!error && hint ? (
        <p id={`${selectId}-hint`} css={hintStyle}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});

const wrapperStyle = css({
  display: 'inline-flex',
  flexDirection: 'column',
  gap: '0.375rem',
});

const fullWidthStyle = css({
  width: '100%',
});

const labelStyle = css({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#374151',
  textAlign: 'left',
});

const selectWrapperStyle = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const selectBaseStyle = css({
  width: '100%',
  height: '40px',
  padding: '0 2.5rem 0 0.875rem',
  fontSize: '0.9375rem',
  color: '#111827',
  backgroundColor: '#ffffff',
  border: '1.5px solid',
  borderRadius: '8px',
  outline: 'none',
  appearance: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',

  '&:disabled': {
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
});

const selectNormalStyle = css({
  borderColor: '#d1d5db',
  '&:focus': {
    borderColor: '#f97316',
    boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.18)',
  },
  '&:hover:not(:disabled):not(:focus)': {
    borderColor: '#9ca3af',
  },
});

const selectErrorStyle = css({
  borderColor: '#ef4444',
  '&:focus': {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.12)',
  },
});

const chevronStyle = css({
  position: 'absolute',
  right: '0.875rem',
  pointerEvents: 'none',
  color: '#6b7280',
  fontSize: '0.9rem',
  lineHeight: 1,
});

const errorStyle = css({
  fontSize: '0.8125rem',
  color: '#ef4444',
  textAlign: 'left',
});

const hintStyle = css({
  fontSize: '0.8125rem',
  color: '#6b7280',
  textAlign: 'left',
});

export default Select;
