import React, { useState } from 'react'
import { Search, Globe, Save, CheckCircle2, AlertCircle, Leaf, Star } from 'lucide-react'
import { SeoSettings } from '../../../types/admin'
import { saveSeoSettings } from '../../../services/adminService'

export interface SeoModuleProps {
  seoSettings: SeoSettings
  onUpdateSeoSettings: (settings: SeoSettings) => void
}

export const SeoModule: React.FC<SeoModuleProps> = ({
  seoSettings,
  onUpdateSeoSettings,
}) => {
  const [siteTitle, setSiteTitle] = useState(seoSettings.siteTitle)
  const [siteDescription, setSiteDescription] = useState(seoSettings.siteDescription)
  const [keywords, setKeywords] = useState(seoSettings.keywords)
  const [ogImage, setOgImage] = useState(seoSettings.ogImage)

  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg(null)

    const updated: SeoSettings = {
      ...seoSettings,
      siteTitle: siteTitle.trim(),
      siteDescription: siteDescription.trim(),
      keywords: keywords.trim(),
      ogImage: ogImage.trim(),
    }

    try {
      const res = await saveSeoSettings(updated)
      if (res.success) {
        onUpdateSeoSettings(updated)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hashousha_seo_updated', { detail: updated }))
        }
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 3000)
      } else {
        setErrorMsg(res.error || 'تعذر حفظ إعدادات السيو')
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'تعذر الاتصال بالخادم')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-foreground flex items-center gap-2">
          <Search className="size-5 text-primary" />
          <span>إعدادات تحسين محركات البحث (SEO & Discovery)</span>
        </h2>
        <p className="text-xs text-muted-foreground">
          التحكم في عنوان المتجر الرئيسي، وسوم الوصف لمحركات البحث وجوجل، والكلمات المفتاحية الخاصة بأحياء الرياض.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/70 p-3 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-emerald-700" />
          <span>تم حفظ ونشر إعدادات السيو بنجاح!</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 p-3 text-xs text-rose-900 flex items-center gap-2">
          <AlertCircle className="size-4 text-rose-700" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Settings */}
        <form onSubmit={handleSave} className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm text-right">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              عنوان المتجر في محرك البحث (Title Tag)
            </label>
            <input
              type="text"
              required
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold focus:border-primary focus:outline-none"
            />
            <p className="text-[10px] text-muted-foreground">
              الطول الموصى به: 50-60 حرفاً ({siteTitle.length} حرفاً حالياً)
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              وصف الميتا لمحركات البحث (Meta Description)
            </label>
            <textarea
              rows={3}
              required
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold focus:border-primary focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground">
              الطول الموصى به: 120-160 حرفاً ({siteDescription.length} حرفاً حالياً)
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              الكلمات المفتاحية لأحياء ومناطق الرياض (Keywords)
            </label>
            <textarea
              rows={2}
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              صورة المعاينة في منصات التواصل (OG Image URL)
            </label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-mono text-left focus:border-primary focus:outline-none"
              dir="ltr"
            />
          </div>

          <div className="pt-2 border-t border-border/60">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md w-full disabled:opacity-50"
            >
              <Save className="size-4" />
              <span>{saving ? 'جاري الحفظ...' : 'حفظ ونشر إعدادات السيو'}</span>
            </button>
          </div>
        </form>

        {/* Live Google Search Snippet Preview */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm text-right">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Globe className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">معاينة نتيجة البحث في جوجل (Google SERP Preview)</h3>
          </div>

          <p className="text-xs text-muted-foreground">
            هكذا تظهر نتائج البحث لمتجر هشوشة عندما يبحث العملاء في جوجل:
          </p>

          {/* Google SERP Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm space-y-1 text-right font-sans" dir="rtl">
            <div className="flex items-center gap-2 text-xs text-neutral-800">
              <span className="size-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Leaf className="size-3" />
              </span>
              <span className="font-semibold">متجر هشوشة</span>
              <span className="text-neutral-400" dir="ltr">https://hashousha.com</span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-[#1a0dab] hover:underline cursor-pointer pt-1 line-clamp-1">
              {siteTitle || 'هشوشة (Hashousha) | متجر البابكا الحرفية والمخبوزات الفاخرة بالرياض'}
            </h4>

            <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
              {siteDescription || 'أشهى روائع البابكا الحرفية والمخبوزات الطازجة بحشوات النوتيلا والبيكان، البيستو والصنوبر، والأجبان والزعتر.'}
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-800">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>4.9 (128 تقييم)</span>
              </span>
              <span>·</span>
              <span>ساعات العمل: مفتوح الآن</span>
              <span>·</span>
              <span>توصيل لجميع أحياء الرياض</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
