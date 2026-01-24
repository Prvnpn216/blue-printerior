import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Package, Mail, LogOut } from 'lucide-react';
import AdminProjects from '../components/AdminProjects';
import AdminProducts from '../components/AdminProducts';
import AdminInquiries from '../components/AdminInquiries';
import AdminOverview from '../components/AdminOverview';
import { Button } from '../components/ui/button';

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/inquiries', label: 'Inquiries', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E6E4DF] flex flex-col">
        <div className="p-6 border-b border-[#E6E4DF]">
          <h1 className="font-heading text-2xl text-[#1A1A1A]">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-4 py-3 mb-2 rounded transition-colors ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#66605B] hover:bg-[#F2F0EB]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#E6E4DF]">
          <Button
            onClick={handleLogout}
            data-testid="logout-btn"
            variant="outline"
            className="w-full flex items-center gap-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full py-5 text-sm uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="/" element={<AdminOverview />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;