import { css } from '@emotion/react';
import { forwardRef, type InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    hint,
    fullWidth = true,
    id,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;
  const mergedDescribedBy =
    [ariaDescribedBy, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div css={[wrapperStyle, fullWidth && fullWidthStyle]}>
      {label && (
        <label css={labelStyle} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        css={[inputBaseStyle, error ? inputErrorStyle : inputNormalStyle]}
        aria-invalid={Boolean(error)}
        aria-describedby={mergedDescribedBy}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} css={errorStyle} role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} css={hintStyle}>
          {hint}
        </p>
      )}
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

const inputBaseStyle = css({
  width: '100%',
  height: '40px',
  padding: '0 0.875rem',
  fontSize: '0.9375rem',
  color: '#111827',
  backgroundColor: '#ffffff',
  border: '1.5px solid',
  borderRadius: '8px',
  outline: 'none',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease',

  '&::placeholder': {
    color: '#9ca3af',
  },

  '&:disabled': {
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
});

const inputNormalStyle = css({
  borderColor: '#d1d5db',
  '&:focus': {
    borderColor: '#f97316',
    boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.18)',
  },
  '&:hover:not(:disabled):not(:focus)': {
    borderColor: '#9ca3af',
  },
});

const inputErrorStyle = css({
  borderColor: '#ef4444',
  '&:focus': {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.12)',
  },
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

export default Input;
