import { useState, useRef } from 'react';
import { Download, Upload, Trash2, Menu, X, Clock } from 'lucide-react';

interface SidebarProps {
  isEditMode: boolean;
  lastSaved: Date | null;
  onExport: () => void;
  onImport: (file: File) => void;
  onClear: () => void;
}

export function Sidebar({ isEditMode, lastSaved, onExport, onImport, onClear }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      {isEditMode && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${!isEditMode ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <h3>Tools</h3>
        </div>

        <div className="sidebar-content">
          {lastSaved && (
            <div className="last-saved">
              <Clock size={14} />
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}

          <div className="sidebar-section">
            <h4>Data Management</h4>

            <button className="sidebar-btn" onClick={onExport}>
              <Download size={16} />
              Export Backup
            </button>

            <button className="sidebar-btn" onClick={handleImportClick}>
              <Upload size={16} />
              Import Backup
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            <button className="sidebar-btn danger" onClick={onClear}>
              <Trash2 size={16} />
              Clear All Data
            </button>
          </div>

          <div className="sidebar-section">
            <h4>Keyboard Shortcuts</h4>
            <div className="shortcuts">
              <div className="shortcut">
                <kbd>Ctrl + S</kbd>
                <span>Save (auto-saves)</span>
              </div>
              <div className="shortcut">
                <kbd>Esc</kbd>
                <span>Close modals</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
