import React, { useState, useEffect } from 'react';
import { Skull, Plus, Calendar, Folder } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { dataService } from '../services/dataService';
import AuthModal from '../components/AuthModal';
import UserBadge from '../components/UserBadge';
import Layout from '../components/layout/Layout';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import FolderList from '../components/folders/FolderList';
import FolderModal from '../components/folders/FolderModal';
import { COLOR_OPTIONS, ICON_OPTIONS } from '../constants/taskOptions';
import { formatDateTimeLocal } from '../utils/formatTime';

const LastTimeSince = () => {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [elapsed, setElapsed] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migratedCount, setMigratedCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [formLabel, setFormLabel] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formColor, setFormColor] = useState(COLOR_OPTIONS[0]);
  const [formIconIndex, setFormIconIndex] = useState(0);
  const [formFolderId, setFormFolderId] = useState(null);
  const [formFolderName, setFormFolderName] = useState('');
  const [formFolderColor, setFormFolderColor] = useState('#6366f1');
  const [formFolderIcon, setFormFolderIcon] = useState('📁');
  const [formFolderDescription, setFormFolderDescription] = useState('');

  // sidebar visibility for mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
  const [showFolders, setShowFolders] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 640;
      setIsMobile(mobile);
      if (!mobile) setShowFolders(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (authLoading) return;
      setLoading(true);
      try {
        const loadedFolders = await dataService.getFolders();
        setFolders(loadedFolders);
        setSelectedFolder(loadedFolders[0]); // Default to "All"
        
        const loadedTasks = await dataService.getTasks(loadedFolders[0]?.id);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
    setFormFolderId(selectedFolder?.id === 'all' ? null : selectedFolder?.id);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditingId(task.id);
    setFormLabel(task.label);
    setFormDate(formatDateTimeLocal(task.date));
    setFormColor(task.color);
    setFormIconIndex(task.iconIndex ?? 0);
    setFormFolderId(task.folderId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const openAddFolder = () => {
    setEditingFolderId(null);
    setFormFolderName('');
    setFormFolderColor('#6366f1');
    setFormFolderIcon('📁');
    setFormFolderDescription('');
    setFolderModalOpen(true);
  };

  const openEditFolder = (folder) => {
    setEditingFolderId(folder.id);
    setFormFolderName(folder.name);
    setFormFolderColor(folder.color);
    setFormFolderIcon(folder.icon);
    setFormFolderDescription(folder.description || '');
    setFolderModalOpen(true);
  };

  const closeFolderModal = () => {
    setFolderModalOpen(false);
    setEditingFolderId(null);
  };

  const handleFolderSelect = async (folder) => {
    setSelectedFolder(folder);
    try {
      const loadedTasks = await dataService.getTasks(folder.id);
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks for folder:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const label = formLabel.trim();
    if (!label || !formDate) return;
    const date = new Date(formDate).toISOString();
    const color = formColor || COLOR_OPTIONS[0];
    const iconIndex = formIconIndex ?? 0;
    const folderId = formFolderId;

    try {
      if (editingId) {
        const updated = await dataService.updateTask(editingId, { label, date, color, iconIndex, folderId });
        setTasks((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const newTask = await dataService.addTask({ label, date, color, iconIndex, folderId });
        setTasks((prev) => [...prev, newTask]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    const name = formFolderName.trim();
    if (!name) return;

    try {
      if (editingFolderId) {
        const updated = await dataService.updateFolder(editingFolderId, {
          name,
          color: formFolderColor,
          icon: formFolderIcon,
          description: formFolderDescription,
        });
        setFolders((prev) => prev.map((f) => (f.id === editingFolderId ? updated : f)));
        if (selectedFolder?.id === editingFolderId) {
          setSelectedFolder(updated);
        }
      } else {
        const newFolder = await dataService.addFolder({
          name,
          color: formFolderColor,
          icon: formFolderIcon,
          description: formFolderDescription,
          isDefault: false,
        });
        setFolders((prev) => [...prev, newFolder]);
      }
      closeFolderModal();
    } catch (error) {
      console.error('Error saving folder:', error);
      alert('Failed to save folder. Please try again.');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    try {
      await dataService.deleteFolder(folderId);
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      // If deleted folder was selected, go to "All"
      if (selectedFolder?.id === folderId) {
        const allFolder = folders.find((f) => f.id === 'all');
        if (allFolder) {
          handleFolderSelect(allFolder);
        }
      }
    } catch (error) {
      console.error('Error deleting folder:', error);
      alert('Failed to delete folder. Please try again.');
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

        <div className="main-layout-with-folders">
          {isMobile && (
            <button
              type="button"
              className="btn btn-ghost folder-toggle"
              onClick={() => setShowFolders((v) => !v)}
            >
              <Folder size={18} />
              <span style={{ marginLeft: 6 }}>
                {showFolders ? 'Hide folders' : 'Show folders'}
              </span>
            </button>
          )}

          {(!isMobile || showFolders) && (
            <FolderList
              folders={folders}
              selectedFolder={selectedFolder}
              onSelectFolder={handleFolderSelect}
              onAddFolder={openAddFolder}
              onEditFolder={openEditFolder}
              onDeleteFolder={handleDeleteFolder}
            />
          )}

          <div className="content-wrapper">
          {selectedFolder && selectedFolder.id !== folders[0]?.id && (
            <div className="filter-header">
              <div className="filter-badge">
                <span className="filter-icon" style={{ color: selectedFolder.color }}>
                  {selectedFolder.icon || '📁'}
                </span>
                <div className="filter-info">
                  <span className="filter-label">Viewing Folder</span>
                  <span className="filter-name">{selectedFolder.name}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-clear-filter"
                onClick={() => handleFolderSelect(folders[0])}
              >
                View All
              </button>
            </div>
          )}

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
            <p className="header-sub">{selectedFolder?.id === folders[0]?.id ? 'Track anything. Add and edit your own.' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} in this folder`}</p>
          </div>

          <div className="actions-bar">
            <button type="button" className="btn-add" onClick={openAdd}>
              <Plus className="btn-add-icon" />
              <span>Add task</span>
              <Calendar className="btn-add-cal" />
            </button>
          </div>

          <div className="cards-grid">
            {tasks.map((task) => {
              const taskFolder = folders.find((f) => f.id === task.folderId) || null;
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  elapsed={elapsed}
                  folder={taskFolder}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              );
            })}
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
          folders={folders}
          formFolderId={formFolderId}
          setFormFolderId={setFormFolderId}
        />

        <FolderModal
          isOpen={folderModalOpen}
          onClose={closeFolderModal}
          onSubmit={handleFolderSubmit}
          editingFolder={editingFolderId}
          formName={formFolderName}
          setFormName={setFormFolderName}
          formColor={formFolderColor}
          setFormColor={setFormFolderColor}
          formIcon={formFolderIcon}
          setFormIcon={setFormFolderIcon}
          formDescription={formFolderDescription}
          setFormDescription={setFormFolderDescription}
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
