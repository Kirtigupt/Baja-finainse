import React, { useState } from 'react';

export default function TicketForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    customerEmail: '',
    priority: 'low'
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-overlay">
      <div className="modal glass">
        <h2>Create Ticket</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject</label>
            <input 
              name="subject" 
              value={formData.subject} 
              onChange={handleChange} 
              required 
              className="form-input" 
            />
          </div>
          
          <div className="form-group">
            <label>Customer Email</label>
            <input 
              name="customerEmail" 
              type="email"
              value={formData.customerEmail} 
              onChange={handleChange} 
              required 
              className="form-input" 
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select 
              name="priority" 
              value={formData.priority} 
              onChange={handleChange} 
              className="form-input"
            >
              <option value="low">Low (72h SLA)</option>
              <option value="medium">Medium (24h SLA)</option>
              <option value="high">High (4h SLA)</option>
              <option value="urgent">Urgent (1h SLA)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
              className="form-input" 
            />
          </div>

          {error && <div className="error-text">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Create Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
}
