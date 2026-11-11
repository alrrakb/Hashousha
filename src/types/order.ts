export type OrderStatus =
  | "pending"     // جديد
  | "processing"  // قيد التحضير في المطبخ
  | "confirmed"   // جاهز للتوصيل
  | "shipped"     // جاري التوصيل مع المندوب
  | "delivered"   // تم التوصيل بنجاح
  | "cancelled";  // ملغي

export type PaymentMethod = "cod" | "bank_transfer" | "prepaid";

export interface CustomerDetails {
  name: string;
  phone: string; // validated 05xxxxxxxx
  district: string; // Riyadh district
  addressDetails: string;
  notes?: string;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  variantId?: string;
  variantName?: string;
  servingInfo?: string;
  dishImage: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface BankAccountDetails {
  bankName: string;
  accountName: string;
  iban: string;
  accountNumber: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. '#HSH-1042'
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
