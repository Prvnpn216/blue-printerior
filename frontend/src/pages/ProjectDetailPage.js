import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import HotspotImage from '../components/HotspotImage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDialog, setShowProductDialog] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${API}/projects/${id}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHotspotClick = (hotspot) => {
    setSelectedProduct(hotspot);
    setShowProductDialog(true);
  };

  const handleViewProduct = () => {
    if (selectedProduct?.product_id) {
      window.location.href = `/products/${selectedProduct.product_id}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-[#66605B]">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F9F8F6]">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-[#66605B] mb-4">Project not found</p>
          <Link to="/" className="text-[#1A1A1A] hover:text-[#C5A059] underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6]" data-testid="project-detail-page">
      <Navbar />
      
      <div className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        <Link 
          to="/"
          data-testid="back-to-home-btn"
          className="inline-flex items-center gap-2 text-[#1A1A1A] hover:text-[#C5A059] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-widest">Back to Home</span>
        </Link>

        <div className="mb-12">
          <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">{project.category}</p>
          <h1 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A] mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-[#66605B] leading-relaxed max-w-3xl">{project.description}</p>
        </div>

        <div className="image-gallery" data-testid="project-gallery">
          {project.images && project.images.length > 0 ? (
            project.images.map((image, idx) => (
              <div key={idx} className="image-gallery-item">
                <HotspotImage
                  image={image}
                  onHotspotClick={handleHotspotClick}
                />
              </div>
            ))
          ) : (
            <p className="text-[#66605B]">No images available for this project.</p>
          )}
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="bg-white" data-testid="product-inquiry-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">{selectedProduct?.product_name}</DialogTitle>
            <DialogDescription className="text-[#66605B]">
              Would you like to learn more about this item or make an inquiry?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={handleViewProduct}
              data-testid="view-product-btn"
              className="flex-1 bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full px-6 py-6 text-sm uppercase tracking-widest transition-all duration-300"
            >
              View Product
            </Button>
            <Button
              onClick={() => setShowProductDialog(false)}
              data-testid="dialog-close-btn"
              variant="outline"
              className="flex-1 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full px-6 py-6 text-sm uppercase tracking-widest transition-all duration-300"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProjectDetailPage;