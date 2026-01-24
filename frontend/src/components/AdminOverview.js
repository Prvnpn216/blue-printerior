import { useState, useEffect } from 'react';
import axios from 'axios';
import { FolderOpen, Package, Mail, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    products: 0,
    inquiries: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [projectsRes, productsRes, inquiriesRes] = await Promise.all([
        axios.get(`${API}/projects`, { headers }),
        axios.get(`${API}/products`, { headers }),
        axios.get(`${API}/inquiries`, { headers })
      ]);

      setStats({
        projects: projectsRes.data.length,
        products: productsRes.data.length,
        inquiries: inquiriesRes.data.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const statCards = [
    { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'bg-blue-500' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-green-500' },
    { label: 'Inquiries', value: stats.inquiries, icon: Mail, color: 'bg-purple-500' },
  ];

  return (
    <div data-testid="admin-overview">
      <h1 className="font-heading text-3xl text-[#1A1A1A] mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white border border-[#E6E4DF] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wider text-[#66605B] mb-2">{stat.label}</p>
                  <p className="font-heading text-4xl text-[#1A1A1A]">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminOverview;