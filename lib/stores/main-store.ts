import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface MainState {
  // Store can be extended with other state as needed
}

export const useMainStore = create<MainState>()(
  persist(
    (set) => ({}),
    {
      name: "ms",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
