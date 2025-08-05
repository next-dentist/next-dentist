export const SIZE_CLASSES = {
  sm: 'h-8 text-xs px-2',
  md: 'h-10 text-sm px-3',
  lg: 'h-12 text-base px-4',
  xl: 'h-16 text-lg px-6',
} as const;

export const VARIANT_CLASSES = {
  default: 'border-input bg-background hover:bg-accent/5',
  minimal: 'border-transparent bg-muted/30 hover:bg-muted/50',
  prominent:
    'border-2 border-primary/20 bg-background shadow-lg hover:shadow-xl hover:border-primary/30',
  glass: 'border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20',
} as const;