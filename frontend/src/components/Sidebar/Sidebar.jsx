import { menuItems } from '../../constants/menuItems';
import { SidebarItem } from './SidebarItem';

export function Sidebar({ isOpen, isMobile, onClose }) {
  return (
    <aside 
      className={`fixed left-0 top-14 h-[calc(100vh-3.5rem)] bg-white transition-transform duration-300 ease-out
        ${isMobile ? 'w-72 z-30 shadow-lg' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <nav className="h-full overflow-y-auto">
        <div className="p-2 space-y-1">
          {menuItems.map((item) => (
            <SidebarItem 
              key={item.text}
              Icon={item.icon}
              text={item.text}
              onClick={isMobile ? onClose : undefined}
            />
          ))}
        </div>
      </nav>
    </aside>
  );
}
