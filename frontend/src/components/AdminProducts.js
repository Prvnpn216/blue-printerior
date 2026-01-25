import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    in_stock: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    const productData = {
      ...formData,
      price: parseFloat(formData.price)
    };

    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, productData, { headers });
        toast.success('Product updated successfully!');
      } else {
        await axios.post(`${API}/products`, productData, { headers });
        toast.success('Product created successfully!');
      }
      
      setShowDialog(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API}/products/${id}`, { headers });
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      in_stock: product.in_stock
    });
    setShowDialog(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem('admin_token');
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await axios.post(`${API}/upload-image`, formDataUpload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setFormData(prev => ({ ...prev, image: response.data.url }));
      toast.success('Image uploaded successfully!');
      e.target.value = '';
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      in_stock: true
    });
    setEditingProduct(null);
  };

  return (
    <div data-testid="admin-products">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-[#1A1A1A]">Products</h1>
        <Button
          onClick={() => { resetForm(); setShowDialog(true); }}
          data-testid="add-product-btn"
          className="bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full px-6 py-5 text-sm uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-[#E6E4DF] overflow-hidden" data-testid={`product-item-${product.id}`}>
            <div className="aspect-[3/4] overflow-hidden bg-[#F2F0EB]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wider text-[#66605B] mb-1">{product.category}</p>
              <h3 className="font-heading text-lg text-[#1A1A1A] mb-2">{product.name}</h3>
              <p className="text-lg font-medium text-[#C5A059] mb-3">${product.price.toLocaleString()}</p>
              {!product.in_stock && (
                <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 mb-3">Out of Stock</span>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(product)}
                  data-testid={`edit-product-${product.id}`}
                  variant="outline"
                  className="flex-1 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full py-3 text-xs uppercase tracking-wider"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  data-testid={`delete-product-${product.id}`}
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full py-3 text-xs uppercase tracking-wider"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#66605B]">No products yet. Create your first product!</p>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white" data-testid="product-form-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Name *</Label>
              <Input
                data-testid="product-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full border border-[#E6E4DF] px-3 py-2"
              />
            </div>

            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Category *</Label>
              <Input
                data-testid="product-category-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="e.g., Furniture, Lighting"
                className="w-full border border-[#E6E4DF] px-3 py-2"
              />
            </div>

            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Price ($) *</Label>
              <Input
                data-testid="product-price-input"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full border border-[#E6E4DF] px-3 py-2"
              />
            </div>

            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Description *</Label>
              <Textarea
                data-testid="product-description-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full border border-[#E6E4DF] px-3 py-2 resize-none"
              />
            </div>

            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Image</Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                data-testid="product-image-upload"
                className="mb-3 text-sm"
              />
              {formData.image && (
                <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover border border-[#E6E4DF]" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="in_stock"
                data-testid="product-stock-checkbox"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="in_stock" className="text-sm uppercase tracking-wider text-[#66605B]">In Stock</Label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                data-testid="save-product-btn"
                className="flex-1 bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full py-5 text-sm uppercase tracking-widest"
              >
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                onClick={() => { setShowDialog(false); resetForm(); }}
                variant="outline"
                className="flex-1 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full py-5 text-sm uppercase tracking-widest"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminProducts;