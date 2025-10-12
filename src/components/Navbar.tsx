import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/usePrinters';

export const Navbar = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Printer className="h-6 w-6 text-primary" />
            PrintHub
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/admin">
                <Button variant="outline" size="sm">Admin Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
