import React from 'react';
import { Calendar, FileText, Home } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ isOpen, activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'appointments', label: 'Appointments & Meetings', icon: Calendar },
    { id: 'programmes', label: 'Tour Programmes', icon: FileText },
  ];

  return (
    <aside className={`
      fixed md:relative top-0 left-0 h-svh bg-blue-900 text-white transition-transform duration-300 z-40
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      w-64 md:w-72 lg:w-80
    `}>
      <div className="h-full min-h-0 bg-blue-900 flex flex-col">
        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${activeTab === item.id 
                      ? 'bg-blue-700 text-white shadow-lg border-l-4 border-white' 
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-800 mt-auto">
          <div className="text-xs text-blue-200 text-center">
            <p className="font-medium">पूर्व तट रेलवे</p>
            <p className="mt-1">East Coast Railway</p>
            <p className="mt-2 text-blue-300">© 2025 Government of India</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
