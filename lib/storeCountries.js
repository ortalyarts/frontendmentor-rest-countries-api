import { create } from 'zustand';

export const useCountriesStore = create((set) => ({
  fetchedCountries: [],
  setFetchedCountries: (data) => set({ fetchedCountries: data }),
}));
