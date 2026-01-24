import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Clock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`${API}/inquiries`, { headers });
      setInquiries(response.data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div data-testid="admin-inquiries">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-[#1A1A1A]">Inquiries</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-[#66605B]">Loading inquiries...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-white border border-[#E6E4DF] p-6" data-testid={`inquiry-item-${inquiry.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-[#1A1A1A]">{inquiry.name}</h3>
                    <p className="text-sm text-[#66605B]">{inquiry.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#66605B]">
                  <Clock className="w-4 h-4" />
                  {formatDate(inquiry.created_at)}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#66605B] mb-1">Phone</p>
                  <p className="text-sm text-[#1A1A1A]">{inquiry.phone}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#66605B] mb-1">Product</p>
                  <p className="text-sm text-[#1A1A1A]">{inquiry.product_name}</p>
                </div>
              </div>

              {inquiry.message && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#66605B] mb-1">Message</p>
                  <p className="text-sm text-[#1A1A1A] leading-relaxed">{inquiry.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {inquiries.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-[#66605B]">No inquiries yet.</p>
        </div>
      )}
    </div>
  );
}

export default AdminInquiries;