import React from 'react';
import { Search, X, Sparkles, Flame, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useCatalogStore } from '../../store/useCatalogStore';

export const HeroBanner: React.FC = () => {
  const searchQuery = useCatalogStore((state) => state.searchQuery);
  const setSearchQuery = useCatalogStore((state) => state.setSearchQuery);

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-olive-900 via-olive-950 to-olive-900 text-white shadow-gourmet-lg border border-olive-800 transition-all duration-300">
      {/* Warm Ambient Decorative Orbs */}
      <div className="absolute top-0 left-0 w-80 sm:w-96 h-80 sm:h-96 bg-honey-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-72 sm:w-80 h-72 sm:h-80 bg-pomegranate-600/15 rounded-full blur-3xl pointer-events-none translate-x-1/4 translate-y-1/4" />

      <div className="relative z-10 px-6 sm:px-10 py-8 sm:py-12 max-w-4xl space-y-6">
        {/* Hospitality Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-olive-800/80 border border-olive-700/70 text-honey-100 text-xs font-readex font-medium backdrop-blur-sm shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-honey-500 shrink-0" />
          <span>أهلاً بكم في مائدة هشوشة — ضيافة سعودية فاخرة</span>
        </div>

        {/* Hero Title & Sensory Description */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black leading-tight sm:leading-tight tracking-tight text-surface-warm drop-shadow-sm">
            محاشي بيتوتية غنية بالخلطة السرية & حلويات شرقية فاخرة
          </h2>
          <p className="text-sm sm:text-base md:text-lg font-readex text-olive-100/90 leading-relaxed font-light max-w-2xl">
            نلف ورق العنب والملفوف يدوياً حبة حبة، ونسقيه بدبس الرمان الجبلي وزيت الزيتون البكر لنقدم لكم نكهة تذوب في الفم مع كل لقمة.
          </p>
        </div>

        {/* Live Search Input Bar (Touch-friendly 44px+) */}
        <div className="relative max-w-xl pt-1">
          <div className="relative flex items-center">
            <div className="absolute right-4 pointer-events-none text-olive-300">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن طبقك المفضل (ورق عنب، ملفوف، صواني، كوكيز...)"
              className="w-full h-12 sm:h-14 pr-12 pl-12 rounded-2xl bg-olive-950/70 backdrop-blur-md border border-olive-700/80 text-surface-warm placeholder-olive-300/70 font-readex text-sm focus:outline-none focus:ring-2 focus:ring-honey-500/80 focus:border-transparent transition-all shadow-gourmet-sm"
              dir="rtl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 w-8 h-8 rounded-full bg-olive-800/80 hover:bg-olive-700 flex items-center justify-center text-olive-200 hover:text-white transition-colors"
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-olive-800/80">
          <div className="flex items-center gap-2.5 text-xs font-readex text-olive-100/90">
            <span className="w-7 h-7 rounded-xl bg-olive-800/70 border border-olive-700 flex items-center justify-center shrink-0 text-emerald-400">
              <Clock className="w-4 h-4" />
            </span>
            <span>طازج يومياً على نار هادئة</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-readex text-olive-100/90">
            <span className="w-7 h-7 rounded-xl bg-olive-800/70 border border-olive-700 flex items-center justify-center shrink-0 text-honey-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span>زيت زيتون بكر ودبس بلدي</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-readex text-olive-100/90">
            <span className="w-7 h-7 rounded-xl bg-olive-800/70 border border-olive-700 flex items-center justify-center shrink-0 text-pomegranate-400">
              <Flame className="w-4 h-4" />
            </span>
            <span>توصيل ساخن في أرجاء الرياض</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-readex text-olive-100/90">
            <span className="w-7 h-7 rounded-xl bg-olive-800/70 border border-olive-700 flex items-center justify-center shrink-0 text-honey-400">
              <HeartHandshake className="w-4 h-4" />
            </span>
            <span>جودة ونظافة نضمنها لك</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
