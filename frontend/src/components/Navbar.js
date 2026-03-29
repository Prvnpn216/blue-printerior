import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#E6E4DF]" data-testid="navbar">
      <div className="px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl text-[#1A1A1A]" data-testid="nav-logo">
            Intérieurs
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              data-testid="nav-home-link"
              className="text-sm uppercase tracking-widest text-[#66605B] hover:text-[#1A1A1A] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/gallery"
              data-testid="nav-gallery-link"
              className="text-sm uppercase tracking-widest text-[#66605B] hover:text-[#1A1A1A] transition-colors"
            >
              Gallery
            </Link>
            <Link
              to="/products"
              data-testid="nav-products-link"
              className="text-sm uppercase tracking-widest text-[#66605B] hover:text-[#1A1A1A] transition-colors"
            >
              Products
            </Link>
            <Link
              to="/admin/login"
              data-testid="nav-admin-link"
              className="text-sm uppercase tracking-widest text-[#66605B] hover:text-[#1A1A1A] transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
            data-testid="mobile-menu-btn"
          >
            <Menu className="w-6 h-6 text-[#1A1A1A]" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3" data-testid="mobile-menu">
            <Link
              to="/"
              className="block text-sm uppercase tracking-widest text-[#66605B] hover:text-[#1A1A1A] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block text-sm uppercase tracking-widest text-[#66605B] hover:text-[#1A1A1A] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/admin/login"
              className="block text-sm uppercase tracking-widest text-[#66605B] hover:text-[#1A1A1A] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;