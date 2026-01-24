import { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function InquiryForm({ product }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/inquiries`, {
        ...formData,
        product_id: product.id,
        product_name: product.name
      });

      toast.success('Inquiry submitted successfully! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E6E4DF] p-6" data-testid="inquiry-form">
      <h2 className="font-heading text-2xl text-[#1A1A1A] mb-6">Make an Inquiry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name" className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">
            Name *
          </Label>
          <Input
            id="name"
            data-testid="inquiry-name-input"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">
            Email *
          </Label>
          <Input
            id="email"
            data-testid="inquiry-email-input"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">
            Phone *
          </Label>
          <Input
            id="phone"
            data-testid="inquiry-phone-input"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
          />
        </div>

        <div>
          <Label htmlFor="message" className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">
            Message (Optional)
          </Label>
          <Textarea
            id="message"
            data-testid="inquiry-message-input"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full bg-transparent border border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-3 py-3 outline-none transition-colors resize-none"
          />
        </div>

        <Button
          type="submit"
          data-testid="inquiry-submit-btn"
          disabled={loading}
          className="w-full bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full px-8 py-6 text-sm uppercase tracking-widest transition-all duration-300"
        >
          {loading ? 'Sending...' : 'Submit Inquiry'}
        </Button>
      </form>
    </div>
  );
}

export default InquiryForm;