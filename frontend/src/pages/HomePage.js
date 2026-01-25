import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const heroImages = [
  'https://images.unsplash.com/photo-1762545078318-8443881c2d83?q=85&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1758448511421-debb41f3e621?q=85&w=1920&auto=format&fit=crop'
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects?featured=true`);
      setProjects(response.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <Navbar />
      
      {/* Hero Slider */}
      <section className="relative h-screen overflow-hidden" data-testid="hero-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentSlide]}
              alt="Interior Design"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>
        
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <h1 className="font-heading text-5xl md:text-7xl text-white font-light tracking-tight leading-none mb-4">
              Crafting Timeless
              <br />
              Living Spaces
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl mb-8">
              Where luxury meets functionality in every detail
            </p>
            <Link
              to="/products"
              data-testid="explore-products-btn"
              className="inline-block bg-white text-[#1A1A1A] hover:bg-[#E6E4DF] rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-all duration-300"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          data-testid="slider-prev-btn"
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          data-testid="slider-next-btn"
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32" data-testid="featured-projects-section">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">Portfolio</p>
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A]">
            Featured Projects
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#66605B]">Loading projects...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
              >
                <Link
                  to={`/projects/${project.id}`}
                  data-testid={`project-card-${project.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-white border border-[#E6E4DF] transition-all duration-500 hover:shadow-lg">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={project.featured_image || project.images[0]?.url || 'https://images.unsplash.com/photo-1763485956303-daf935882443?q=85&w=800&auto=format&fit=crop'}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-xs tracking-widest uppercase text-[#66605B] mb-2">{project.category}</p>
                      <h3 className="font-heading text-2xl text-[#1A1A1A] mb-2">{project.title}</h3>
                      <p className="text-[#66605B] leading-relaxed line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {projects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-[#66605B]">No featured projects available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;