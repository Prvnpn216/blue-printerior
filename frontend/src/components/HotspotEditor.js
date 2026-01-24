import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function HotspotEditor({ image, onSave, onClose }) {
  const [hotspots, setHotspots] = useState(image.hotspots || []);
  const [products, setProducts] = useState([]);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [clickPosition, setClickPosition] = useState(null);

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

  const handleImageClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setClickPosition({ x, y });
    setShowProductSelector(true);
  };

  const handleProductSelect = (product) => {
    if (clickPosition) {
      const newHotspot = {
        id: `hotspot-${Date.now()}`,
        x: clickPosition.x,
        y: clickPosition.y,
        product_id: product.id,
        product_name: product.name
      };
      setHotspots([...hotspots, newHotspot]);
      setShowProductSelector(false);
      setClickPosition(null);
    }
  };

  const handleRemoveHotspot = (id) => {
    setHotspots(hotspots.filter(h => h.id !== id));
  };

  const handleSave = () => {
    onSave(hotspots);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" data-testid="hotspot-editor">
      <div className="bg-white max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-[#E6E4DF] p-4 flex items-center justify-between z-10">
          <h2 className="font-heading text-2xl text-[#1A1A1A]">Edit Hotspots</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#F2F0EB] rounded">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-[#66605B] mb-4">
            Click on the image to add a hotspot. Current hotspots: {hotspots.length}
          </p>

          <div className="relative inline-block max-w-full">
            <img
              src={image.url}
              alt="Edit hotspots"
              className="w-full cursor-crosshair"
              onClick={handleImageClick}
            />
            
            {hotspots.map((hotspot) => (
              <div
                key={hotspot.id}
                className="absolute"
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
              >
                <div className="relative group">
                  <div className="w-4 h-4 bg-white rounded-full border-2 border-[#C5A059] shadow-lg" />
                  <button
                    onClick={() => handleRemoveHotspot(hotspot.id)}
                    data-testid={`remove-hotspot-${hotspot.id}`}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {hotspot.product_name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSave}
              data-testid="save-hotspots-btn"
              className="flex-1 bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full py-5 text-sm uppercase tracking-widest"
            >
              Save Hotspots
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full py-5 text-sm uppercase tracking-widest"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Product Selector Modal */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" data-testid="product-selector">
            <h3 className="font-heading text-xl text-[#1A1A1A] mb-4">Select Product</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  data-testid={`select-product-${product.id}`}
                  className="text-left border border-[#E6E4DF] hover:border-[#C5A059] transition-colors p-3"
                >
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2" />
                  <p className="text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                  <p className="text-xs text-[#66605B]">${product.price}</p>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setShowProductSelector(false)}
              className="w-full mt-4 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full py-3"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotspotEditor;