import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Play, Phone, Mail, MapPin, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const heroImages = [
  'https://images.unsplash.com/photo-1762545078318-8443881c2d83?q=85&w=1920&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1758448511421-debb41f3e621?q=85&w=1920&auto=format&fit=crop'
];

// Moving gallery images
const galleryImages = [
  'https://images.unsplash.com/photo-1763485956303-daf935882443?q=85&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1668026694348-b73c5eb5e299?q=85&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1593136573819-c3b57b8caf29?q=85&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1669653862523-904e92ee90b4?q=85&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1760684857349-1a181af34840?q=85&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1762803841508-328e11286dfc?q=85&w=600&auto=format&fit=crop'
];

const services = [
  {
    title: 'Interior Design',
    description: 'Transform your space with our bespoke interior design solutions tailored to your lifestyle',
    icon: '✨'
  },
  {
    title: 'Complete Renovation',
    description: 'End-to-end renovation services bringing your vision to life with precision',
    icon: '🏗️'
  },
  {
    title: 'Turnkey Projects',
    description: 'Hassle-free turnkey solutions from concept to completion',
    icon: '🔑'
  },
  {
    title: 'Construction',
    description: 'Quality construction services with attention to every detail',
    icon: '🏛️'
  },
  {
    title: 'Space Planning',
    description: 'Optimize your space with intelligent planning and design',
    icon: '📐'
  },
  {
    title: 'Custom Furniture',
    description: 'Bespoke furniture crafted to perfection for your unique space',
    icon: '🪑'
  }
];

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef(null);
  const videoSectionRef = useRef(null);
  const isVideoInView = useInView(videoSectionRef, { amount: 0.5 });

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      if (isVideoInView) {
        videoRef.current.play().catch(err => console.log('Video play error:', err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoInView]);

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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/inquiries`, {
        ...contactForm,
        product_id: 'contact-form',
        product_name: 'General Inquiry'
      });

      toast.success('Thank you! We will get back to you soon.');
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

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
            <img src={heroImages[currentSlide]} alt="Interior Design" className="w-full h-full object-cover" />
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

        <button onClick={prevSlide} data-testid="slider-prev-btn" className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-300">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={nextSlide} data-testid="slider-next-btn" className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-300">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
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
                <Link to={`/projects/${project.id}`} data-testid={`project-card-${project.id}`} className="group block">
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

      {/* Featured Video Section */}
      <section ref={videoSectionRef} className="relative h-screen overflow-hidden" data-testid="video-section">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=85&w=1920&auto=format&fit=crop"
        >
          <source src="https://player.vimeo.com/external/371433846.sd.mp4?s=236bc567b85f9e853346f33e6c0e6e8c9f4f4f4f&profile_id=165" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Play className="w-20 h-20 mx-auto mb-6 opacity-80" />
              <h2 className="font-heading text-4xl md:text-6xl font-light tracking-tight mb-4">
                Experience Our Craftsmanship
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Watch how we transform spaces into timeless masterpieces
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-white" data-testid="services-section">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">What We Do</p>
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A] mb-4">
            Our Services
          </h2>
          <p className="text-lg text-[#66605B] leading-relaxed max-w-2xl mx-auto">
            Comprehensive solutions for all your interior design and construction needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 border border-[#E6E4DF] hover:border-[#C5A059] transition-all duration-300 group"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="font-heading text-2xl text-[#1A1A1A] mb-3">{service.title}</h3>
              <p className="text-[#66605B] leading-relaxed">{service.description}</p>
              <div className="mt-6 flex items-center gap-2 text-[#C5A059] group-hover:gap-4 transition-all duration-300">
                <span className="text-sm uppercase tracking-widest">Learn More</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Moving Gallery Section */}
      <section className="py-24 md:py-32 overflow-hidden bg-[#F9F8F6]" data-testid="moving-gallery-section">
        <div className="text-center mb-12 px-6">
          <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">Gallery</p>
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A]">
            Our Work in Motion
          </h2>
        </div>

        <div className="relative">
          <div className="flex animate-scroll gap-6">
            {[...galleryImages, ...galleryImages].map((img, idx) => (
              <div key={idx} className="flex-shrink-0 w-80 h-96 overflow-hidden">
                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-white" data-testid="testimonials-section">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">Testimonials</p>
          <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A] mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-[#66605B] leading-relaxed max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Instagram video embeds - Replace with actual Instagram video URLs */}
          {[1, 2, 3].map((idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="aspect-[9/16] bg-[#F2F0EB] border border-[#E6E4DF] overflow-hidden"
              data-testid={`testimonial-${idx}`}
            >
              {/* Instagram embed iframe - admin can replace with actual Instagram video URLs */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-6">
                  <p className="text-sm text-[#66605B] mb-4">Instagram Video Embed</p>
                  <p className="text-xs text-[#66605B]">
                    Replace with actual Instagram video URL in admin panel
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-6 md:px-12 lg:px-24 py-24 md:py-32 bg-[#F9F8F6]" data-testid="contact-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div>
              <p className="text-xs tracking-widest uppercase text-[#66605B] mb-3">Get in Touch</p>
              <h2 className="font-heading text-4xl md:text-5xl tracking-tight leading-tight font-light text-[#1A1A1A] mb-6">
                Let's Create Something Beautiful
              </h2>
              <p className="text-lg text-[#66605B] leading-relaxed mb-8">
                Ready to transform your space? We'd love to hear about your project and bring your vision to life.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider text-[#66605B] mb-1">Phone</p>
                    <p className="text-[#1A1A1A]">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider text-[#66605B] mb-1">Email</p>
                    <p className="text-[#1A1A1A]">hello@interieurs.design</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C5A059]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#C5A059]" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wider text-[#66605B] mb-1">Address</p>
                    <p className="text-[#1A1A1A]">123 Design Street, Creative City, CC 12345</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-[#E6E4DF] p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Name *</label>
                  <Input
                    data-testid="contact-name-input"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Email *</label>
                  <Input
                    type="email"
                    data-testid="contact-email-input"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Phone *</label>
                  <Input
                    type="tel"
                    data-testid="contact-phone-input"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-0 py-3 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Message</label>
                  <Textarea
                    data-testid="contact-message-input"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    className="w-full bg-transparent border border-[#E6E4DF] focus:border-[#1A1A1A] rounded-none px-3 py-3 outline-none transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  data-testid="contact-submit-btn"
                  disabled={submitting}
                  className="w-full bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full px-8 py-6 text-sm uppercase tracking-widest transition-all duration-300"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white px-6 md:px-12 lg:px-24 py-12">
        <div className="text-center">
          <h3 className="font-heading text-2xl mb-4">Intérieurs</h3>
          <p className="text-white/60 text-sm">© 2026 Intérieurs. Crafting timeless living spaces.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default HomePage;
