import React from 'react';
import { Folder, Plus, ChevronRight, Edit2, Trash2 } from 'lucide-react';

const FolderList = ({
  folders,
  selectedFolder,
  folderTaskCounts = {},
  onSelectFolder,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
}) => {
  const getCount = (folder) => {
    if (folder.id === 'all') return folderTaskCounts.all ?? 0;
    return folderTaskCounts[folder.id] ?? 0;
  };

  return (
    <div className="folder-sidebar">
      <div className="folder-add-row">
        <button
          type="button"
          className="folder-add-btn"
          onClick={onAddFolder}
          title="Create new folder"
        >
          <Plus size={20} aria-hidden />
          <span className="btn-label">New</span>
        </button>
      </div>

      <div className="folder-list">
        {folders.map((folder, index) => {
          const isAll = folder.id === 'all';
          const count = getCount(folder);
          return (
            <div
              key={folder.id}
              role="button"
              tabIndex={0}
              className={`folder-item ${selectedFolder?.id === folder.id ? 'active' : ''} ${isAll ? 'folder-item-primary' : ''}`}
              onClick={() => onSelectFolder(folder)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectFolder(folder);
                }
              }}
            >
              <div className="folder-item-left">
                <div className="folder-item-icon" style={{ backgroundColor: folder.color }}>
                  {folder.icon ? <span>{folder.icon}</span> : <Folder size={18} aria-hidden />}
                </div>
                <div className="folder-item-info">
                  <p className="folder-item-name">{folder.name}</p>
                  {folder.description && (
                    <p className="folder-item-description">{folder.description}</p>
                  )}
                </div>
              </div>
              <div className="folder-item-right">
                <span className="folder-item-count-badge" aria-label={`${count} tasks`}>
                  {count}
                </span>
                {!folder.isDefault && (
                  <div className="folder-item-actions">
                    <button
                      type="button"
                      className="folder-action-btn folder-edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditFolder(folder);
                      }}
                      title="Edit folder"
                    >
                      <Edit2 size={14} aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="folder-action-btn folder-action-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete folder "${folder.name}"? Tasks will be moved to All.`)) {
                          onDeleteFolder(folder.id);
                        }
                      }}
                      title="Delete folder"
                    >
                      <Trash2 size={14} aria-hidden />
                    </button>
                  </div>
                )}
                <ChevronRight size={18} className="folder-item-chevron" aria-hidden />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FolderList;
