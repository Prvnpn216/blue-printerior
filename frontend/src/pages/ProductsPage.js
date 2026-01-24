import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]" data-testid="products-page">
      <Navbar />
      
      <div className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">Shop</p>
          <h1 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A]">
            Our Collection
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#66605B]">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                <Link
                  to={`/products/${product.id}`}
                  data-testid={`product-card-${product.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden">
                    <div className="aspect-[3/4] overflow-hidden bg-white">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-xs tracking-widest uppercase text-[#66605B] mb-1">{product.category}</p>
                      <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{product.name}</h3>
                      <p className="text-lg font-medium text-[#C5A059]">${product.price.toLocaleString()}</p>
                      {!product.in_stock && (
                        <p className="text-sm text-red-600 mt-1">Out of Stock</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-[#66605B]">No products available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;