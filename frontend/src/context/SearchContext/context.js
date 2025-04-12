import { createContext } from 'react';

export const SearchContext = createContext({
  searchQuery: '',
  setSearchQuery: () => {},
  selectedCategory: 'All',
  setSelectedCategory: () => {},
  isLoading: false,
  error: null,
  clearError: () => {}
});