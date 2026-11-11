import React from 'react';
import { ShoppingBag, MessageCircle, Sparkles, Clock, Leaf } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContentContext';

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
  whatsappNumber?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  onCartClick,
  whatsappNumber,
}) => {
  const { content } = useSiteContent();
  const effectiveWaNumber = whatsappNumber || content.whatsappNumber || '966560602341';
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface-warm/95 border-b border-surface-border transition-all duration-200">
      {/* Top Banner Notice (Mobile & Desktop) */}
      <div className="bg-olive-900 text-olive-50 py-1.5 px-4 text-xs font-readex flex items-center justify-between border-b border-olive-800">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">نستقبل طلباتكم الآن — تحضير طازج يومياً</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-olive-200">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-honey-500" />
              <span>التوصيل: ١:٠٠ ظهراً - ١١:٠٠ مساءً</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Right (in RTL): Brand Identity & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-olive-800 to-olive-950 flex items-center justify-center shadow-gourmet-sm border border-olive-700/40 group-hover:scale-105 transition-transform duration-200">
              <Leaf className="size-6 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-pomegranate-600 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm ring-2 ring-surface-warm">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-olive-950 tracking-tight">
                هشوشة
              </h1>
              <span className="hidden xs:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-honey-100 text-honey-800 border border-honey-500/20">
                فاخر
              </span>
            </div>
            <p className="text-xs sm:text-sm font-readex text-text-secondary font-medium">
              محاشي فاخرة & حلويات شرقية
            </p>
          </div>
        </div>

        {/* Center: Live Order Status Pill (Desktop only) */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive-50 border border-olive-200/80 text-olive-800 text-xs font-readex">
          <span className="w-2 h-2 rounded-full bg-olive-500 animate-ping" />
          <span className="font-semibold">توصيل سريع وساخن إلى باب منزلك</span>
        </div>

        {/* Left (in RTL): Action Controls (WhatsApp Direct & Cart Trigger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WhatsApp Direct Inquiries */}
          <a
            href={`https://wa.me/${effectiveWaNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل عبر الواتساب"
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-readex font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">طلب خاص</span>
          </a>

          {/* Cart Trigger Button */}
          <button
            onClick={onCartClick}
            type="button"
            className="relative flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-pomegranate-600 hover:bg-pomegranate-700 text-white shadow-gourmet-md shadow-pomegranate-600/20 active:scale-95 transition-all duration-150 group"
            aria-label="سلة المشتريات"
          >
            <ShoppingBag className="w-5 h-5 group-hover:rotate-6 transition-transform duration-200" />
            <span className="hidden sm:inline mr-2 text-xs font-bold font-readex">
              السلة
            </span>

            {/* Cart Counter Badge with aria-live */}
            {cartCount > 0 ? (
              <span
                aria-live="polite"
                aria-atomic="true"
                className="absolute -top-1.5 -left-1.5 min-w-[20px] h-5 px-1 rounded-full bg-honey-500 text-olive-950 text-[11px] font-black font-readex flex items-center justify-center shadow-sm ring-2 ring-surface-warm animate-in zoom-in"
              >
                {cartCount}
              </span>
            ) : (
              <span className="hidden sm:flex absolute -top-1 -left-1 w-3 h-3 bg-honey-500 rounded-full ring-2 ring-surface-warm" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
