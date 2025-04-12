import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext/context';

export const useSearch = () => useContext(SearchContext);