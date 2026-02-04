import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cssInterop } from 'nativewind';

// Enable NativeWind styling for Text
cssInterop(RNText, { className: 'style' });

/**
 * Typography variant types for the MenuMate design system
 */
export type TypographyVariant =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption'
  | 'label';

/**
 * Typography color types
 */
export type TypographyColor =
  | 'default'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'primary'
  | 'error'
  | 'success'
  | 'warning';

export interface TextProps extends Omit<RNTextProps, 'style'> {
  /** Typography variant defining size, weight, and line height */
  variant?: TypographyVariant;
  /** Text color */
  color?: TypographyColor;
  /** Additional NativeWind classes */
  className?: string;
  /** Children content */
  children: React.ReactNode;
}

/**
 * Mapping of variants to NativeWind classes
 */
const variantClasses: Record<TypographyVariant, string> = {
  'heading-1': 'text-heading-1',
  'heading-2': 'text-heading-2',
  'heading-3': 'text-heading-3',
  'heading-4': 'text-heading-4',
  'body-lg': 'text-body-lg',
  'body-md': 'text-body-md',
  'body-sm': 'text-body-sm',
  caption: 'text-caption',
  label: 'text-label',
};

/**
 * Mapping of colors to NativeWind classes
 */
const colorClasses: Record<TypographyColor, string> = {
  default: 'text-foreground dark:text-gray-50',
  secondary: 'text-foreground-secondary dark:text-gray-300',
  tertiary: 'text-foreground-tertiary dark:text-gray-500',
  inverse: 'text-foreground-inverse dark:text-gray-900',
  primary: 'text-primary-500 dark:text-primary-400',
  error: 'text-error-500 dark:text-error-400',
  success: 'text-success-500 dark:text-success-400',
  warning: 'text-warning-500 dark:text-warning-400',
};

/**
 * Text component with built-in typography variants
 *
 * @example
 * ```tsx
 * <Text variant="heading-1">Page Title</Text>
 * <Text variant="body-md" color="secondary">Description text</Text>
 * <Text variant="caption" color="tertiary">Small caption</Text>
 * ```
 */
export function Text({
  variant = 'body-md',
  color = 'default',
  className = '',
  children,
  ...props
}: TextProps) {
  const variantClass = variantClasses[variant];
  const colorClass = colorClasses[color];

  return (
    <RNText
      className={`${variantClass} ${colorClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </RNText>
  );
}

// Convenience components for common typography patterns

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  /** Heading level (1-4) */
  level?: 1 | 2 | 3 | 4;
}

/**
 * Heading component
 *
 * @example
 * ```tsx
 * <Heading level={1}>Page Title</Heading>
 * <Heading level={2}>Section Title</Heading>
 * ```
 */
export function Heading({ level = 1, ...props }: HeadingProps) {
  const variant = `heading-${level}` as TypographyVariant;
  return <Text variant={variant} {...props} />;
}

/**
 * Paragraph component for body text
 *
 * @example
 * ```tsx
 * <Paragraph>This is a paragraph of text.</Paragraph>
 * <Paragraph size="sm" color="secondary">Smaller secondary text.</Paragraph>
 * ```
 */
export interface ParagraphProps extends Omit<TextProps, 'variant'> {
  /** Size variant */
  size?: 'lg' | 'md' | 'sm';
}

export function Paragraph({ size = 'md', ...props }: ParagraphProps) {
  const variant = `body-${size}` as TypographyVariant;
  return <Text variant={variant} {...props} />;
}

/**
 * Caption component for small text
 *
 * @example
 * ```tsx
 * <Caption>Image caption or hint text</Caption>
 * ```
 */
export function Caption(props: Omit<TextProps, 'variant'>) {
  return <Text variant="caption" color="tertiary" {...props} />;
}

/**
 * Label component for form labels
 *
 * @example
 * ```tsx
 * <Label>Email Address</Label>
 * ```
 */
export function Label(props: Omit<TextProps, 'variant'>) {
  return <Text variant="label" {...props} />;
}

export default Text;
