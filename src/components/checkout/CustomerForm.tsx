import React, { useState } from 'react'
import { User, Phone, MapPin, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'
import { CustomerDetails } from '../../types/order'
import { useSiteContent } from '../../context/SiteContentContext'
import { RIYADH_DISTRICTS, OTHER_DISTRICT_KEY, isValidSaudiPhone } from '../../data/riyadhDistricts'
import { cn } from '../../lib/utils'

export interface CustomerFormProps {
  values: CustomerDetails
  onChange: (field: keyof CustomerDetails, value: string) => void
  errors: Partial<Record<keyof CustomerDetails, string>>
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ values, onChange, errors }) => {
  const { t } = useSiteContent()
  const [districtSearch, setDistrictSearch] = useState('')
  const [isOtherDistrict, setIsOtherDistrict] = useState(
    values.district !== '' && !RIYADH_DISTRICTS.includes(values.district as typeof RIYADH_DISTRICTS[number])
  )

  const filteredDistricts = RIYADH_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.trim().toLowerCase())
  )

  const isPhoneValid = values.phone.length > 0 && isValidSaudiPhone(values.phone)
  const isPhoneInvalid = values.phone.length > 0 && !isPhoneValid

  const handleDistrictSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === OTHER_DISTRICT_KEY) {
      setIsOtherDistrict(true)
      onChange('district', '')
    } else {
      setIsOtherDistrict(false)
      onChange('district', val)
    }
  }

  return (
    <section className="space-y-4" aria-label="بيانات العميل والتوصيل">
      <div className="flex items-center gap-2 border-b border-border/70 pb-2">
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-bold text-foreground">
          {t('checkout.recipientHeader', 'بيانات المستلم وعنوان التوصيل في الرياض')}
        </h3>
      </div>

      {/* Customer Name */}
      <div className="space-y-1.5">
        <label htmlFor="customer-name" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
          <User className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{t('checkout.nameLabel', 'الاسم الكريم')} <span className="text-accent">*</span></span>
        </label>
        <div className="relative">
          <input
            id="customer-name"
            type="text"
            required
            autoComplete="name"
            placeholder={t('checkout.namePlaceholder', 'مثال: نورة العتيبي')}
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
              errors.name ? "border-accent ring-1 ring-accent/30" : "border-border/80"
            )}
          />
        </div>
        {errors.name && (
          <p className="flex items-center gap-1 text-[11px] font-medium text-accent">
            <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
            <span>{errors.name}</span>
          </p>
        )}
      </div>

      {/* Mobile Phone */}
      <div className="space-y-1.5">
        <label htmlFor="customer-phone" className="flex items-center justify-between text-xs font-semibold text-foreground/80">
          <span className="flex items-center gap-1.5">
            <Phone className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{t('checkout.phoneLabel', 'رقم الجوال')} <span className="text-accent">*</span></span>
          </span>
          <span className="text-[11px] font-normal text-muted-foreground" dir="ltr">05XXXXXXXX</span>
        </label>
        <div className="relative">
          <input
            id="customer-phone"
            type="tel"
            inputMode="tel"
            required
            autoComplete="tel"
            placeholder={t('checkout.phonePlaceholder', '05XXXXXXXX')}
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-left",
              errors.phone || isPhoneInvalid
                ? "border-accent ring-1 ring-accent/30"
                : isPhoneValid
                ? "border-emerald-600/60 ring-1 ring-emerald-600/20"
                : "border-border/80"
            )}
            dir="ltr"
          />
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            {isPhoneValid && (
              <CheckCircle2 className="size-4 text-emerald-600" aria-hidden="true" />
            )}
            {isPhoneInvalid && (
              <AlertCircle className="size-4 text-accent" aria-hidden="true" />
            )}
          </div>
        </div>
        {errors.phone ? (
          <p className="flex items-center gap-1 text-[11px] font-medium text-accent">
            <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
            <span>{errors.phone}</span>
          </p>
        ) : isPhoneInvalid ? (
          <p className="text-[11px] text-accent">
            يرجى إدخال رقم جوال سعودي يبدأ بـ 05 أو +9665 ويتكون من 10 أرقام
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            {t('checkout.phoneHelper', 'سنرسل لك تحديثات تحضير الطلب وحركة المندوب عبر هذا الرقم')}
          </p>
        )}
      </div>

      {/* Riyadh District Selection */}
      <div className="space-y-1.5">
        <label htmlFor="district-select" className="flex items-center justify-between text-xs font-semibold text-foreground/80">
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span>{t('checkout.districtLabel', 'الحي في الرياض')} <span className="text-accent">*</span></span>
          </span>
          <span className="text-[11px] text-primary font-medium">
            {t('checkout.districtNotice', 'توصيل لجميع أحياء الرياض')}
          </span>
        </label>

        {!isOtherDistrict ? (
          <div className="space-y-2">
            <div className="relative">
              <select
                id="district-select"
                value={values.district}
                onChange={handleDistrictSelect}
                className={cn(
                  "w-full rounded-xl border bg-background/80 px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer",
                  errors.district ? "border-accent ring-1 ring-accent/30" : "border-border/80"
                )}
              >
                <option value="">{t('checkout.districtSelectDefault', '-- اختر حي التوصيل --')}</option>
                {filteredDistricts.map((district) => (
                  <option key={district} value={district}>
                    حي {district}
                  </option>
                ))}
                <option value={OTHER_DISTRICT_KEY}>+ {OTHER_DISTRICT_KEY}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                <span className="text-xs">▼</span>
              </div>
            </div>

            {/* Quick District Filter if searching */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t('checkout.districtPlaceholder', 'تصفية سريعة للأحياء...')}
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-background/50 px-2.5 py-1 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
              />
              {districtSearch && (
                <button
                  type="button"
                  onClick={() => setDistrictSearch('')}
                  className="shrink-0 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  إعادة ضبط
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="أدخل اسم الحي يدوياً (مثال: حي الندى)"
                value={values.district}
                onChange={(e) => onChange('district', e.target.value)}
                className={cn(
                  "w-full rounded-xl border bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
                  errors.district ? "border-accent ring-1 ring-accent/30" : "border-border/80"
                )}
              />
              <button
                type="button"
                onClick={() => {
                  setIsOtherDistrict(false)
                  onChange('district', '')
                }}
                className="shrink-0 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                اختيار من القائمة
              </button>
            </div>
          </div>
        )}

        {errors.district && (
          <p className="flex items-center gap-1 text-[11px] font-medium text-accent">
            <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
            <span>{errors.district}</span>
          </p>
        )}
      </div>

      {/* Detailed Address */}
      <div className="space-y-1.5">
        <label htmlFor="address-details" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
          <MapPin className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{t('checkout.addressLabel', 'العنوان التفصيلي')} <span className="text-accent">*</span></span>
        </label>
        <input
          id="address-details"
          type="text"
          required
          placeholder={t('checkout.addressPlaceholder', 'الشارع، رقم الفيلا/العمارة، معلم مميز قريب')}
          value={values.addressDetails}
          onChange={(e) => onChange('addressDetails', e.target.value)}
          className={cn(
            "w-full rounded-xl border bg-background/80 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
            errors.addressDetails ? "border-accent ring-1 ring-accent/30" : "border-border/80"
          )}
        />
        {errors.addressDetails && (
          <p className="flex items-center gap-1 text-[11px] font-medium text-accent">
            <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
            <span>{errors.addressDetails}</span>
          </p>
        )}
      </div>

      {/* Kitchen / Delivery Notes */}
      <div className="space-y-1.5">
        <label htmlFor="customer-notes" className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
          <FileText className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{t('checkout.notesLabel', 'ملاحظات للمطبخ أو التوصيل')} <span className="text-muted-foreground font-normal">(اختياري)</span></span>
        </label>
        <textarea
          id="customer-notes"
          rows={2}
          placeholder={t('checkout.notesPlaceholder', 'مثال: زيادة دبس الرمان، بدون حار، التسليم عند الباب الخارجي...')}
          value={values.notes || ''}
          onChange={(e) => onChange('notes', e.target.value)}
          className="w-full rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
        />
      </div>
    </section>
  )
}
