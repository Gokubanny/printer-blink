// src/components/Navbar.tsx - Mobile Responsive
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Printer, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/usePrinters';
import { useState } from 'react';

export const Navbar = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg sm:text-xl" onClick={closeMobileMenu}>
            <Printer className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="xs:inline">Hyperdist</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link to="/" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="text-sm lg:text-base text-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-1 lg:mr-2" />
                  <span className="hidden lg:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/admin">
                <Button variant="outline" size="sm">Admin</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-accent rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
              <Link 
                to="/about" 
                className="px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              {isAdmin ? (
                <>
                  <Link 
                    to="/admin" 
                    className="px-4 py-2 text-foreground hover:bg-accent rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mx-4 py-2 px-4 border rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/admin" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full mx-4" size="sm">
                    Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};