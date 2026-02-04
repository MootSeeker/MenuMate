# MenuMate Design System

## Overview

This document defines the visual design system for MenuMate, including colors, typography, spacing, and component guidelines.

---

## Color Palette

### Primary Colors - Fresh Green (Health & Vitality)

The primary color represents health, freshness, and vitality - perfect for a calorie tracking app.

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-50` | `#f0fdf4` | Background tint |
| `primary-100` | `#dcfce7` | Light background |
| `primary-200` | `#bbf7d0` | Hover states |
| `primary-300` | `#86efac` | Active states |
| `primary-400` | `#4ade80` | Secondary emphasis |
| `primary-500` | `#22c55e` | **Main primary color** |
| `primary-600` | `#16a34a` | Pressed states |
| `primary-700` | `#15803d` | Dark emphasis |
| `primary-800` | `#166534` | Heavy emphasis |
| `primary-900` | `#14532d` | Text on light |
| `primary-950` | `#052e16` | Darkest shade |

### Secondary Colors - Warm Orange (Energy & Appetite)

Secondary color for energy, appetite, and calls-to-action.

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary-50` | `#fff7ed` | Background tint |
| `secondary-100` | `#ffedd5` | Light background |
| `secondary-200` | `#fed7aa` | Hover states |
| `secondary-300` | `#fdba74` | Active states |
| `secondary-400` | `#fb923c` | Secondary emphasis |
| `secondary-500` | `#f97316` | **Main secondary color** |
| `secondary-600` | `#ea580c` | Pressed states |
| `secondary-700` | `#c2410c` | Dark emphasis |
| `secondary-800` | `#9a3412` | Heavy emphasis |
| `secondary-900` | `#7c2d12` | Text on light |
| `secondary-950` | `#431407` | Darkest shade |

### Accent Colors - Teal (Trust & Calm)

Accent color for trust, calm, and informational elements.

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-50` | `#f0fdfa` | Background tint |
| `accent-100` | `#ccfbf1` | Light background |
| `accent-200` | `#99f6e4` | Hover states |
| `accent-300` | `#5eead4` | Active states |
| `accent-400` | `#2dd4bf` | Secondary emphasis |
| `accent-500` | `#14b8a6` | **Main accent color** |
| `accent-600` | `#0d9488` | Pressed states |
| `accent-700` | `#0f766e` | Dark emphasis |
| `accent-800` | `#115e59` | Heavy emphasis |
| `accent-900` | `#134e4a` | Text on light |
| `accent-950` | `#042f2e` | Darkest shade |

### Semantic Colors

Used for feedback and status indication.

#### Success (Green)
| Token | Hex |
|-------|-----|
| `success-500` | `#22c55e` |
| `success-600` | `#16a34a` |
| `success-700` | `#15803d` |

#### Warning (Amber)
| Token | Hex |
|-------|-----|
| `warning-500` | `#f59e0b` |
| `warning-600` | `#d97706` |
| `warning-700` | `#b45309` |

#### Error (Red)
| Token | Hex |
|-------|-----|
| `error-500` | `#ef4444` |
| `error-600` | `#dc2626` |
| `error-700` | `#b91c1c` |

#### Info (Blue)
| Token | Hex |
|-------|-----|
| `info-500` | `#3b82f6` |
| `info-600` | `#2563eb` |
| `info-700` | `#1d4ed8` |

### Macro Nutrient Colors

Consistent colors for macronutrient visualization.

| Macro | Color | Hex | Usage |
|-------|-------|-----|-------|
| Protein | Blue | `#3b82f6` | Charts, labels |
| Carbohydrates | Amber | `#f59e0b` | Charts, labels |
| Fat | Red | `#ef4444` | Charts, labels |

### Background & Surface Colors

#### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#ffffff` | Main app background |
| `background-secondary` | `#f9fafb` | Secondary background |
| `background-tertiary` | `#f3f4f6` | Tertiary background |
| `surface` | `#ffffff` | Card surface |
| `surface-elevated` | `#ffffff` | Elevated surfaces |

#### Dark Mode (CSS Variables)
Dark mode colors are applied via the `dark:` prefix in NativeWind.

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#111827` | Main app background |
| `background-secondary` | `#1f2937` | Secondary background |
| `background-tertiary` | `#374151` | Tertiary background |
| `surface` | `#1f2937` | Card surface |
| `surface-elevated` | `#374151` | Elevated surfaces |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `foreground` | `#111827` | Primary text |
| `foreground-secondary` | `#4b5563` | Secondary text |
| `foreground-tertiary` | `#9ca3af` | Tertiary/muted text |
| `foreground-inverse` | `#ffffff` | Text on dark backgrounds |

### Border Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `border` | `#e5e7eb` | Default border |
| `border-strong` | `#d1d5db` | Emphasized border |

---

## Typography

### Font Family

MenuMate uses the system font for optimal performance and native feel:
- **iOS**: San Francisco
- **Android**: Roboto

### Type Scale

#### Headings

| Style | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-heading-1` | 32px | 40px | Bold (700) | Page titles |
| `text-heading-2` | 24px | 32px | Bold (700) | Section headers |
| `text-heading-3` | 20px | 28px | Semi-bold (600) | Subsections |
| `text-heading-4` | 18px | 24px | Semi-bold (600) | Card titles |

#### Body Text

| Style | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-body-lg` | 18px | 28px | Regular (400) | Large body text |
| `text-body-md` | 16px | 24px | Regular (400) | Default body text |
| `text-body-sm` | 14px | 20px | Regular (400) | Small body text |

#### Supporting Text

| Style | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-caption` | 12px | 16px | Regular (400) | Captions, hints |
| `text-label` | 14px | 20px | Medium (500) | Labels, buttons |

### Usage Examples

```tsx
// NativeWind classes
<Text className="text-heading-1 text-foreground">Page Title</Text>
<Text className="text-body-md text-foreground-secondary">Body text</Text>
<Text className="text-caption text-foreground-tertiary">Caption</Text>
```

---

## Spacing

MenuMate uses a 4px base unit for consistent spacing.

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight spacing |
| `2` | 8px | Compact spacing |
| `3` | 12px | Small spacing |
| `4` | 16px | Default spacing |
| `5` | 20px | Medium spacing |
| `6` | 24px | Large spacing |
| `8` | 32px | Section spacing |
| `10` | 40px | Large section spacing |
| `12` | 48px | Extra large spacing |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-none` | 0px | No rounding |
| `rounded-sm` | 2px | Subtle rounding |
| `rounded` | 4px | Default rounding |
| `rounded-md` | 6px | Medium rounding |
| `rounded-lg` | 8px | Card rounding |
| `rounded-xl` | 12px | Modal rounding |
| `rounded-2xl` | 16px | Large rounding |
| `rounded-3xl` | 24px | Extra large rounding |
| `rounded-4xl` | 32px | Maximum rounding |
| `rounded-full` | 9999px | Circular elements |

---

## Shadows

| Token | Usage |
|-------|-------|
| `shadow-card-sm` | Subtle card shadow |
| `shadow-card` | Default card shadow |
| `shadow-card-lg` | Elevated card shadow |

---

## Component Guidelines

### Buttons

Buttons follow a consistent pattern across the app:

| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| Primary | `bg-primary-500` | White | Main actions |
| Secondary | `bg-secondary-500` | White | Secondary actions |
| Outline | Transparent | `text-primary-500` | Tertiary actions |
| Ghost | Transparent | `text-foreground` | Subtle actions |
| Destructive | `bg-error-500` | White | Destructive actions |

### Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| Small | 32px | 12px | 14px |
| Medium | 40px | 16px | 16px |
| Large | 48px | 20px | 18px |

### Cards

| Variant | Style |
|---------|-------|
| Elevated | White background with shadow |
| Outlined | Border, no shadow |
| Flat | Background color, no border/shadow |

---

## Dark Mode

Dark mode is enabled via the `dark:` prefix in NativeWind.

Example usage:
```tsx
<View className="bg-background dark:bg-gray-900">
  <Text className="text-foreground dark:text-white">
    Content
  </Text>
</View>
```

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for normal text
- Minimum touch target: 44x44 points
- All interactive elements must have `accessibilityRole`
- Use `accessibilityLabel` for icon-only buttons

---

## Implementation

All design tokens are defined in `tailwind.config.js` and can be used via NativeWind classes:

```tsx
// Colors
className="bg-primary-500 text-foreground"

// Typography
className="text-heading-1 font-bold"

// Spacing
className="p-4 mt-6"

// Borders
className="rounded-lg border border-border"
```
