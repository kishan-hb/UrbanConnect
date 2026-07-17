import { useState } from 'react';
import './CreateServiceModal.css';

function CreateServiceModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || '',
    category: initialData?.category || '',
    image: initialData?.image || '',
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...form,
        price: parseFloat(form.price),
      });
      onClose();
    } catch (err) {
      console.error('Failed to save service:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Service' : 'Create New Service'}</h2>
          <button className="modal-close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Service Name</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g., Premium Plumbing" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} placeholder="Describe your service..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price ($)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Painting">Painting</option>
                <option value="Gardening">Gardening</option>
                <option value="HVAC">HVAC</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Image URL (optional)</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>

          <button type="submit" className="modal-submit" disabled={loading}>
            {loading ? 'Saving...' : initialData ? 'Update Service' : 'Create Service'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateServiceModal;