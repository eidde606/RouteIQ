import {create} from "zustand";
import {persist} from "zustand/middleware"

type AuthStore = {
    token: string | null;
    setToken: (token: string) => void;
    logout: () => void;
};

const useAuthStore = create<AuthStore>(persist(
        (set) => ({
            token: null,

            setToken: (token) => set({token}),

            logout: () => set({token: null}),
        }),
        {
            name: "routeiq-auth",
        }
    )
);

export default useAuthStore;