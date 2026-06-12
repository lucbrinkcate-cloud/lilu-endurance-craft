import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  savedAt: number;
  imageUrl: string;
  prompt: string;
  baseStyle: string;
  primary: string;
  secondary: string;
  accent: string;
  logoUrl: string;
}

interface WishlistStore {
  items: WishlistItem[];
  add: (item: Omit<WishlistItem, "savedAt">) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  get: (id: string) => WishlistItem | undefined;
  clear: () => void;
}

export function makeWishlistId(input: {
  imageUrl: string;
  baseStyle: string;
  primary: string;
  secondary: string;
  accent: string;
}): string {
  const raw = `${input.imageUrl}|${input.baseStyle}|${input.primary}|${input.secondary}|${input.accent}`;
  // Simple stable hash
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = (h << 5) - h + raw.charCodeAt(i);
    h |= 0;
  }
  return `wl_${Math.abs(h).toString(36)}`;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (get().items.some((i) => i.id === item.id)) return;
        set({ items: [{ ...item, savedAt: Date.now() }, ...get().items] });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      has: (id) => get().items.some((i) => i.id === id),
      get: (id) => get().items.find((i) => i.id === id),
      clear: () => set({ items: [] }),
    }),
    {
      name: "velonix-kit-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
