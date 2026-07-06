import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function GalleryPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [showSlider, setShowSlider] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredImages(allImages);
    } else {
      setFilteredImages(allImages.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory, allImages]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      const projectsData = response.data;
      setProjects(projectsData);

      // Extract all images with category info
      const images = [];
      const categoriesSet = new Set();

      projectsData.forEach(project => {
        categoriesSet.add(project.category);
        
        // Add featured image if exists
        if (project.featured_image) {
          images.push({
            url: project.featured_image,
            category: project.category,
            projectTitle: project.title,
            projectId: project.id
          });
        }

        // Add gallery images
        if (project.images && project.images.length > 0) {
          project.images.forEach(img => {
            images.push({
              url: img.url,
              category: project.category,
              projectTitle: project.title,
              projectId: project.id
            });
          });
        }
      });

      setAllImages(images);
      setCategories(['all', ...Array.from(categoriesSet)]);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const openSlider = (index) => {
    setCurrentImageIndex(index);
    setShowSlider(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSlider = () => {
    setShowSlider(false);
    document.body.style.overflow = 'unset';
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]" data-testid="gallery-page">
      <Navbar />
      
      <div className="px-6 md:px-12 lg:px-24 py-24 md:py-32">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">Gallery</p>
          <h1 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A] mb-4">
            Our Portfolio
          </h1>
          <p className="text-lg text-[#66605B] leading-relaxed max-w-2xl mx-auto">
            Browse through our collection of stunning interior designs
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12" data-testid="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              disabled={selectedCategory !== 'all' && selectedCategory !== category}
              data-testid={`category-${category}`}
              className={`px-6 py-3 text-sm uppercase tracking-widest rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#1A1A1A] text-white'
                  : selectedCategory !== 'all' && selectedCategory !== category
                  ? 'bg-[#E6E4DF] text-[#66605B] opacity-50 cursor-not-allowed'
                  : 'bg-white text-[#1A1A1A] border border-[#E6E4DF] hover:border-[#1A1A1A]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#66605B]">Loading gallery...</p>
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="image-grid">
            {filteredImages.map((image, index) => (
              <motion.div
                key={`${image.projectId}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => openSlider(index)}
                data-testid={`gallery-image-${index}`}
                className="aspect-square overflow-hidden bg-white border border-[#E6E4DF] cursor-pointer group"
              >
                <img
                  src={image.url}
                  alt={image.projectTitle}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#66605B]">No images available for this category.</p>
          </div>
        )}
      </div>

      {/* Image Slider Modal */}
      <AnimatePresence>
        {showSlider && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            data-testid="image-slider-modal"
          >
            {/* Close Button */}
            <button
              onClick={closeSlider}
              data-testid="close-slider-btn"
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-20"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center px-20 py-16">
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Previous Button */}
                <button
                  onClick={goToPrevious}
                  data-testid="slider-prev-btn"
                  className="absolute left-0 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-7 h-7 text-white" />
                </button>

                {/* Main Image */}
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-full max-h-full"
                >
                  <img
                    src={filteredImages[currentImageIndex].url}
                    alt={filteredImages[currentImageIndex].projectTitle}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </motion.div>

                {/* Next Button */}
                <button
                  onClick={goToNext}
                  data-testid="slider-next-btn"
                  className="absolute right-0 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-7 h-7 text-white" />
                </button>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="h-32 bg-black/50 border-t border-white/10 px-6 py-4 overflow-x-auto flex items-center gap-3">
              {filteredImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  data-testid={`thumbnail-${index}`}
                  className={`flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Image Counter & Info */}
            <div className="absolute top-6 left-6 text-white">
              <p className="text-sm tracking-wider">
                {currentImageIndex + 1} / {filteredImages.length}
              </p>
              <p className="text-xs text-white/60 mt-1 uppercase tracking-widest">
                {filteredImages[currentImageIndex].category}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalleryPage;
