import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import InquiryForm from '../components/InquiryForm';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API}/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-[#66605B]">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-[#66605B] mb-4">Product not found</p>
          <Link to="/products" className="text-[#1A1A1A] hover:text-[#C5A059] underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]" data-testid="product-detail-page">
      <Navbar />
      
      <div className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <Link 
          to="/products"
          data-testid="back-to-products-btn"
          className="inline-flex items-center gap-2 text-[#1A1A1A] hover:text-[#C5A059] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-widest">Back to Products</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <div className="sticky top-24 self-start">
            <div className="aspect-[3/4] overflow-hidden bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">{product.category}</p>
            <h1 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A] mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-medium text-[#C5A059] mb-6">${product.price.toLocaleString()}</p>
            
            {!product.in_stock && (
              <div className="bg-red-50 border border-red-200 rounded px-4 py-3 mb-6">
                <p className="text-red-600 text-sm">Currently out of stock</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="font-heading text-xl text-[#1A1A1A] mb-3">Description</h2>
              <p className="text-[#66605B] leading-relaxed">{product.description}</p>
            </div>

            {/* Inquiry Form */}
            <InquiryForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
