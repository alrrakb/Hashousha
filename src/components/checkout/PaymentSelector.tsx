import React, { useState } from 'react'
import { CreditCard, Building2, Copy, Check, ShieldCheck, Wallet } from 'lucide-react'
import { PaymentMethod } from '../../types/order'
import { useSiteContent } from '../../context/SiteContentContext'
import { OFFICIAL_BANK_ACCOUNT } from '../../data/bankAccounts'
import { cn } from '../../lib/utils'

export interface PaymentSelectorProps {
  selected: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selected, onChange }) => {
  const { content, t } = useSiteContent()
  const [copiedIban, setCopiedIban] = useState(false)

  const bankDetails = {
    bankName: content.bankName || OFFICIAL_BANK_ACCOUNT.bankName,
    accountName: content.bankAccountName || OFFICIAL_BANK_ACCOUNT.accountName,
    iban: content.bankIban || OFFICIAL_BANK_ACCOUNT.iban,
    accountNumber: content.bankAccountNumber || OFFICIAL_BANK_ACCOUNT.accountNumber,
    notes: content.bankTransferNotes || 'بعد إتمام التحويل، سيصلك رقم الطلب ويمكنك إرفاق صورة الإشعار عبر الواتساب لتسريع التجهيز.',
  }

  const handleCopyIban = async () => {
    try {
      await navigator.clipboard.writeText(bankDetails.iban)
      setCopiedIban(true)
      setTimeout(() => setCopiedIban(false), 2500)
    } catch {
      // Fallback if clipboard API is constrained
      const textArea = document.createElement('textarea')
      textArea.value = bankDetails.iban
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedIban(true)
      setTimeout(() => setCopiedIban(false), 2500)
    }
  }

  return (
    <section className="space-y-4" aria-label="طريقة الدفع">
      <div className="flex items-center gap-2 border-b border-border/70 pb-2">
        <CreditCard className="size-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold text-foreground">
          {t('checkout.paymentMethodHeader', 'طريقة الدفع المفضلة')}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="خيارات الدفع">
        {/* Option 1: Cash on Delivery (شبكة أو كاش) */}
        <button
          type="button"
          role="radio"
          aria-checked={selected === 'cod'}
          onClick={() => onChange('cod')}
          className={cn(
            "flex flex-col text-right rounded-2xl p-4 border transition-all relative text-foreground min-h-[96px]",
            selected === 'cod'
              ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
              : "border-border/70 bg-card/60 hover:bg-card hover:border-border"
          )}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Wallet className={cn("size-4", selected === 'cod' ? "text-primary" : "text-muted-foreground")} />
              <span>{t('checkout.paymentCodTitle', 'عند الاستلام')}</span>
            </div>
            <div className={cn(
              "size-4 rounded-full border flex items-center justify-center transition-colors",
              selected === 'cod' ? "border-primary bg-primary" : "border-muted-foreground/40 bg-transparent"
            )}>
              {selected === 'cod' && <span className="size-1.5 rounded-full bg-primary-foreground" />}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('checkout.paymentCodSubtitle', 'الدفع لمندوب التوصيل (مدى / بطاقة أو نقداً) عند وصول طلبك طازجاً.')}
          </p>
        </button>

        {/* Option 2: Bank Transfer (تحويل بنكي) */}
        <button
          type="button"
          role="radio"
          aria-checked={selected === 'bank_transfer'}
          onClick={() => onChange('bank_transfer')}
          className={cn(
            "flex flex-col text-right rounded-2xl p-4 border transition-all relative text-foreground min-h-[96px]",
            selected === 'bank_transfer'
              ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/30"
              : "border-border/70 bg-card/60 hover:bg-card hover:border-border"
          )}
        >
          <div className="flex items-center justify-between w-full mb-1.5">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Building2 className={cn("size-4", selected === 'bank_transfer' ? "text-primary" : "text-muted-foreground")} />
              <span>{t('checkout.paymentTransferTitle', 'تحويل بنكي مباشر')}</span>
            </div>
            <div className={cn(
              "size-4 rounded-full border flex items-center justify-center transition-colors",
              selected === 'bank_transfer' ? "border-primary bg-primary" : "border-muted-foreground/40 bg-transparent"
            )}>
              {selected === 'bank_transfer' && <span className="size-1.5 rounded-full bg-primary-foreground" />}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t('checkout.paymentTransferSubtitle', 'تحويل عبر الحساب الرسمي في مصرف الراجحي مع تأكيد فوري للطلب.')}
          </p>
        </button>
      </div>

      {/* Bank Account Details Cardlet when Bank Transfer is selected */}
      {selected === 'bank_transfer' && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span className="text-xs font-bold text-foreground">{bankDetails.bankName}</span>
            </div>
            <span className="text-[11px] font-medium text-primary bg-primary/15 px-2 py-0.5 rounded-full">
              حساب رسمي معتمد
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <p className="text-muted-foreground">اسم الحساب المستفيد:</p>
            <p className="font-bold text-foreground">{bankDetails.accountName}</p>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-muted-foreground">رقم الآيبان (IBAN):</span>
            <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background p-2.5">
              <span className="font-mono text-xs font-bold text-foreground tracking-wider select-all" dir="ltr">
                {bankDetails.iban}
              </span>
              <button
                type="button"
                onClick={handleCopyIban}
                className={cn(
                  "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors shrink-0",
                  copiedIban
                    ? "bg-emerald-600 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                aria-label="نسخ رقم الآيبان"
              >
                {copiedIban ? (
                  <>
                    <Check className="size-3.5" aria-hidden="true" />
                    <span>تم النسخ بنجاح</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" aria-hidden="true" />
                    <span>نسخ الآيبان</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 text-[11px] text-muted-foreground leading-relaxed">
            <ShieldCheck className="size-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p>{bankDetails.notes}</p>
          </div>
        </div>
      )}
    </section>
  )
}
