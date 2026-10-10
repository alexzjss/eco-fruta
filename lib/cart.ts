import { create } from 'zustand';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => set((state) => {
    const existing = state.items.find((item) => item.product.id === product.id);
    if (existing) return { items: state.items.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) } : item) };
    return { items: [...state.items, { product, quantity: Math.min(product.stock, quantity) }] };
  }),
  updateQuantity: (productId, quantity) => set((state) => ({ items: quantity <= 0 ? state.items.filter((item) => item.product.id !== productId) : state.items.map((item) => item.product.id === productId ? { ...item, quantity: Math.min(item.product.stock, quantity) } : item) })),
  removeItem: (productId) => set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),
  clear: () => set({ items: [] }),
  subtotal: () => get().items.reduce((total, item) => total + item.product.price * item.quantity, 0)
}));
