import { css } from '@emotion/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface CardRootProps extends ComponentPropsWithoutRef<'article'> {
  children: ReactNode;
}

interface CardContentProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

interface CardTitleProps extends ComponentPropsWithoutRef<'h2'> {
  children: ReactNode;
}

interface CardDescriptionProps extends ComponentPropsWithoutRef<'p'> {
  children: ReactNode;
}

function Root({ children, ...rest }: CardRootProps) {
  return (
    <article css={rootStyle} {...rest}>
      {children}
    </article>
  );
}

function Content({ children, ...rest }: CardContentProps) {
  return (
    <div css={contentStyle} {...rest}>
      {children}
    </div>
  );
}

function Title({ children, ...rest }: CardTitleProps) {
  return (
    <h2 css={titleStyle} {...rest}>
      {children}
    </h2>
  );
}

function Description({ children, ...rest }: CardDescriptionProps) {
  return (
    <p css={descriptionStyle} {...rest}>
      {children}
    </p>
  );
}

const rootStyle = css({
  display: 'grid',
  gap: '16px',
  padding: '20px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  color: '#111827',
  boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
});

const contentStyle = css({
  display: 'grid',
  gap: '12px',
});

const titleStyle = css({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: '#111827',
});

const descriptionStyle = css({
  margin: 0,
  color: '#6b7280',
  lineHeight: 1.5,
});

export const Card = {
  Root,
  Content,
  Title,
  Description,
};
