import { FilterButton } from './FilterButton';
import { filterItems } from '../../constants/menuItems';
import { useSearch } from '../../hooks/useSearch';

export function FilterBar() {
  const { selectedCategory, setSelectedCategory } = useSearch();

  return (
    <div className="p-4 overflow-x-auto flex gap-3 bg-white sticky top-14 z-40">
      {filterItems.map((filter) => (
        <FilterButton 
          key={filter} 
          text={filter}
          isActive={selectedCategory === filter}
          onClick={() => setSelectedCategory(filter)}
        />
      ))}
    </div>
  );
}