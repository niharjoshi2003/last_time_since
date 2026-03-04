import React from 'react';
import { Folder, Plus, ChevronRight, Edit2, Trash2, Layers } from 'lucide-react';

const FolderList = ({ folders, selectedFolder, onSelectFolder, onAddFolder, onEditFolder, onDeleteFolder }) => {
  return (
    <div className="folder-sidebar">
      <div className="folder-sidebar-header">
        <div className="folder-sidebar-title-group">
          {/* <Layers size={20} className="sidebar-title-icon" /> */}
          <h3 className="folder-sidebar-title">Collections</h3>
          <span className="folder-count">{folders.length - 1}</span>
        </div>
        <button
          type="button"
          className="folder-add-btn"
          onClick={onAddFolder}
          title="Create new folder"
        >
          <Plus size={20} />
          <span className="btn-label">New</span>
        </button>
      </div>

      <div className="folder-list">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`folder-item ${selectedFolder?.id === folder.id ? 'active' : ''}`}
            onClick={() => onSelectFolder(folder)}
          >
            <div className="folder-item-left">
              <div className="folder-item-icon" style={{ backgroundColor: folder.color }}>
                {folder.icon ? <span>{folder.icon}</span> : <Folder size={18} />}
              </div>
              <div className="folder-item-info">
                <p className="folder-item-name">{folder.name}</p>
                {folder.description && (
                  <p className="folder-item-description">{folder.description}</p>
                )}
              </div>
            </div>
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
                  <Edit2 size={14} />
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
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            {selectedFolder?.id === folder.id && (
              <ChevronRight size={18} className="folder-item-indicator" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FolderList;
