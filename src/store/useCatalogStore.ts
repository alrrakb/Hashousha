import { create } from 'zustand';
import { Category, Product } from '../types/product';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialCatalog';

interface CatalogState {
  categories: Category[];
  products: Product[];
  activeCategoryId: string;
  searchQuery: string;
  selectedProductForModal: Product | null;
  setActiveCategory: (categoryId: string) => void;
  setSearchQuery: (query: string) => void;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  setProducts: (products: Product[]) => void;
  resetFilters: () => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  activeCategoryId: 'all',
  searchQuery: '',
  selectedProductForModal: null,
  setActiveCategory: (categoryId: string) => set({ activeCategoryId: categoryId }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  openProductModal: (product: Product) => set({ selectedProductForModal: product }),
  closeProductModal: () => set({ selectedProductForModal: null }),
  setProducts: (products: Product[]) => set({ products }),
  resetFilters: () => set({ activeCategoryId: 'all', searchQuery: '' }),
}));
