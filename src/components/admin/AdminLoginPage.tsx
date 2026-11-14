import React, { useState } from 'react'
import { Leaf, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { supabase } from '../../services/supabase'

export interface AdminLoginPageProps {
  onLoginSuccess: () => void
  onReturnToStorefront?: () => void
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onReturnToStorefront,
}) => {
  const [email, setEmail] = useState('admin@hashousha.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrorMessage('بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور.')
        } else {
          setErrorMessage(`فشل تسجيل الدخول: ${error.message}`)
        }
        setLoading(false)
        return
      }

      if (data.user) {
        onLoginSuccess()
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'تعذر الاتصال بخادم المصادقة'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen linen flex flex-col justify-center items-center px-4 py-12 text-foreground font-sans selection:bg-primary/20"
      dir="rtl"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Brand Emblem */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <Leaf className="size-5 -scale-x-100 rotate-[-30deg]" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-sans text-3xl font-black tracking-tight">هشوشة</span>
            <Leaf className="size-5 rotate-[30deg]" strokeWidth={1.5} aria-hidden="true" />
          </div>
          <p dir="ltr" className="font-serif text-[10px] tracking-[0.3em] text-foreground/60 uppercase">
            Hashousha — Sweet &amp; Savory Bakes
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
              <ShieldCheck className="size-3.5" />
              <span>بوابة الإدارة والمطبخ المركزية</span>
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-[2rem] border border-primary/20 bg-card p-7 shadow-[0_20px_50px_-20px_rgba(46,30,13,0.2)] space-y-5">
          <div className="space-y-1 text-right">
            <h2 className="text-lg font-black text-foreground">تسجيل دخول طاقم المطبخ</h2>
            <p className="text-xs text-muted-foreground">
              يرجى إدخال بيانات الاعتماد المعتمدة للوصول إلى لوحة تتبع وإدارة الطلبات.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-50/70 p-3 flex items-start gap-2.5 text-xs text-rose-900 animate-in fade-in-50">
              <AlertCircle className="size-4 text-rose-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-semibold">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-right">
              <label htmlFor="admin-email" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                <Mail className="size-3.5 text-primary" />
                <span>البريد الإلكتروني المعتمد</span>
              </label>
              <div className="relative">
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  inputMode="email"
                  placeholder="admin@hashousha.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-right">
              <label htmlFor="admin-password" className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                <Lock className="size-3.5 text-primary" />
                <span>كلمة المرور</span>
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border/80 bg-background/80 pr-3.5 pl-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-md transition-all hover:bg-primary/95 active:scale-98 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>جاري التحقق من الصلاحيات...</span>
                </>
              ) : (
                <span>دخول إلى لوحة المطبخ</span>
              )}
            </button>
          </form>
        </div>

        {/* Return to Public Storefront */}
        {onReturnToStorefront && (
          <div className="text-center">
            <button
              type="button"
              onClick={onReturnToStorefront}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors py-2 px-4 rounded-xl hover:bg-secondary/60"
            >
              <ArrowLeft className="size-3.5" />
              <span>العودة لمتجر هشوشة العام</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
