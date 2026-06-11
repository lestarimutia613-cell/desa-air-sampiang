import { create } from 'zustand';

export type Page = 
  | 'beranda' 
  | 'layanan' 
  | 'marketplace' 
  | 'kependudukan' 
  | 'corporate-university' 
  | 'literasi' 
  | 'konsol' 
  | 'berita' 
  | 'login' 
  | 'register' 
  | 'admin' 
  | 'admin-login'
  | 'payment'
  | 'order-history'
  | 'product-detail';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  username?: string;
}

interface AppState {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  admin: User | null;
  setAdmin: (admin: User | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: () => number;
  selectedProduct: string | null;
  setSelectedProduct: (id: string | null) => void;
  pendingOrder: {
    items: CartItem[];
    total: number;
  } | null;
  setPendingOrder: (order: { items: CartItem[]; total: number } | null) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'beranda',
  setCurrentPage: (page) => set({ currentPage: page }),
  user: null,
  setUser: (user) => set({ user }),
  admin: null,
  setAdmin: (admin) => set({ admin }),
  cart: [],
  addToCart: (item) => {
    const cart = get().cart;
    const existing = cart.find((c) => c.productId === item.productId);
    if (existing) {
      set({
        cart: cart.map((c) =>
          c.productId === item.productId
            ? { ...c, quantity: c.quantity + item.quantity }
            : c
        ),
      });
    } else {
      set({ cart: [...cart, item] });
    }
  },
  removeFromCart: (productId) =>
    set({ cart: get().cart.filter((c) => c.productId !== productId) }),
  updateCartQuantity: (productId, quantity) =>
    set({
      cart: quantity <= 0
        ? get().cart.filter((c) => c.productId !== productId)
        : get().cart.map((c) =>
            c.productId === productId ? { ...c, quantity } : c
          ),
    }),
  clearCart: () => set({ cart: [] }),
  cartTotal: () =>
    get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  selectedProduct: null,
  setSelectedProduct: (id) => set({ selectedProduct: id }),
  pendingOrder: null,
  setPendingOrder: (order) => set({ pendingOrder: order }),
  chatOpen: false,
  setChatOpen: (open) => set({ chatOpen: open }),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
}));
