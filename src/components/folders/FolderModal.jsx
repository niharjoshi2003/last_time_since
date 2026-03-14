import React from 'react';
import { X } from 'lucide-react';

const FOLDER_COLORS = [
  '#dc2626',
  '#ea580c',
  '#d97706',
  '#ca8a04',
  '#10b981',
  '#0891b2',
  '#0284c7',
  '#2563eb',
  '#7c3aed',
  '#9333ea',
  '#db2777',
  '#6b7280',
];

const FOLDER_ICONS = [
  '📁',
  '💕',
  '👋',
  '🎉',
  '🚀',
  '🎨',
  '📝',
  '💬',
  '🎵',
  '📸',
  '🍽️',
  '🏃',
  '📚',
  '🎮',
  '✨',
  '❤️',
];

const FolderModal = ({ isOpen, onClose, onSubmit, editingFolder, formName, setFormName, formColor, setFormColor, formIcon, setFormIcon, formDescription, setFormDescription }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingFolder ? 'Edit folder' : 'New folder'}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={24} aria-hidden />
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <label className="form-label">
            <span>Folder name</span>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. GF 1, Healthy Habits"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              autoFocus
            />
          </label>

          <label className="form-label">
            <span>Description (optional)</span>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Track activities with GF 1"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </label>

          <div className="form-row">
            <label className="form-label form-label-inline">
              <span>Color</span>
              <div className="color-swatches">
                {FOLDER_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-swatch ${formColor === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setFormColor(c)}
                  />
                ))}
              </div>
            </label>
          </div>

          <div className="form-row">
            <label className="form-label form-label-inline">
              <span>Icon</span>
              <div className="icon-swatches folder-icons">
                {FOLDER_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-swatch ${formIcon === icon ? 'active' : ''}`}
                    onClick={() => setFormIcon(icon)}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
                  </button>
                ))}
              </div>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingFolder ? 'Save' : 'Create folder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;
