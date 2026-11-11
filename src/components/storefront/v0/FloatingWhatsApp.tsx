import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteContent } from '../../../context/SiteContentContext'

export interface FloatingWhatsAppProps {
  phoneNumber?: string
  defaultMessage?: string
  enabled?: boolean
}

/**
 * Authentic Official WhatsApp Brand Vector Icon
 */
const WhatsAppOfficialIcon: React.FC<{ className?: string }> = ({ className = 'size-7' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  phoneNumber,
  defaultMessage,
  enabled,
}) => {
  const { content } = useSiteContent()
  const [isHovered, setIsHovered] = useState(false)

  const isEnabled = enabled !== undefined ? enabled : (content.whatsappFloatingEnabled ?? true)

  if (!isEnabled) {
    return null
  }

  const rawPhone = phoneNumber || content.whatsappNumber || '966598956580'
  const cleanPhone = rawPhone.replace(/\D/g, '').replace(/^0/, '966')
  const effectiveMessage =
    defaultMessage ||
    content.whatsappFloatingMessage ||
    'مرحباً هشوشة 🌿، أود الاستفسار بخصوص قائمة البابكا والمخبوزات الفاخرة ومواعيد التوصيل بالرياض...'

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(effectiveMessage)}`

  return (
    <aside
      aria-label="قناة التواصل الفوري عبر الواتساب"
      className="fixed z-30 bottom-24 sm:bottom-6 left-4 sm:left-6 flex items-center pointer-events-auto"
      dir="rtl"
    >
      <div className="relative flex items-center">
        {/* Desktop Tooltip Label */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="hidden sm:flex absolute right-full ml-3 mr-3 items-center whitespace-nowrap rounded-xl border border-emerald-600/20 bg-card px-3.5 py-1.5 shadow-lg"
            >
              <span className="text-xs font-bold text-foreground">
                تواصل مع الضيافة
              </span>
              <span className="size-2 rounded-full bg-emerald-500 mr-2 shrink-0 animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pulsing Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex size-12 sm:size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_-5px_rgba(37,211,102,0.45)] ring-4 ring-[#25D366]/25 hover:ring-[#25D366]/40 transition-all duration-300 active:scale-95 hover:scale-105"
          aria-label="تواصل مع هشوشة عبر واتساب"
          title="تواصل مع الضيافة عبر واتساب"
        >
          {/* Subtle Heartbeat Ring Glow */}
          <span
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-pulse pointer-events-none"
            aria-hidden="true"
          />

          <WhatsAppOfficialIcon className="size-6 sm:size-7 text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
        </a>
      </div>
    </aside>
  )
}

export default FloatingWhatsApp
