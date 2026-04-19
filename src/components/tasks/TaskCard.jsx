import React from 'react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import { ICON_OPTIONS } from '../../constants/taskOptions';
import { formatElapsedParts } from '../../utils/formatTime';

const TaskCard = ({ task, elapsed, onEdit, onDelete, onReset, showPerson = false }) => {
  const { Icon } = ICON_OPTIONS[task.iconIndex ?? 0] || ICON_OPTIONS[0];
  const timeElapsed = elapsed[task.id];
  const parts = formatElapsedParts(timeElapsed);
  const resets = task.resetCount ?? 0;

  return (
    <article
      className="task-card-v2"
      style={{ '--task-accent': task.color }}
    >
      <div className="task-card-v2__accent" aria-hidden />
      <div className="task-card-v2__top">
        <div className="task-card-v2__icon-wrap" aria-hidden>
          <Icon className="task-card-v2__icon" size={22} style={{ color: task.color }} />
        </div>
        <div className="task-card-v2__label-wrap">
          <h3 className="task-card-v2__label">{task.label}</h3>
          {showPerson ? <span className="task-card-v2__person-chip">{task.person}</span> : null}
        </div>
      </div>

      <div className="task-card-v2__elapsed" aria-live="polite">
        {parts ? (
          <div className="task-card-v2__elapsed-inner">
            {parts.map((p, i) => (
              <span key={`${p.u}-${i}`} className="task-card-v2__part">
                <span className="task-card-v2__num" style={{ color: task.color }}>
                  {p.n}
                </span>
                <span className="task-card-v2__unit">{p.u}</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="task-card-v2__dash">—</span>
        )}
        <span className="task-card-v2__suffix">since</span>
      </div>

      <div className="task-card-v2__meta">
        <span className="task-card-v2__resets">Reset: {resets}×</span>
      </div>

      <div className="task-card-v2__actions">
        <button
          type="button"
          className="task-card-v2__btn task-card-v2__btn--edit"
          onClick={() => onEdit(task)}
          aria-label={`Edit ${task.label}`}
        >
          <Pencil size={20} aria-hidden />
        </button>
        <button
          type="button"
          className="task-card-v2__btn task-card-v2__btn--reset"
          onClick={() => onReset(task.id)}
          aria-label={`Reset timer for ${task.label}`}
        >
          <RotateCcw size={20} aria-hidden />
        </button>
        <button
          type="button"
          className="task-card-v2__btn task-card-v2__btn--delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.label}`}
        >
          <Trash2 size={20} aria-hidden />
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
