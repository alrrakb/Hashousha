import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Dish } from '../types/menu'
import { dishes as defaultDishes } from '../data/menu'

export interface MenuStoreState {
  dishes: Dish[]
  setDishes: (dishes: Dish[]) => void
  toggleDishStock: (dishId: string) => void
  setDishStock: (dishId: string, inStock: boolean) => void
  resetMenuToDefaults: () => void
}

export const useMenuStore = create<MenuStoreState>()(
  persist(
    (set) => ({
      dishes: defaultDishes,

      setDishes: (dishes: Dish[]) => set({ dishes }),

      toggleDishStock: (dishId: string) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === dishId ? { ...d, inStock: !d.inStock } : d
          ),
        })),

      setDishStock: (dishId: string, inStock: boolean) =>
        set((state) => ({
          dishes: state.dishes.map((d) =>
            d.id === dishId ? { ...d, inStock } : d
          ),
        })),

      resetMenuToDefaults: () => set({ dishes: defaultDishes }),
    }),
    {
      name: 'hashousha_dishes',
    }
  )
)
