/**
 * HASHOUSHA (هشوشة) — Store Settings & Customer Delivery Contracts
 * Governed by docs/SYSTEM_ARCHITECTURE.md
 */

export interface StoreSettings {
  storeNameAr: string;     // e.g. 'هشوشة للمحاشي والحلويات الفاخرة'
  storeNameEn: string;     // e.g. 'Hashousha Gourmet'
  whatsappNumber: string;  // e.g. '966500000000' (E.164 format without + sign)
  currency: string;        // e.g. 'ر.س'
  deliveryFee: number;     // e.g. 15
  minOrderAmount: number;  // e.g. 50
  isOpen: boolean;         // Store availability
  bannerNoticeAr?: string; // e.g. 'نستقبل طلباتكم طازجة يومياً من الساعة 1 ظهراً وحتى 11 مساءً'
}

export interface CustomerOrderInfo {
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  generalNotes?: string;
}
