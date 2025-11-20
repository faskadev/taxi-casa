import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export const useStore = create((set, get) => ({
  isNightMode: false,
  activeRide: null,
  history: [],

  init: async () => {
    const saved = await AsyncStorage.getItem("history");
    if (saved) set({ history: JSON.parse(saved) });
  },

  toggleNightMode: () =>
    set((state) => ({ isNightMode: !state.isNightMode })),

  startRide: (ride) => set(() => ({ activeRide: ride })),

  endRide: async () => {
    const { activeRide, history } = get();
    if (activeRide) {
      const newHistory = [activeRide, ...history];
      await AsyncStorage.setItem("history", JSON.stringify(newHistory));
      set({ activeRide: null, history: newHistory });
    }
  },

  deleteRide: async (id) => {
    const newHistory = get().history.filter((r) => r.id !== id);
    await AsyncStorage.setItem("history", JSON.stringify(newHistory));
    set({ history: newHistory });
  },
}));
