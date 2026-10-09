import { createElement, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

export type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'label' | 'caption';
export type TextTone = 'default' | 'secondary' | 'muted' | 'accent';

type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'label' | 'span';

export type TextProps<T extends ElementType = TextTag> = Omit<ComponentPropsWithoutRef<T>, 'as' | 'color' | 'children'> & {
  as?: T;
  variant?: TextVariant;
  tone?: TextTone;
  children?: ReactNode;
};

const defaultTags: Record<TextVariant, TextTag> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  label: 'label',
  caption: 'span'
};

const toneClasses: Record<TextTone, string> = {
  default: 'text-foreground',
  secondary: 'text-foreground-secondary',
  muted: 'text-foreground-muted',
  accent: 'text-accent-text'
};

const variantClasses: Record<TextVariant, string> = {
  display: 'font-display text-display font-extrabold tracking-tight',
  h1: 'font-headings text-h1 font-extrabold tracking-tight',
  h2: 'font-headings text-h2 font-bold tracking-tight',
  h3: 'font-headings text-h3 font-bold',
  h4: 'font-headings text-h4 font-semibold',
  body: 'font-sans text-body',
  label: 'font-sans text-label font-semibold',
  caption: 'font-sans text-caption'
};

export function Text<T extends ElementType = 'p'>(input: TextProps<T>) {
  const { as, variant = 'body', tone = 'default', ...props } = input;
  const className = typeof (props as Record<string, unknown>).className === 'string'
    ? (props as Record<string, unknown>).className as string
    : '';
  const Component = as ?? (defaultTags[variant] as T);
  const elementProps = {
    ...(props as Record<string, unknown>),
    className: `${variantClasses[variant]} ${toneClasses[tone]} ${className}`
  } as ComponentPropsWithoutRef<T>;
  return createElement(Component, elementProps);
}
