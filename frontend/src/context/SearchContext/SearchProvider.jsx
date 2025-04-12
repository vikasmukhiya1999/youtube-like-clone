import { useState, useCallback } from 'react';
import { SearchContext } from './context';

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSetSearchQuery = useCallback((query) => {
    setIsLoading(true);
    setError(null);
    try {
      setSearchQuery(query);
    } catch (err) {
      setError('Failed to update search');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSetCategory = useCallback((category) => {
    setIsLoading(true);
    setError(null);
    try {
      setSelectedCategory(category);
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery: handleSetSearchQuery, 
      selectedCategory, 
      setSelectedCategory: handleSetCategory,
      isLoading,
      error,
      clearError
    }}>
      {children}
    </SearchContext.Provider>
  );
}