import React, { useState, useEffect } from 'react';
import { Skull, Plus, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { dataService } from '../services/dataService';
import AuthModal from '../components/AuthModal';
import UserBadge from '../components/UserBadge';
import Layout from '../components/layout/Layout';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../constants/taskOptions';
import { formatDateTimeLocal } from '../utils/formatTime';

const LastTimeSince = () => {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [elapsed, setElapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migratedCount, setMigratedCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [formLabel, setFormLabel] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
  const [formIconIndex, setFormIconIndex] = useState(0);

  useEffect(() => {
    async function loadTasks() {
      if (authLoading) return;
      setLoading(true);
      try {
        const loadedTasks = await dataService.getTasks();
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, [user, authLoading]);

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

  const openAdd = () => {
    setEditingId(null);
    setFormLabel('');
    const now = new Date();
    now.setSeconds(0, 0);
    setFormDate(formatDateTimeLocal(now.toISOString()));
    setFormColor(COLOR_OPTIONS[tasks.length % COLOR_OPTIONS.length]);
    setFormIconIndex(tasks.length % ICON_OPTIONS.length);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingId(task.id);
    setFormLabel(task.label);
    setFormDate(formatDateTimeLocal(task.date));
    setFormColor(task.color);
    setFormIconIndex(task.iconIndex ?? 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const label = formLabel.trim();
    if (!label || !formDate) return;
    const date = new Date(formDate).toISOString();
    const color = formColor || COLOR_OPTIONS[0];
    const iconIndex = formIconIndex ?? 0;

    try {
      if (editingId) {
        const updated = await dataService.updateTask(editingId, { label, date, color, iconIndex });
        setTasks((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const newTask = await dataService.addTask({ label, date, color, iconIndex });
        setTasks((prev) => [...prev, newTask]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await dataService.deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  const handleSignUp = async (email, password) => {
    const { user: newUser, error } = await signUp(email, password);
    if (newUser && !error) {
      setMigrating(true);
      try {
        const result = await dataService.migrateLocalToCloud(newUser.id);
        if (result.success) {
          setMigratedCount(result.migrated || 0);
          const loadedTasks = await dataService.getTasks();
          setTasks(loadedTasks);
          setTimeout(() => {
            setMigrating(false);
            setAuthModalOpen(false);
            setMigratedCount(0);
          }, 2000);
        } else {
          setMigrating(false);
          return { error: result.error || 'Migration failed' };
        }
      } catch (error) {
        setMigrating(false);
        return { error: error.message || 'Migration failed' };
      }
    }
    return { error };
  };

  const handleSignIn = async (email, password) => {
    const { error } = await signIn(email, password);
    if (!error) {
      const loadedTasks = await dataService.getTasks();
      setTasks(loadedTasks);
    }
    return { error };
  };

  const handleSignOut = async () => {
    await signOut();
    const loadedTasks = await dataService.getTasks();
    setTasks(loadedTasks);
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="app-container">
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="app-container">
        <div className="background-vignette" />
        <div className="animated-blobs">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
        </div>
        <div className="grain-overlay" />

        {!user && (
          <div className="guest-banner">
            {/* <div className="guest-banner-content">
              <span className="guest-banner-icon">📱</span>
              <span className="guest-banner-text">Using in Guest Mode - Data saved on this device only</span>
            </div> */}
          </div>
        )}

        <div className="user-badge-container">
          <UserBadge user={user} onSignOut={handleSignOut} onOpenAuth={() => setAuthModalOpen(true)} />
        </div>

        <div className="content-wrapper">
          <div className="skull-container">
            <div className="skull-wrapper">
              <Skull className="skull-icon" aria-hidden="false" />
              <div className="skull-ping" aria-hidden="true" />
            </div>
          </div>

          <div className="header">
            <h1 className="title">
              <div className="title-line-1">LAST TIME</div>
              <div className="title-line-2">SINCE</div>
            </h1>
            <div className="divider-container">
              <div className="divider" />
            </div>
            <p className="header-sub">Track anything. Add and edit your own.</p>
          </div>

          <div className="actions-bar">
            <button type="button" className="btn-add" onClick={openAdd}>
              <Plus className="btn-add-icon" />
              <span>Add task</span>
              <Calendar className="btn-add-cal" />
            </button>
          </div>

          <div className="cards-grid">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} elapsed={elapsed} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>

          <div className="footer page-hero-footer">
            <div className="neon-container">
              <div className="neon-flicker">
                <span className="neon-text">LAST</span>
                <span className="neon-text neon-delay">TIME</span>
              </div>
              <div className="neon-glow-bg" />
            </div>
          </div>
        </div>

        <div className="corner-accent corner-top-right" />
        <div className="corner-accent corner-bottom-left" />

        <TaskModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          editingId={editingId}
          formLabel={formLabel}
          setFormLabel={setFormLabel}
          formDate={formDate}
          setFormDate={setFormDate}
          formColor={formColor}
          setFormColor={setFormColor}
          formIconIndex={formIconIndex}
          setFormIconIndex={setFormIconIndex}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => {
            setAuthModalOpen(false);
            setMigrating(false);
            setMigratedCount(0);
          }}
          onSignUp={handleSignUp}
          onSignIn={handleSignIn}
          onContinueAsGuest={() => {}}
          migrating={migrating}
          migratedCount={migratedCount}
        />
      </div>
    </Layout>
  );
};

export default LastTimeSince;
