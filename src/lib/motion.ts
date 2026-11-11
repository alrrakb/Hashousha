// Shared Framer Motion Physics & Tokens — Luxury Hospitality Standard
// Hashousha (هشوشة)

export const luxurySpring = {
  type: "spring",
  damping: 25,
  stiffness: 300,
  mass: 0.8,
} as const

export const tactileTap = {
  scale: 0.88,
  transition: { type: "spring", stiffness: 500, damping: 15 },
} as const

export const badgePop = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { type: "spring", stiffness: 450, damping: 18 },
} as const

export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.18, ease: "easeIn" },
  },
} as const

export const modalDialogVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", damping: 26, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.15, ease: "easeIn" },
  },
} as const
