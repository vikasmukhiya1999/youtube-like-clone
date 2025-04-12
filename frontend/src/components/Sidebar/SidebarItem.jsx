export function SidebarItem({ Icon, text, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center w-full p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
    >
      <Icon className="h-6 w-6 mr-4 text-gray-600 group-hover:text-gray-900" />
      <span className="text-gray-700 group-hover:text-gray-900">{text}</span>
    </button>
  )
}