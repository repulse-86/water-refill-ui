import { create } from 'zustand';

const useAuthModalStore = create((set) => ({
  isOpen: false,
  openAuth: () => set({ isOpen: true }),
  closeAuth: () => set({ isOpen: false }),
}));

export default useAuthModalStore;