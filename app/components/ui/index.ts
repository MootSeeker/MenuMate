/**
 * MenuMate UI Component Library
 *
 * A comprehensive set of reusable UI components built with
 * NativeWind (Tailwind CSS) for consistent styling.
 */

// Typography
export {
  Text,
  Heading,
  Paragraph,
  Caption,
  Label,
  type TextProps,
  type HeadingProps,
  type ParagraphProps,
  type TypographyVariant,
  type TypographyColor,
} from './Text';

// Buttons
export {
  Button,
  IconButton,
  type ButtonProps,
  type IconButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './Button';

// Inputs
export { Input, TextArea, type InputProps, type TextAreaProps, type InputType } from './Input';

// Cards
export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardContentProps,
  type CardFooterProps,
  type CardVariant,
  type CardPadding,
} from './Card';

// Avatar
export { Avatar, type AvatarProps, type AvatarSize } from './Avatar';

// Badge
export { Badge, type BadgeProps, type BadgeVariant, type BadgeSize } from './Badge';

// Progress
export {
  ProgressBar,
  type ProgressBarProps,
  type ProgressBarVariant,
  type ProgressBarSize,
} from './ProgressBar';

export {
  ProgressRing,
  type ProgressRingProps,
  type ProgressRingVariant,
  type ProgressRingSize,
} from './ProgressRing';

// Divider
export { Divider, type DividerProps, type DividerOrientation } from './Divider';

// Feedback
export { Toast, type ToastProps, type ToastVariant, type ToastPosition } from './Toast';

// Overlays
export { Modal, type ModalProps } from './Modal';

export { BottomSheet, type BottomSheetProps } from './BottomSheet';
