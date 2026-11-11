/**
 * HASHOUSHA (هشوشة) — Product & Catalog Type Contracts
 * Governed by docs/SYSTEM_ARCHITECTURE.md
 */

export interface Category {
  id: string;              // e.g. 'vine-leaves', 'cabbage-rolls', 'desserts', 'platters'
  nameAr: string;          // e.g. 'ورق عنب فاخر'
  nameEn: string;          // e.g. 'Gourmet Vine Leaves'
  icon: string;            // Lucide icon identifier or emoji string
  sortOrder: number;       // Display sorting priority
  isActive: boolean;       // Display toggle
}

export interface ProductOptionChoice {
  id: string;              // e.g. 'size-family'
  nameAr: string;          // e.g. 'صينية عائلية (50 حبة)'
  nameEn?: string;
  priceDelta: number;      // e.g. +45 (can be 0 for default)
  isDefault?: boolean;
}

export interface ProductOptionGroup {
  id: string;              // e.g. 'portion-size', 'spiciness', 'extra-sauces'
  nameAr: string;          // e.g. 'الحجم والكمية', 'درجة السبايسي', 'إضافات الصصوصات'
  nameEn?: string;
  type: 'single' | 'multiple'; // single = radio, multiple = checkbox
  required: boolean;       // whether customer must pick at least 1
  minChoices?: number;     // for multiple selections
  maxChoices?: number;     // for multiple selections
  choices: ProductOptionChoice[];
}

export type SpicyLevel = 'none' | 'mild' | 'spicy' | 'fire';
export type DishBadge = 'bestseller' | 'new' | 'signature' | 'spicy' | 'special_offer';

export interface Product {
  id: string;              // e.g. 'p-vine-leaves-pomegranate'
  categoryId: string;      // foreign key to Category.id
  nameAr: string;          // e.g. 'ورق عنب فاخر بدبس الرمان'
  nameEn?: string;         // e.g. 'Luxury Pomegranate Vine Leaves'
  descriptionAr: string;   // e.g. 'ورق عنب طازج متبل بالخلطة السرية ودبس الرمان الطبيعي مع قطع الليمون'
  descriptionEn?: string;
  basePrice: number;       // base price in default currency (e.g. 55)
  image: string;           // URL or local asset path
  badge?: DishBadge;       // Visual highlight
  spicyLevel?: SpicyLevel; // Indicator
  servingsInfoAr?: string; // e.g. 'تكفي من 3 إلى 5 أفراد'
  prepTimeMinutes?: number;// e.g. 30
  inStock: boolean;        // Available for ordering
  optionGroups: ProductOptionGroup[];
}
