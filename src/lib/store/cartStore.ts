import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: { id: string; name: string; price: number; image_url?: string }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
              ),
              isOpen: true, // Auto-open cart when adding
            };
          }
          return { items: [...state.items, { ...product, quantity: 1 }], isOpen: true };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: quantity > 0 
            ? state.items.map((item) => item.id === id ? { ...item, quantity } : item)
            : state.items.filter((item) => item.id !== id),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      cartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      cartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'natuaroma-cart',
      // Solo persistimos los items, no el estado isOpen
      partialize: (state) => ({ items: state.items }),
    }
  )
);
