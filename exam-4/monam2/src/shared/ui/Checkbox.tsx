import { css } from '@emotion/react';
import { forwardRef, type InputHTMLAttributes, useEffect, useRef } from 'react';

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, indeterminate = false, id, ...rest },
  ref,
) {
  const localRef = useRef<HTMLInputElement>(null);
  const inputRef =
    typeof ref === 'function' || ref === null ? localRef : (ref ?? localRef);
  const checkboxId =
    id ?? `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  useEffect(() => {
    const target =
      typeof inputRef === 'object' && inputRef.current
        ? inputRef.current
        : null;

    if (target) {
      target.indeterminate = indeterminate;
    }
  }, [indeterminate, inputRef]);

  return (
    <label css={wrapperStyle} htmlFor={checkboxId}>
      <input
        ref={inputRef}
        id={checkboxId}
        type="checkbox"
        css={hiddenInput}
        {...rest}
      />
      <span css={checkboxStyle} aria-hidden="true" />
      <span css={labelGroupStyle}>
        <span css={labelStyle}>{label}</span>
        {description ? <span css={descriptionStyle}>{description}</span> : null}
      </span>
    </label>
  );
});

const wrapperStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.625rem',
  cursor: 'pointer',
  userSelect: 'none',

  '&:has(input:disabled)': {
    cursor: 'not-allowed',
    opacity: 0.45,
  },
});

const hiddenInput = css({
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0,
  margin: 0,

  '&:checked + span, &:indeterminate + span': {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },

  '&:checked + span::after': {
    opacity: 1,
    transform: 'rotate(45deg) scale(1)',
  },

  '&:indeterminate + span::after': {
    opacity: 1,
    transform: 'scale(1)',
    left: '3px',
    top: '7px',
    width: '10px',
    height: '2px',
    border: 'none',
    backgroundColor: '#ffffff',
  },

  '&:focus-visible + span': {
    boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.18)',
  },
});

const checkboxStyle = css({
  position: 'relative',
  flexShrink: 0,
  width: '18px',
  height: '18px',
  border: '1.5px solid #d1d5db',
  borderRadius: '4px',
  backgroundColor: '#ffffff',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',

  '&::after': {
    content: '""',
    position: 'absolute',
    left: '5px',
    top: '2px',
    width: '5px',
    height: '9px',
    border: '2px solid #ffffff',
    borderTop: 'none',
    borderLeft: 'none',
    opacity: 0,
    transform: 'rotate(45deg) scale(0.6)',
    transition: 'opacity 0.12s ease, transform 0.12s ease',
  },
});

const labelGroupStyle = css({
  display: 'grid',
  gap: '2px',
});

const labelStyle = css({
  fontSize: '0.9375rem',
  color: '#374151',
  lineHeight: 1.4,
});

const descriptionStyle = css({
  fontSize: '0.8125rem',
  color: '#6b7280',
  lineHeight: 1.4,
});

export default Checkbox;
