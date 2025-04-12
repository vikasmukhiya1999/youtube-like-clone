export function FilterButton({ text, isActive, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1 rounded-full text-sm whitespace-nowrap transition-colors duration-200 ${
        isActive 
          ? 'bg-gray-900 text-white hover:bg-gray-800' 
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}
    >
      {text}
    </button>
  );
}