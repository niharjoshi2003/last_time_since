import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Timer, Plus, Sparkles, Users, RotateCcw } from 'lucide-react';
import { dataService, DEFAULT_PERSON } from '../services/dataService';
import Layout from '../components/layout/Layout';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../constants/taskOptions';
import { formatDateTimeLocal } from '../utils/formatTime';

const TOAST_MS = 3200;
const ALL_PEOPLE_FILTER = '__all__';

const normalizePerson = (value) => {
  if (typeof value !== 'string') return DEFAULT_PERSON;
  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized || DEFAULT_PERSON;
};

const sortPeople = (a, b) => {
  if (a === DEFAULT_PERSON && b !== DEFAULT_PERSON) return 1;
  if (b === DEFAULT_PERSON && a !== DEFAULT_PERSON) return -1;
  return a.localeCompare(b);
};

const LastTimeSince = () => {
  const [tasks, setTasks] = useState([]);
  const [elapsed, setElapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingResetCount, setEditingResetCount] = useState(0);
  const [activePerson, setActivePerson] = useState(ALL_PEOPLE_FILTER);
  const [formPerson, setFormPerson] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
  const [formIconIndex, setFormIconIndex] = useState(0);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, TOAST_MS);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingId(null);
  }, []);

  useEffect(() => {
    setLoading(true);
    try {
      setTasks(dataService.getTasks());
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newElapsed = {};
      tasks.forEach((task) => {
        const ts = new Date(task.date).getTime();
        if (ts) newElapsed[task.id] = Date.now() - ts;
      });
      setElapsed(newElapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  useEffect(() => {
    if (!modalOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, closeModal]);

  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
  }, []);

  const people = useMemo(() => {
    const unique = Array.from(new Set(tasks.map((task) => normalizePerson(task.person))));
    return unique.sort(sortPeople);
  }, [tasks]);

  useEffect(() => {
    if (activePerson !== ALL_PEOPLE_FILTER && !people.includes(activePerson)) {
      setActivePerson(ALL_PEOPLE_FILTER);
    }
  }, [activePerson, people]);

  const countByPerson = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      const person = normalizePerson(task.person);
      map[person] = (map[person] || 0) + 1;
    });
    return map;
  }, [tasks]);

  const groupedTasks = useMemo(() => {
    const scoped = activePerson === ALL_PEOPLE_FILTER
      ? tasks
      : tasks.filter((task) => normalizePerson(task.person) === activePerson);

    const map = {};
    scoped.forEach((task) => {
      const person = normalizePerson(task.person);
      if (!map[person]) map[person] = [];
      map[person].push(task);
    });

    return Object.entries(map)
      .map(([person, personTasks]) => ({
        person,
        tasks: [...personTasks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      }))
      .sort((a, b) => sortPeople(a.person, b.person));
  }, [tasks, activePerson]);

  const visibleTaskCount = useMemo(
    () => groupedTasks.reduce((acc, group) => acc + group.tasks.length, 0),
    [groupedTasks],
  );

  const totalResets = useMemo(
    () => tasks.reduce((acc, task) => acc + (task.resetCount || 0), 0),
    [tasks],
  );

  const topPerson = useMemo(() => {
    if (!people.length) return '—';
    return [...people].sort((a, b) => (countByPerson[b] || 0) - (countByPerson[a] || 0))[0] || '—';
  }, [people, countByPerson]);

  const openAdd = useCallback((preferredPerson = '') => {
    setEditingId(null);
    setEditingResetCount(0);
    setFormPerson(preferredPerson || (activePerson !== ALL_PEOPLE_FILTER ? activePerson : ''));
    setFormLabel('');
    const now = new Date();
    now.setSeconds(0, 0);
    setFormDate(formatDateTimeLocal(now.toISOString()));
    setFormColor(COLOR_OPTIONS[tasks.length % COLOR_OPTIONS.length]);
    setFormIconIndex(tasks.length % ICON_OPTIONS.length);
    setModalOpen(true);
  }, [activePerson, tasks.length]);

  const openEdit = (task) => {
    setEditingId(task.id);
    setEditingResetCount(task.resetCount ?? 0);
    setFormPerson(normalizePerson(task.person));
    setFormLabel(task.label);
    setFormDate(formatDateTimeLocal(task.date));
    setFormColor(task.color);
    setFormIconIndex(task.iconIndex ?? 0);
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const person = normalizePerson(formPerson);
    const label = formLabel.trim();
    if (!label || !formDate) return;
    const date = new Date(formDate).toISOString();
    const color = formColor || COLOR_OPTIONS[0];
    const iconIndex = formIconIndex ?? 0;

    try {
      if (editingId) {
        const updated = dataService.updateTask(editingId, { person, label, date, color, iconIndex });
        setTasks((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
        showToast('Task saved.');
      } else {
        const newTask = dataService.addTask({ person, label, date, color, iconIndex });
        setTasks((prev) => [...prev, newTask]);
        showToast(`Task added for ${newTask.person}.`);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleDelete = (id) => {
    const task = tasks.find((t) => t.id === id);
    const name = task?.label ?? 'this task';
    if (window.confirm(`Delete “${name}”?`)) {
      try {
        dataService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast('Task deleted.');
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleReset = (id) => {
    try {
      const updated = dataService.resetTask(id);
      if (!updated) return;
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      showToast(`Task reset to now. Resets: ${updated.resetCount}`);
    } catch (error) {
      console.error('Error resetting task:', error);
      alert('Failed to reset task. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="lts-page lts-page--loading">
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p>Loading…</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="lts-page">
        <div className="lts-bg" aria-hidden>
          <div className="lts-orb lts-orb--one" />
          <div className="lts-orb lts-orb--two" />
          <div className="lts-orb lts-orb--three" />
        </div>

        <header className="lts-hero lts-glass">
          <div className="lts-hero__top">
            <div className="lts-hero__icon" aria-hidden>
              <Timer size={40} strokeWidth={1.75} />
            </div>
            <button type="button" className="lts-btn-secondary lts-toolbar__btn lts-toolbar__btn-desktop" onClick={() => openAdd()}>
              <Plus size={20} aria-hidden />
              <span>Add task</span>
            </button>
          </div>
          <p className="lts-hero__eyebrow">for hearts that remember</p>
          <h1 className="lts-hero__title">
            Last Time <span>Since</span>
          </h1>
          <p className="lts-hero__sub">
            Know exactly how long it has been - texts, calls, meetings, and everything in between.
          </p>
          <p className="lts-privacy-note">
            Private by default. Stored only on your device.
          </p>
          <div className="lts-stats">
            <article className="lts-stat">
              <span className="lts-stat__label">People</span>
              <strong className="lts-stat__value"><Users size={14} aria-hidden />{people.length}</strong>
            </article>
            <article className="lts-stat">
              <span className="lts-stat__label">Visible tasks</span>
              <strong className="lts-stat__value"><Sparkles size={14} aria-hidden />{visibleTaskCount}</strong>
            </article>
            <article className="lts-stat">
              <span className="lts-stat__label">Total resets</span>
              <strong className="lts-stat__value"><RotateCcw size={14} aria-hidden />{totalResets}</strong>
            </article>
            <article className="lts-stat">
              <span className="lts-stat__label">Most tracked</span>
              <strong className="lts-stat__value">{topPerson}</strong>
            </article>
          </div>
        </header>

        <div className="lts-toolbar">
          <button type="button" className="lts-btn-secondary lts-toolbar__btn" onClick={() => openAdd()}>
            <Plus size={20} aria-hidden />
            <span>Add task</span>
          </button>
        </div>

        <section className="lts-people-shell" aria-label="Filter by person">
          <div className="lts-people-scroll">
            <button
              type="button"
              className={`lts-person-chip ${activePerson === ALL_PEOPLE_FILTER ? 'active' : ''}`}
              onClick={() => setActivePerson(ALL_PEOPLE_FILTER)}
              aria-pressed={activePerson === ALL_PEOPLE_FILTER}
            >
              All
              <span>{tasks.length}</span>
            </button>
            {people.map((person) => (
              <button
                key={person}
                type="button"
                className={`lts-person-chip ${activePerson === person ? 'active' : ''}`}
                onClick={() => setActivePerson(person)}
                aria-pressed={activePerson === person}
              >
                {person}
                <span>{countByPerson[person] || 0}</span>
              </button>
            ))}
          </div>
        </section>

        {tasks.length === 0 || visibleTaskCount === 0 ? (
          <div className="lts-empty-panel">
            <p className="lts-empty">
              {tasks.length === 0
                ? 'No tasks yet. Create your first tracker.'
                : 'No tasks for this person yet. Create one now.'}
            </p>
            <button
              type="button"
              className="lts-btn-secondary lts-empty-panel__btn"
              onClick={() => openAdd(activePerson !== ALL_PEOPLE_FILTER ? activePerson : '')}
            >
              <Plus size={20} aria-hidden />
              <span>New tracker</span>
            </button>
          </div>
        ) : (
          <div className="lts-groups">
            {groupedTasks.map((group) => (
              <section key={group.person} className="lts-group-card">
                <header className="lts-group-card__header">
                  <div className="lts-group-person">
                    <div className="lts-group-avatar" aria-hidden>{group.person.slice(0, 1).toUpperCase()}</div>
                    <div className="lts-group-copy">
                      <h2>{group.person}</h2>
                      <p>{group.tasks.length} tracker{group.tasks.length === 1 ? '' : 's'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="lts-group-add"
                    onClick={() => openAdd(group.person)}
                    aria-label={`Add task for ${group.person}`}
                  >
                    <Plus size={18} aria-hidden />
                  </button>
                </header>
                <div className="lts-grid">
                  {group.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      elapsed={elapsed}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onReset={handleReset}
                      showPerson={activePerson === ALL_PEOPLE_FILTER}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <button
          type="button"
          className="lts-fab"
          onClick={() => openAdd(activePerson !== ALL_PEOPLE_FILTER ? activePerson : '')}
          aria-label="Add task"
        >
          <Plus size={28} strokeWidth={2.25} aria-hidden />
        </button>

        {toast ? (
          <div className="lts-toast" role="status" aria-live="polite">
            {toast}
          </div>
        ) : null}

        <TaskModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          editingId={editingId}
          editingResetCount={editingResetCount}
          formPerson={formPerson}
          setFormPerson={setFormPerson}
          personOptions={people}
          formLabel={formLabel}
          setFormLabel={setFormLabel}
          formDate={formDate}
          setFormDate={setFormDate}
          formColor={formColor}
          setFormColor={setFormColor}
          formIconIndex={formIconIndex}
          setFormIconIndex={setFormIconIndex}
        />
      </div>
    </Layout>
  );
};

export default LastTimeSince;
