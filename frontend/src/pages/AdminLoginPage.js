import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, {
        username,
        password
      });

      localStorage.setItem('admin_token', response.data.access_token);
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#E6E4DF] p-8 md:p-12">
          <h1 className="font-heading text-3xl text-[#1A1A1A] mb-8 text-center">
            Admin Portal
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                data-testid="admin-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                data-testid="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
              />
            </div>

            <Button
              type="submit"
              data-testid="admin-submit-btn"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full px-8 py-6 text-sm uppercase tracking-widest transition-all duration-300"
            >
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              data-testid="toggle-auth-mode-btn"
              className="text-sm text-[#66605B] hover:text-[#1A1A1A] transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;