import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useDashboardStore = create()(
  persist(
    (set) => ({
      // Overview Widget Layout
      items: ['revenue', 'margin', 'audit', 'growth'],
      sizes: { revenue: true, audit: true, margin: false, growth: false },

      setItems: (newItems) => set({ items: newItems }),
      toggleResize: (id) => set((state) => ({
        sizes: { ...state.sizes, [id]: !state.sizes[id] }
      })),

      // Global UI State
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    }),
    {
      name: 'findash-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
