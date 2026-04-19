import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ICON_OPTIONS, COLOR_OPTIONS } from '../../constants/taskOptions';

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingId,
  editingResetCount,
  formPerson,
  setFormPerson,
  personOptions,
  formLabel,
  setFormLabel,
  formDate,
  setFormDate,
  formColor,
  setFormColor,
  formIconIndex,
  setFormIconIndex,
}) => {
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen) setFormError('');
  }, [isOpen, formPerson, formLabel, formDate]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const label = formLabel.trim();
    if (!label) {
      setFormError('Enter a task name.');
      return;
    }
    if (!formDate) {
      setFormError('Choose date and time.');
      return;
    }
    setFormError('');
    onSubmit(e);
  };

  return (
    <div
      className="modal-backdrop lts-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modal-box lts-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lts-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header lts-modal__header">
          <h2 id="lts-modal-title" className="modal-title">
            {editingId ? 'Edit task' : 'New task'}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={24} aria-hidden />
          </button>
        </div>
        <form className="modal-form lts-modal__form" onSubmit={handleSubmit} noValidate>
          {editingId != null && (
            <p className="lts-modal__readonly">
              Total resets: <strong>{editingResetCount ?? 0}</strong>
              <span className="lts-modal__readonly-hint"> (increments when you use Reset on the card)</span>
            </p>
          )}
          <label className="form-label" htmlFor="lts-field-person">
            <span>Person / group</span>
            <input
              id="lts-field-person"
              type="text"
              className="form-input"
              placeholder="e.g. Emma, Work, Team A"
              value={formPerson}
              onChange={(e) => setFormPerson(e.target.value)}
              autoComplete="off"
              list="lts-people-options"
              maxLength={40}
            />
            <small className="lts-field-hint">Leave empty to save under “General”.</small>
          </label>
          <datalist id="lts-people-options">
            {(personOptions || []).map((person) => (
              <option key={person} value={person} />
            ))}
          </datalist>
          <label className="form-label" htmlFor="lts-field-label">
            <span>Task name</span>
            <input
              id="lts-field-label"
              type="text"
              className="form-input"
              placeholder="e.g. Watered plants"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              autoFocus
              autoComplete="off"
            />
          </label>
          <label className="form-label" htmlFor="lts-field-datetime">
            <span>Last time</span>
            <input
              id="lts-field-datetime"
              type="datetime-local"
              className="form-input form-input-datetime"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
            />
          </label>
          <fieldset className="lts-fieldset">
            <legend className="form-label lts-legend">Color</legend>
            <div className="color-swatches lts-swatch-grid">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${formColor === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setFormColor(c)}
                  aria-label={`Color ${c}`}
                  aria-pressed={formColor === c}
                />
              ))}
            </div>
          </fieldset>
          <fieldset className="lts-fieldset">
            <legend className="form-label lts-legend">Icon</legend>
            <div className="icon-swatches lts-icon-grid">
              {ICON_OPTIONS.map((opt, idx) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`icon-swatch ${formIconIndex === idx ? 'active' : ''}`}
                  onClick={() => setFormIconIndex(idx)}
                  aria-label={`Icon ${opt.key}`}
                  aria-pressed={formIconIndex === idx}
                >
                  <opt.Icon size={22} aria-hidden />
                </button>
              ))}
            </div>
          </fieldset>
          {formError ? (
            <p className="lts-form-error" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="modal-actions lts-modal__actions">
            <button type="button" className="btn btn-ghost lts-btn-wide-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary lts-btn-wide-sm">
              {editingId ? 'Save' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
