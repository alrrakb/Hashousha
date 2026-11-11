import React from 'react'
import { createPortal } from 'react-dom'
import { Printer, X, ChefHat, Clock, MapPin, Phone, User, FileText } from 'lucide-react'
import { Order } from '../../types/order'
import { formatPrice } from '../../data/menu'

export interface KitchenTicketProps {
  order: Order
  onClose?: () => void
}

export const KitchenTicket: React.FC<KitchenTicketProps> = ({ order, onClose }) => {
  const paymentLabel =
    order.paymentMethod === 'cod'
      ? 'الدفع عند الاستلام (شبكة/كاش)'
      : order.paymentMethod === 'prepaid'
      ? 'مدفوع مسبقاً (سداد/تحويل مباشر)'
      : 'تحويل بنكي (مصرف الراجحي)'

  const formattedDate = new Date(order.createdAt).toLocaleString('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const handlePrint = () => {
    // 1. Create clean isolated printing iframe to prevent modal clipping / 2-sheet blank previews
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    iframe.style.visibility = 'hidden'
    document.body.appendChild(iframe)

    const iframeDoc = iframe.contentWindow?.document
    if (!iframeDoc) {
      window.print()
      return
    }

    const itemsHtml = (order.items || [])
      .map(
        (item) => `
        <tr style="border-bottom: 1px dashed #ccc;">
          <td style="padding: 6px 0; vertical-align: top; text-align: right;">
            <div style="font-weight: 800; font-size: 13px; color: #000;">${item.dishName} ${item.variantName ? `<span style="font-size: 11px; color: #b45309;">[${item.variantName}]</span>` : ''}</div>
            <div style="font-size: 10px; color: #555;">${item.servingInfo ? `${item.servingInfo} • ` : ''}${item.unit || ''}</div>
          </td>
          <td style="padding: 6px 0; vertical-align: middle; text-align: left; font-weight: 900; font-size: 14px; font-family: monospace;">
            ×${item.quantity}
          </td>
        </tr>
      `
      )
      .join('')

    const notesHtml = order.customer.notes
      ? `
      <div style="border: 2px dashed #000; background: #fafafa; padding: 6px 8px; margin: 8px 0; border-radius: 4px;">
        <div style="font-weight: 900; color: #b91c1c; font-size: 11px; margin-bottom: 2px;">ملاحظات خاصة للمطبخ:</div>
        <div style="font-weight: 700; font-size: 11px; color: #111;">${order.customer.notes}</div>
      </div>
    `
      : ''

    iframeDoc.open()
    iframeDoc.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>بون تحضير المطبخ - ${order.orderNumber}</title>
        <style>
          @page {
            size: 80mm auto;
            margin: 4mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Cairo', monospace;
            font-size: 12px;
            color: #000;
            background: #fff;
            width: 72mm;
            max-width: 100%;
            margin: 0 auto;
            padding: 4mm 0;
            line-height: 1.35;
          }
          .center { text-align: center; }
          .bold { font-weight: 800; }
          .mono { font-family: monospace; }
          .border-b { border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 6px; }
          .border-dashed-b { border-bottom: 1px dashed #888; padding-bottom: 6px; margin-bottom: 6px; }
          .flex-between { display: flex; justify-content: space-between; align-items: center; }
          table { width: 100%; border-collapse: collapse; margin: 6px 0; }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div class="center border-b">
          <h2 style="font-size: 16px; font-weight: 900; margin-bottom: 2px;">هشوشة للبابكا الحرفية والمخبوزات الفاخرة</h2>
          <p style="font-size: 11px; font-weight: 700; color: #333;">بون تحضير وتغليف المطبخ</p>
          <div class="flex-between" style="margin-top: 6px; font-weight: bold; font-size: 12px;">
            <span style="background: #eee; border: 1px solid #333; padding: 2px 6px; border-radius: 4px; font-family: monospace;">${order.orderNumber}</span>
            <span style="font-size: 11px; color: #444;">${formattedDate}</span>
          </div>
        </div>

        <!-- Customer & Location -->
        <div class="border-dashed-b" style="font-size: 12px; line-height: 1.5;">
          <div style="font-weight: 800;">العميل: ${order.customer.name}</div>
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 800;">
            <span>الجوال:</span>
            <span dir="ltr" class="mono">${order.customer.phone}</span>
          </div>
          <div style="color: #333; font-size: 11px;">
            الرياض — حي ${order.customer.district} | ${order.customer.addressDetails}
          </div>
        </div>

        <!-- Special Notes -->
        ${notesHtml}

        <!-- Items Table -->
        <table style="width: 100%; margin: 6px 0;">
          <thead>
            <tr style="border-bottom: 1px solid #000; font-size: 12px; font-weight: 900;">
              <th style="text-align: right; padding-bottom: 4px;">الصنف</th>
              <th style="text-align: left; padding-bottom: 4px;">الكمية</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Financial Summary -->
        <div style="border-top: 2px solid #000; padding-top: 6px; margin-top: 6px; font-size: 11px;">
          <div class="flex-between" style="color: #444; margin-bottom: 3px;">
            <span>المجموع الفرعي:</span>
            <span>${formatPrice(order.subtotal)}</span>
          </div>
          <div class="flex-between" style="color: #444; margin-bottom: 3px;">
            <span>رسوم التوصيل:</span>
            <span>${formatPrice(order.deliveryFee)}</span>
          </div>
          <div class="flex-between bold" style="font-size: 13px; border-top: 1px dashed #666; padding-top: 4px; margin-top: 4px;">
            <span>الإجمالي المستحق:</span>
            <span>${formatPrice(order.totalAmount)}</span>
          </div>
          <div class="flex-between" style="font-size: 11px; font-weight: 700; margin-top: 3px; color: #333;">
            <span>طريقة السداد:</span>
            <span>${paymentLabel}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="center" style="border-top: 1px solid #ccc; padding-top: 8px; margin-top: 10px; font-size: 10px; color: #555;">
          <p class="bold">مطبخ هشوشة — جودة الضيافة الفاخرة</p>
          <p>شكراً لطلبكم طازجاً من الرياض</p>
        </div>
      </body>
      </html>
    `)
    iframeDoc.close()

    setTimeout(() => {
      try {
        iframe.contentWindow?.focus()
        iframe.contentWindow?.print()
      } catch (e) {
        console.warn('Iframe print error fallback to window.print', e)
        window.print()
      } finally {
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe)
          }
        }, 1500)
      }
    }, 250)
  }

  const ticketNode = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in-50 duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose()
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white text-black shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Bar (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b p-4 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="size-4 text-neutral-600" />
            <span className="text-sm font-bold text-neutral-800">معاينة بون تحضير المطبخ</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>طباعة البون</span>
            </button>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* Inner Scrollable Ticket Area */}
        <div className="overflow-y-auto p-4 flex-1">
          <div id="kitchen-ticket-area" className="kitchen-ticket-printable font-mono text-xs space-y-3 p-2 bg-white" dir="rtl">
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-3 space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-sans font-black text-lg">
                <ChefHat className="size-5" />
                <span>هشوشة للبابكا الحرفية والمخبوزات الفاخرة</span>
              </div>
              <p className="text-[11px] font-semibold text-neutral-700">بون تحضير وتغليف المطبخ</p>
              <div className="pt-1 flex items-center justify-between font-bold text-sm">
                <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-300 font-sans">{order.orderNumber}</span>
                <span className="flex items-center gap-1 text-[11px] text-neutral-600 font-sans">
                  <Clock className="size-3" />
                  <span>{formattedDate}</span>
                </span>
              </div>
            </div>

            {/* Customer & Location */}
            <div className="border-b border-dashed border-neutral-400 pb-2 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                <User className="size-3.5 text-neutral-600 shrink-0" />
                <span>العميل: {order.customer.name}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                <Phone className="size-3.5 text-neutral-600 shrink-0" />
                <span dir="ltr" className="font-mono tracking-wide">{order.customer.phone}</span>
              </div>
              <div className="flex items-start gap-1.5 text-neutral-700">
                <MapPin className="size-3.5 shrink-0 mt-0.5 text-neutral-600" />
                <span>الرياض — حي {order.customer.district} | {order.customer.addressDetails}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between font-bold border-b border-black pb-1 text-neutral-900">
                <span>الصنف</span>
                <span className="text-left">الكمية</span>
              </div>

              {order.items && order.items.length > 0 ? (
                <ul className="divide-y divide-neutral-200">
                  {order.items.map((item, idx) => (
                    <li key={item.dishId || idx} className="flex justify-between py-1.5 text-neutral-900">
                      <div className="space-y-0.5">
                        <p className="font-bold text-[13px]">
                          {item.dishName}
                          {item.variantName && (
                            <span className="text-amber-800 font-bold text-xs mr-1.5">[{item.variantName}]</span>
                          )}
                        </p>
                        <p className="text-[10px] text-neutral-600">
                          {item.servingInfo ? `${item.servingInfo} • ` : ''}{item.unit}
                        </p>
                      </div>
                      <div className="text-left font-bold text-sm self-center font-mono">
                        ×{item.quantity}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500 py-2 text-center">لا توجد أصناف مسجلة في هذا الطلب</p>
              )}
            </div>

            {/* Special Notes (Highlighted) */}
            {order.customer.notes && (
              <div className="border-2 border-dashed border-neutral-900 bg-neutral-50 p-2 rounded space-y-0.5">
                <div className="flex items-center gap-1 font-bold text-red-600">
                  <FileText className="size-3.5" />
                  <span>ملاحظات خاصة للمطبخ:</span>
                </div>
                <p className="font-bold text-neutral-900 text-xs">{order.customer.notes}</p>
              </div>
            )}

            {/* Financial Breakdown */}
            <div className="border-t-2 border-black pt-2 space-y-1">
              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>المجموع الفرعي:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600 text-[11px]">
                <span>رسوم التوصيل:</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-neutral-900 border-t border-dashed border-neutral-400 pt-1">
                <span>الإجمالي المستحق:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-neutral-700 pt-0.5">
                <span>طريقة السداد:</span>
                <span>{paymentLabel}</span>
              </div>
            </div>

            {/* Footer Barcode / Receipt Signoff */}
            <div className="text-center pt-3 border-t border-neutral-300 text-[10px] text-neutral-500 space-y-0.5">
              <p className="font-bold">مطبخ هشوشة — جودة الضيافة الفاخرة</p>
              <p>شكراً لطلبكم طازجاً من الرياض</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(ticketNode, document.body) : ticketNode
}
