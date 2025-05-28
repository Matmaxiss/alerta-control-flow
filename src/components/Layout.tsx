
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, Bell, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-bold text-foreground">
                Alert System
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">Panel Principal</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  {user?.username}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user?.role}
                </span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
