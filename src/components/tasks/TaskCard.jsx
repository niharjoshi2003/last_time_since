import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ICON_OPTIONS } from '../../constants/taskOptions';
import { formatTime } from '../../utils/formatTime';

const TaskCard = ({ task, elapsed, onEdit, onDelete, folder }) => {
  const { Icon } = ICON_OPTIONS[task.iconIndex ?? 0] || ICON_OPTIONS[0];
  const timeElapsed = elapsed[task.id];

  return (
    <div
      className="card"
      style={{
        background: `linear-gradient(135deg, ${task.color}40 0%, ${task.color}10 50%, transparent 100%)`,
        boxShadow: `0 0 60px -15px ${task.color}80`,
      }}
    >
      <div className="card-overlay" />
      <div className="card-gradient" />
      <div className="card-actions">
        <button type="button" className="card-btn card-btn-edit" onClick={() => onEdit(task)} title="Edit">
          <Pencil size={16} />
        </button>
        <button type="button" className="card-btn card-btn-delete" onClick={() => onDelete(task.id)} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="card-content">
        <div className="icon-container">
          <div className="icon-wrapper">
            <Icon className="activity-icon" style={{ color: task.color }} />
            <div className="icon-ping" />
          </div>
        </div>
        <h3 className="activity-label">{task.label}</h3>
        {folder && (
          <div className="task-folder-label" style={{ color: folder.color }}>
            {folder.icon} {folder.name}
          </div>
        )}
        <div className="time-display">
          <div className="time-value" style={{ color: task.color }}>{formatTime(timeElapsed)}</div>
          <div className="time-suffix">since then</div>
        </div>
        <div className="card-bottom-line" style={{ background: `linear-gradient(to right, transparent, ${task.color}60, transparent)` }} />
      </div>
    </div>
  );
};

export default TaskCard;
