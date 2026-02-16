# Framer Motion Type Error Fix

## Issue
TypeScript error in HeroSection.tsx line 111 - `ease` property type mismatch.

## Solution
Change the `itemVariants` ease property from a string to a proper Framer Motion easing type:

```typescript
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.6, 
      ease: "easeOut" as const  // Add type assertion
    } 
  }
};
```

Or use an easing array:
```typescript
ease: [0.6, 0.01, -0.05, 0.95]
```

Valid ease values: `"easeIn"`, `"easeOut"`, `"easeInOut"`, `"linear"`, `"anticipate"`, `"backIn"`, `"backOut"`, `"backInOut"`, `"circIn"`, `"circOut"`, `"circInOut"`, or a cubic bezier array.
