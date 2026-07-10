import { create } from "zustand";

type AuthStore = {
    token: string | null;
    setToken: (token: string) => void;
    logout: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
    token: null,

    setToken: (token) => set({ token }),

    logout: () => set({ token: null }),
}));

export default useAuthStore;