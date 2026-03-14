import React from 'react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import { ICON_OPTIONS } from '../../constants/taskOptions';
import { formatTimeAgo } from '../../utils/formatTime';

/** Format a date for "last reset" tooltip */
const formatLastReset = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  if (diffMs < 60000) return 'Last reset: just now';
  if (diffMs < 3600000) return `Last reset: ${Math.floor(diffMs / 60000)}m ago`;
  if (diffMs < 86400000) return `Last reset: ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return `Last reset: ${d.toLocaleDateString()}`;
};

const TaskCard = ({ task, elapsed, onEdit, onDelete, onReset, folder }) => {
  const { Icon } = ICON_OPTIONS[task.iconIndex ?? 0] || ICON_OPTIONS[0];
  const timeElapsed = elapsed[task.id];
  const resetCount = task.resetCount ?? 0;
  const resetHistory = task.resetHistory ?? [];
  const badgeTitle = resetHistory.length > 0
    ? `${formatLastReset(resetHistory[0])} • Reset ${resetCount} time${resetCount !== 1 ? 's' : ''}`
    : `Reset ${resetCount} time${resetCount !== 1 ? 's' : ''}`;

  return (
    <article
      className="card"
      style={{
        '--card-accent': task.color,
        background: `linear-gradient(135deg, ${task.color}18 0%, ${task.color}08 50%, transparent 100%)`,
        boxShadow: `0 0 40px -12px ${task.color}50`,
      }}
    >
      <div className="card-overlay" />
      <div className="card-gradient" />
      <div className="card-actions">
        <button
          type="button"
          className="card-btn card-btn-edit"
          onClick={() => onEdit(task)}
          title="Edit"
          aria-label="Edit task"
        >
          <Pencil size={16} aria-hidden />
        </button>
        <button
          type="button"
          className="card-btn card-btn-delete"
          onClick={() => onDelete(task.id)}
          title="Delete"
          aria-label="Delete task"
        >
          <Trash2 size={16} aria-hidden />
        </button>
      </div>
      <div className="card-content">
        <div className="icon-container">
          <div className="icon-wrapper">
            <Icon className="activity-icon" style={{ color: task.color }} aria-hidden />
            <div className="icon-ping" aria-hidden="true" />
          </div>
        </div>
        <h3 className="activity-label">{task.label}</h3>
        {folder && (
          <div className="task-folder-label" style={{ color: folder.color }}>
            {folder.icon} {folder.name}
          </div>
        )}
        <div className="time-display">
          <div className="time-value" style={{ color: task.color }}>
            {formatTimeAgo(timeElapsed)}
          </div>
          <div className="time-suffix">since then</div>
        </div>
        <div className="card-meta">
          {resetCount > 0 && (
            <span className="card-reset-badge" title={badgeTitle}>
              Reset {resetCount} time{resetCount !== 1 ? 's' : ''}
            </span>
          )}
          <button
            type="button"
            className="card-btn-reset"
            onClick={() => onReset && onReset(task)}
            aria-label={`Reset "${task.label}" to now`}
          >
            <RotateCcw size={18} aria-hidden />
            <span>Reset</span>
          </button>
        </div>
        <div className="card-bottom-line" style={{ background: `linear-gradient(to right, transparent, ${task.color}50, transparent)` }} />
      </div>
    </article>
  );
};

export default TaskCard;
