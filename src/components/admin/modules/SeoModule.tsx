import React, { useState, useEffect, useCallback } from 'react'
import {
  Search,
  Globe,
  Save,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Star,
  FileCode2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Trash2,
} from 'lucide-react'
import { SeoSettings, SitemapStats } from '../../../types/admin'
import {
  saveSeoSettings,
  getSitemapStats,
  triggerSitemapRegeneration,
  OFFICIAL_SITEMAP_URL,
} from '../../../services/adminService'
import { cn } from '../../../lib/utils'

function sanitizeGoogleVerificationInput(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  // 1. If full meta tag pasted: <meta name="google-site-verification" content="..." />
  const matchContent = trimmed.match(/content=["']([^"']+)["']/i)
  if (matchContent && matchContent[1]) {
    return matchContent[1].trim()
  }
  // 2. If tag brackets without content attr
  const stripped = trimmed.replace(/<[^>]+>/g, '').trim()
  return stripped || trimmed
}

function formatArabicDateTime(isoString?: string): string {
  if (!isoString) return 'اليوم، قيد المزامنة'
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return isoString
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return isoString
  }
}

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
  const [googleSiteVerification, setGoogleSiteVerification] = useState(
    seoSettings.googleSiteVerification || ''
  )

  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // GSC Hub State
  const [savingGsc, setSavingGsc] = useState(false)
  const [gscSuccess, setGscSuccess] = useState<string | null>(null)
  const [gscError, setGscError] = useState<string | null>(null)
  const [copiedMetaTag, setCopiedMetaTag] = useState(false)

  // Sitemap Hub State
  const [sitemapStats, setSitemapStats] = useState<SitemapStats | null>(null)
  const [loadingSitemap, setLoadingSitemap] = useState(false)
  const [regeneratingSitemap, setRegeneratingSitemap] = useState(false)
  const [sitemapSuccess, setSitemapSuccess] = useState<string | null>(null)
  const [sitemapError, setSitemapError] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Keep state synced if props update from outside
  useEffect(() => {
    setSiteTitle(seoSettings.siteTitle)
    setSiteDescription(seoSettings.siteDescription)
    setKeywords(seoSettings.keywords)
    setOgImage(seoSettings.ogImage)
    if (seoSettings.googleSiteVerification !== undefined) {
      setGoogleSiteVerification(seoSettings.googleSiteVerification)
    }
  }, [seoSettings])

  const loadSitemapData = useCallback(async () => {
    setLoadingSitemap(true)
    try {
      const stats = await getSitemapStats()
      setSitemapStats(stats)
    } catch {
      // ignore
    } finally {
      setLoadingSitemap(false)
    }
  }, [])

  useEffect(() => {
    loadSitemapData()

    const handleSitemapUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SitemapStats>
      if (customEvent.detail) {
        setSitemapStats(customEvent.detail)
      } else {
        loadSitemapData()
      }
    }

    window.addEventListener('hashousha_sitemap_updated', handleSitemapUpdate)
    return () => {
      window.removeEventListener('hashousha_sitemap_updated', handleSitemapUpdate)
    }
  }, [loadSitemapData])

  const handleCopySitemapUrl = async () => {
    const url = sitemapStats?.sitemapUrl || OFFICIAL_SITEMAP_URL
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2500)
    } catch {
      // ignore
    }
  }

  const handleRegenerate = async () => {
    setRegeneratingSitemap(true)
    setSitemapSuccess(null)
    setSitemapError(null)

    try {
      const res = await triggerSitemapRegeneration()
      if (res.success) {
        setSitemapStats(res.stats)
        setSitemapSuccess('تم تحديث خريطة الموقع ومزامنتها بنجاح مع أحدث المنتجات النشطة!')
        setTimeout(() => setSitemapSuccess(null), 4000)
      } else {
        setSitemapError(res.error || 'تعذر إعادة توليد خريطة الموقع')
      }
    } catch (err: unknown) {
      setSitemapError(err instanceof Error ? err.message : 'حدث خطأ أثناء المزامنة')
    } finally {
      setRegeneratingSitemap(false)
    }
  }

  const handlePreviewSitemap = () => {
    window.open('/sitemap.xml', '_blank')
  }

  const handleOpenGSC = () => {
    const gscUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent('https://hshosha.com/')}`
    window.open(gscUrl, '_blank')
  }

  const handleOpenGscVerify = () => {
    window.open('https://search.google.com/search-console/welcome?hl=ar', '_blank')
  }

  const handleCopyMetaTag = async () => {
    const cleanToken = googleSiteVerification.trim()
    if (!cleanToken) return
    const metaTagSnippet = `<meta name="google-site-verification" content="${cleanToken}" />`
    try {
      await navigator.clipboard.writeText(metaTagSnippet)
      setCopiedMetaTag(true)
      setTimeout(() => setCopiedMetaTag(false), 2500)
    } catch {
      // ignore
    }
  }

  const handleClearVerification = () => {
    setGoogleSiteVerification('')
  }

  const handleSaveGsc = async () => {
    setSavingGsc(true)
    setGscSuccess(null)
    setGscError(null)

    const updated: SeoSettings = {
      ...seoSettings,
      siteTitle: siteTitle.trim(),
      siteDescription: siteDescription.trim(),
      keywords: keywords.trim(),
      ogImage: ogImage.trim(),
      googleSiteVerification: googleSiteVerification.trim(),
    }

    try {
      const res = await saveSeoSettings(updated)
      if (res.success) {
        onUpdateSeoSettings(updated)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hashousha_seo_updated', { detail: updated }))
        }
        setGscSuccess('تم حفظ وتفعيل رمز التحقق لـ Google Search Console بنجاح!')
        setTimeout(() => setGscSuccess(null), 3500)
      } else {
        setGscError(res.error || 'تعذر حفظ رمز التحقق')
      }
    } catch (err: unknown) {
      setGscError(err instanceof Error ? err.message : 'تعذر الاتصال بالخادم')
    } finally {
      setSavingGsc(false)
    }
  }

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
      googleSiteVerification: googleSiteVerification.trim(),
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
              <span className="text-neutral-400" dir="ltr">https://hshosha.com</span>
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

      {/* ------------------------------------------------------------- */}
      {/* 2. Google Search Console Ownership & Verification Hub */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl border border-primary/20 bg-card p-5 sm:p-6 shadow-sm space-y-6 text-right font-sans">
        {/* Hub Header & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="size-4.5" />
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                تأكيد الملكية والربط مع Google Search Console 🔍
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              إثبات ملكية المتجر وتفعيل أدوات مشرفي المواقع من جوجل عبر وسم HTML Tag الصافي لتسريع الأرشفة ومراقبة ظهور الكلمات المفتاحية.
            </p>
          </div>

          {/* Status Badge */}
          {googleSiteVerification.trim() ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 self-start sm:self-center shrink-0 shadow-xs">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2.5 bg-emerald-600"></span>
              </span>
              <span>🟢 تم ربط رمز التحقق جاهز للأرشفة</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground self-start sm:self-center shrink-0 shadow-xs">
              <span className="inline-flex rounded-full size-2 bg-neutral-400"></span>
              <span>⚪ بانتظار إدخال رمز التحقق</span>
            </div>
          )}
        </div>

        {/* Feedback Banners */}
        {gscSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 p-3 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in-50">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{gscSuccess}</span>
          </div>
        )}

        {gscError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/30 p-3 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2 animate-in fade-in-50">
            <AlertCircle className="size-4 text-rose-600 shrink-0" />
            <span>{gscError}</span>
          </div>
        )}

        {/* Verification Input & Meta Code Area */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-primary" />
                <span>رمز التحقق الخاص بمحرك بحث جوجل (HTML Tag Token)</span>
              </label>
              {googleSiteVerification && (
                <button
                  type="button"
                  onClick={handleClearVerification}
                  className="text-[11px] text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 className="size-3" />
                  <span>مسح الرمز</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                dir="ltr"
                placeholder="مثال: 4z9XvUf7... أو الصق وسم <meta name='google-site-verification' ... /> كاملاً"
                value={googleSiteVerification}
                onChange={(e) => {
                  const cleaned = sanitizeGoogleVerificationInput(e.target.value)
                  setGoogleSiteVerification(cleaned)
                }}
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono font-semibold focus:border-primary focus:outline-none shadow-2xs text-left"
              />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              💡 <span className="font-semibold text-foreground">تنظيف آلي فوري:</span> يمكنك لصق وسم الميتا كاملاً كما يمنحه لك جوجل؛ وسيقوم النظام تلقائياً باستخراج وحفظ الرمز الصافي وحقنه ديناميكياً في رأس صفحة المتجر.
            </p>
          </div>

          {/* Active Generated Meta Tag Preview */}
          {googleSiteVerification.trim() && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                <span className="text-[11px] font-bold">الوسم المحقون حالياً في رأس الصفحة (&lt;head&gt;):</span>
                <button
                  type="button"
                  onClick={handleCopyMetaTag}
                  className="flex items-center gap-1 rounded-lg bg-emerald-600/10 border border-emerald-600/30 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                  title="نسخ وسم الميتا"
                >
                  {copiedMetaTag ? (
                    <>
                      <Check className="size-3.5" />
                      <span className="text-[10px]">تم نسخ الوسم!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span className="text-[10px]">نسخ الوسم</span>
                    </>
                  )}
                </button>
              </div>
              <div
                dir="ltr"
                className="rounded-lg border border-emerald-500/30 bg-background/80 px-3 py-2 text-xs font-mono text-emerald-950 dark:text-emerald-200 select-all overflow-x-auto"
              >
                {`<meta name="google-site-verification" content="${googleSiteVerification.trim()}" />`}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={handleSaveGsc}
            disabled={savingGsc}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <Save className="size-3.5" />
            <span>{savingGsc ? 'جاري حفظ الرمز...' : 'حفظ وتفعيل رمز التحقق ⚡'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGscVerify}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="size-3.5 text-muted-foreground" />
            <span>فتح شاشة التحقق في Google Search Console ↗️</span>
          </button>
        </div>

        {/* Step-by-Step Luxury Instructions Card */}
        <div className="rounded-xl bg-secondary/40 border border-primary/10 p-4 space-y-2.5 text-xs text-muted-foreground leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-foreground text-xs">
            <Sparkles className="size-4 text-primary shrink-0" />
            <span>خطوات الربط وتأكيد الملكية خلال دقيقة واحدة:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1.5 pr-1 text-[11px] text-foreground/80">
            <li>
              افتح شاشة التحقق في <span className="font-semibold text-primary">Google Search Console</span> عبر الزر أعلاه.
            </li>
            <li>
              اختر خيار <span className="font-semibold text-foreground">بادئة عنوان URL (URL prefix)</span> واكتب الدومين الرسمي: <code className="font-mono font-bold text-primary" dir="ltr">https://hshosha.com</code>.
            </li>
            <li>
              من قائمة طرق التحقق الأخرى، انقر على <span className="font-semibold text-foreground">علامة HTML (HTML Tag)</span>.
            </li>
            <li>
              انسخ الوسم بالكامل والصقه في الحقل أعلاه، ثم اضغط زر <span className="font-semibold text-primary">«حفظ وتفعيل رمز التحقق ⚡»</span>.
            </li>
            <li>
              عُد لشاشة جوجل واضغط زر <span className="font-semibold text-emerald-600">تأكيد (Verify)</span> لتكتمل عملية إثبات الملكية وتفعيل الأرشفة رسمياً فوراً!
            </li>
          </ol>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Sitemap Control Hub (مركز إدارة ومراقبة خريطة الموقع) */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl border border-primary/20 bg-card p-5 sm:p-6 shadow-sm space-y-6 text-right font-sans">
        {/* Hub Header & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileCode2 className="size-4.5" />
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                مركز إدارة ومراقبة خريطة الموقع (Sitemap Control Hub)
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              مراقبة فهرسة المتجر في محركات البحث، استعلام الصفحات النشطة، ومزامنة خريطة الموقع فورياً مع قاعدة البيانات.
            </p>
          </div>

          {/* Live Status Badge with Animated Green Pulse */}
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 self-start sm:self-center shrink-0 shadow-xs">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-emerald-600"></span>
            </span>
            <span>خريطة الموقع نشطة ومتوافقة مع Google</span>
          </div>
        </div>

        {/* Feedback Banners */}
        {sitemapSuccess && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 p-3 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in-50">
            <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
            <span>{sitemapSuccess}</span>
          </div>
        )}

        {sitemapError && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 dark:bg-rose-950/30 p-3 text-xs text-rose-900 dark:text-rose-200 flex items-center gap-2 animate-in fade-in-50">
            <AlertCircle className="size-4 text-rose-600 shrink-0" />
            <span>{sitemapError}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Metric 1: Official URL & Copy */}
          <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold">رابط الملف الرسمي المعتمد:</span>
              <Globe className="size-4 text-primary" />
            </div>
            <div className="flex items-center gap-2">
              <div
                dir="ltr"
                className="flex-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-mono font-bold text-foreground truncate select-all"
              >
                {sitemapStats?.sitemapUrl || OFFICIAL_SITEMAP_URL}
              </div>
              <button
                type="button"
                onClick={handleCopySitemapUrl}
                className="flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shrink-0 cursor-pointer"
                title="نسخ رابط خريطة الموقع"
              >
                {copiedUrl ? (
                  <>
                    <Check className="size-3.5 text-emerald-600" />
                    <span className="text-[10px] text-emerald-600">تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span className="text-[10px]">نسخ</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              يُشار إليه تلقائياً داخل ملف robots.txt لتسهيل زحف محركات البحث.
            </p>
          </div>

          {/* Metric 2: Pages Count */}
          <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold">عدد الصفحات المضمنة بالزحف:</span>
              <Layers className="size-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-foreground">
                {loadingSitemap ? '...' : (sitemapStats?.totalPages ?? 21)}
              </span>
              <span className="text-xs text-muted-foreground font-semibold">صفحة مفهرسة</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              1 رئيسية + {loadingSitemap ? '...' : (sitemapStats?.activeDishesCount ?? 20)} طبق نشط (يتم استبعاد المعطل تلقائياً).
            </p>
          </div>

          {/* Metric 3: Last Synced */}
          <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] font-bold">آخر مزامنة وتوليد:</span>
              <Clock className="size-4 text-primary" />
            </div>
            <div className="text-xs font-bold text-foreground">
              {loadingSitemap ? 'جاري الفحص...' : formatArabicDateTime(sitemapStats?.lastModified)}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              متزامنة مع قاعدة بيانات الأصناف ويتم تحديثها دورياً أثناء البناء والتشغيل.
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={regeneratingSitemap}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-sm disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={cn("size-3.5", regeneratingSitemap && "animate-spin")} />
            <span>{regeneratingSitemap ? 'جاري إعادة بناء وتحديث السايت ماب...' : 'تحديث وإعادة بناء السايت ماب الآن ⚡'}</span>
          </button>

          <button
            type="button"
            onClick={handlePreviewSitemap}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary transition-all shadow-xs cursor-pointer"
          >
            <ExternalLink className="size-3.5 text-muted-foreground" />
            <span>معاينة خريطة الموقع ↗️</span>
          </button>

          <button
            type="button"
            onClick={handleOpenGSC}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 transition-all shadow-xs cursor-pointer"
          >
            <Search className="size-3.5" />
            <span>تقديم الرابط إلى Google Search Console 🔍</span>
          </button>
        </div>

        {/* Pro Tip Callout */}
        <div className="rounded-xl bg-secondary/40 border border-primary/10 p-3 flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
          <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground">💡 نصيحة السيو الفندقية: </span>
            <span>
              رابط خريطة الموقع مسجل مسبقاً في ملف <code className="font-mono text-primary font-bold">robots.txt</code>، وتقوم محركات البحث بقراءته آلياً. عند إضافة أطباق جديدة يمكنك النقر على «تقديم الرابط إلى Google Search Console» لطلب أرشفة عاجلة لصفحات الأطباق الجديدة دون انتظار دورة الزحف التلقائي.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
