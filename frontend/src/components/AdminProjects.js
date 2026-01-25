import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import HotspotEditor from './HotspotEditor';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showHotspotEditor, setShowHotspotEditor] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    featured: false,
    featured_image: '',
    images: []
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingProject) {
        await axios.put(`${API}/projects/${editingProject.id}`, formData, { headers });
        toast.success('Project updated successfully!');
      } else {
        await axios.post(`${API}/projects`, formData, { headers });
        toast.success('Project created successfully!');
      }
      
      setShowDialog(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    const token = localStorage.getItem('admin_token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${API}/projects/${id}`, { headers });
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      featured: project.featured,
      featured_image: project.featured_image || '',
      images: project.images || []
    });
    setShowDialog(true);
  };

  const handleFeaturedImageUpload = async (e) => {
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

      setFormData(prev => ({ ...prev, featured_image: response.data.url }));
      toast.success('Featured image uploaded successfully!');
      e.target.value = '';
    } catch (error) {
      toast.error('Failed to upload featured image');
    }
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

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: response.data.url, hotspots: [] }]
      }));
      toast.success('Gallery image uploaded successfully!');
      e.target.value = '';
    } catch (error) {
      toast.error('Failed to upload gallery image');
    }
  };

  const handleEditHotspots = (index) => {
    setCurrentImageIndex(index);
    setShowHotspotEditor(true);
  };

  const handleSaveHotspots = (hotspots) => {
    const updatedImages = [...formData.images];
    updatedImages[currentImageIndex].hotspots = hotspots;
    setFormData({ ...formData, images: updatedImages });
    setShowHotspotEditor(false);
    toast.success('Hotspots saved!');
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      featured: false,
      featured_image: '',
      images: []
    });
    setEditingProject(null);
  };

  return (
    <div data-testid="admin-projects">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-3xl text-[#1A1A1A]">Projects</h1>
        <Button
          onClick={() => { resetForm(); setShowDialog(true); }}
          data-testid="add-project-btn"
          className="bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full px-6 py-5 text-sm uppercase tracking-widest"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white border border-[#E6E4DF] overflow-hidden" data-testid={`project-item-${project.id}`}>
            <div className="aspect-[4/3] overflow-hidden bg-[#F2F0EB]">
              {project.images[0]?.url ? (
                <img src={project.images[0].url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-[#66605B]" />
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wider text-[#66605B] mb-1">{project.category}</p>
              <h3 className="font-heading text-xl text-[#1A1A1A] mb-2">{project.title}</h3>
              <p className="text-sm text-[#66605B] line-clamp-2 mb-4">{project.description}</p>
              {project.featured && (
                <span className="inline-block bg-[#C5A059] text-white text-xs px-2 py-1 mb-3">Featured</span>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(project)}
                  data-testid={`edit-project-${project.id}`}
                  variant="outline"
                  className="flex-1 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white rounded-full py-4 text-xs uppercase tracking-wider"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(project.id)}
                  data-testid={`delete-project-${project.id}`}
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-full py-4 text-xs uppercase tracking-wider"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#66605B]">No projects yet. Create your first project!</p>
        </div>
      )}

      {/* Project Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white" data-testid="project-form-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Title *</Label>
              <Input
                data-testid="project-title-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full border border-[#E6E4DF] px-3 py-2"
              />
            </div>

            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Category *</Label>
              <Input
                data-testid="project-category-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="e.g., Residential, Commercial"
                className="w-full border border-[#E6E4DF] px-3 py-2"
              />
            </div>

            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Description *</Label>
              <Textarea
                data-testid="project-description-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full border border-[#E6E4DF] px-3 py-2 resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                data-testid="project-featured-checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="featured" className="text-sm uppercase tracking-wider text-[#66605B]">Featured Project</Label>
            </div>

            <div>
              <Label className="text-sm uppercase tracking-wider text-[#66605B] mb-2 block">Images</Label>
              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  data-testid="project-image-upload"
                  className="text-sm"
                  key={formData.images.length}
                />
                <p className="text-xs text-[#66605B] mt-1">Upload images for this project</p>
              </div>
              
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative border border-[#E6E4DF] p-2 bg-white">
                      <img src={image.url} alt={`Project ${idx + 1}`} className="w-full h-32 object-cover mb-2" />
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          onClick={() => handleEditHotspots(idx)}
                          data-testid={`edit-hotspots-${idx}`}
                          className="flex-1 bg-[#C5A059] text-white hover:bg-[#a88742] rounded py-1 text-xs"
                        >
                          Edit Dots ({image.hotspots?.length || 0})
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="bg-red-600 text-white hover:bg-red-700 rounded px-2 text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#66605B] py-4 border border-dashed border-[#E6E4DF] text-center">
                  No images uploaded yet
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                data-testid="save-project-btn"
                className="flex-1 bg-[#1A1A1A] text-white hover:bg-[#333333] rounded-full py-5 text-sm uppercase tracking-widest"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
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

      {/* Hotspot Editor Dialog */}
      {showHotspotEditor && (
        <HotspotEditor
          image={formData.images[currentImageIndex]}
          onSave={handleSaveHotspots}
          onClose={() => setShowHotspotEditor(false)}
        />
      )}
    </div>
  );
}

export default AdminProjects;