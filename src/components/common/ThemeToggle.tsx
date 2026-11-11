import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'

export interface ThemeToggleProps {
  variant?: 'round' | 'rect'
  className?: string
  iconSize?: number
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'round',
  className = '',
  iconSize = 20,
}) => {
  const { isDark, toggleTheme, darkModeEnabled } = useTheme()

  if (!darkModeEnabled) {
    return null
  }

  const label = isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي الفندقي'

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        'relative inline-flex items-center justify-center transition-colors cursor-pointer select-none',
        variant === 'round'
          ? 'size-10 rounded-full text-foreground/80 hover:bg-secondary hover:text-foreground'
          : 'rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground',
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun-icon"
            initial={{ rotate: -60, opacity: 0, scale: 0.75 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 60, opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center justify-center text-amber-400"
          >
            <Sun size={iconSize} strokeWidth={1.5} />
          </motion.div>
        ) : (
          <motion.div
            key="moon-icon"
            initial={{ rotate: -60, opacity: 0, scale: 0.75 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 60, opacity: 0, scale: 0.75 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center justify-center text-foreground/80 hover:text-foreground"
          >
            <Moon size={iconSize} strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default ThemeToggle
