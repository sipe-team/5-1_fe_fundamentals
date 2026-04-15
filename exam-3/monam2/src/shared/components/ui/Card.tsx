import { css } from '@emotion/react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface CardRootProps extends ComponentPropsWithoutRef<'article'> {
  children: ReactNode;
}

interface CardImageProps extends Omit<ComponentPropsWithoutRef<'img'>, 'alt'> {
  alt: string;
}

interface CardContentProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}

interface CardTitleProps extends ComponentPropsWithoutRef<'strong'> {
  children: ReactNode;
}

interface CardMetaProps extends ComponentPropsWithoutRef<'span'> {
  children: ReactNode;
}

function Root({ children, ...rest }: CardRootProps) {
  return (
    <article css={rootStyle} {...rest}>
      {children}
    </article>
  );
}

function Image(props: CardImageProps) {
  const { alt, ...rest } = props;

  return <img css={imageStyle} alt={alt} {...rest} />;
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
    <strong css={titleStyle} {...rest}>
      {children}
    </strong>
  );
}

function Meta({ children, ...rest }: CardMetaProps) {
  return (
    <span css={metaStyle} {...rest}>
      {children}
    </span>
  );
}

const rootStyle = css({
  display: 'grid',
  gap: '12px',
  padding: '16px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  color: '#111827',
});

const imageStyle = css({
  width: '64px',
  height: '64px',
  objectFit: 'contain',
});

const contentStyle = css({
  display: 'grid',
  gap: '4px',
  color: '#4b5563',
});

const titleStyle = css({
  color: '#111827',
  fontWeight: 700,
});

const metaStyle = css({
  color: 'inherit',
});

const Card = {
  Root,
  Image,
  Content,
  Title,
  Meta,
};

export default Card;
