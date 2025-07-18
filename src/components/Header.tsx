import React from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-blue-800 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img 
                src="/lovable-uploads/9b42c009-4184-49b0-ab24-c1f832711649.png" 
                alt="East Coast Railway Logo" 
                className="w-10 h-10 rounded-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">पूर्व तट रेलवे</h1>
              <p className="text-sm text-blue-200">( EAST COAST RAILWAY )</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <User size={16} />
                <span>{user.email}</span>
              </div>
              <button className="p-2 rounded-md hover:bg-blue-700 transition-colors">
                <Settings size={20} />
              </button>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-blue-700 hover:text-white"
              >
                <LogOut size={16} />
                <span className="hidden md:inline ml-1">Logout</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => window.location.href = '/auth'}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-blue-700 hover:text-white"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
