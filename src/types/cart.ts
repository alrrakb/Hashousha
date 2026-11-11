/**
 * HASHOUSHA (هشوشة) — Cart & Order Item Type Contracts
 * Governed by docs/SYSTEM_ARCHITECTURE.md
 */

export interface SelectedChoiceRef {
  groupId: string;
  groupNameAr: string;
  choiceId: string;
  choiceNameAr: string;
  priceDelta: number;
}

export interface CartItem {
  cartItemId: string;      // Unique composite ID: `${productId}-${hashOfOptions}`
  productId: string;       // Foreign key to Product.id
  nameAr: string;
  basePrice: number;
  selectedChoices: SelectedChoiceRef[];
  unitPrice: number;       // basePrice + sum(selectedChoices.priceDelta)
  quantity: number;
  itemTotal: number;       // unitPrice * quantity
  customerNotes?: string;  // Dish-specific instructions
  image: string;
}

export interface CartSummary {
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}
