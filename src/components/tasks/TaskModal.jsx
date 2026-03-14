import React from 'react';
import { X } from 'lucide-react';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../../constants/taskOptions';

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingId,
  formLabel,
  setFormLabel,
  formDate,
  setFormDate,
  formColor,
  setFormColor,
  formIconIndex,
  setFormIconIndex,
  folders,
  formFolderId,
  setFormFolderId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingId ? 'Edit task' : 'New task'}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={24} aria-hidden />
          </button>
        </div>
        <form className="modal-form" onSubmit={onSubmit}>
          <label className="form-label">
            <span>What did you do?</span>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. i texted her"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              autoFocus
            />
          </label>

          <label className="form-label">
            <span>Folder</span>
            <select
              className="form-input"
              value={formFolderId || 'all'}
              onChange={(e) => setFormFolderId(e.target.value === 'all' ? null : e.target.value)}
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            <span>Last time (date & time)</span>
            <input
              type="datetime-local"
              className="form-input form-input-datetime"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
            />
          </label>
          <div className="form-row">
            <label className="form-label form-label-inline">
              <span>Color</span>
              <div className="color-swatches">
                {COLOR_OPTIONS.map((c) => (
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
              <div className="icon-swatches">
                {ICON_OPTIONS.map((opt, idx) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`icon-swatch ${formIconIndex === idx ? 'active' : ''}`}
                    onClick={() => setFormIconIndex(idx)}
                  >
                    <opt.Icon size={20} />
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
              {editingId ? 'Save' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
