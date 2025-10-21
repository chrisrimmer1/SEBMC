import { useState } from 'react';
import { Lock, Unlock, Eye, Edit3, FileDown } from 'lucide-react';
import { themes, getThemeConfig, type ThemeName } from '../utils/themes';

interface HeaderProps {
  isAuthenticated: boolean;
  mode: 'view' | 'edit';
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
  theme: ThemeName;
  onSetTheme: (theme: ThemeName) => void;
  onExportPDF: () => void;
  headerTitle?: string;
  editingHeaderTitle: boolean;
  tempHeaderTitle: string;
  onHeaderTitleClick?: () => void;
  onHeaderTitleChange: (value: string) => void;
  onHeaderTitleSave: () => void;
  onHeaderTitleCancel: () => void;
}

export function Header({ isAuthenticated, onLogin, onLogout, theme, onSetTheme, onExportPDF, headerTitle, editingHeaderTitle, tempHeaderTitle, onHeaderTitleClick, onHeaderTitleChange, onHeaderTitleSave, onHeaderTitleCancel }: HeaderProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const currentTheme = getThemeConfig(theme);

  const handleLogin = async () => {
    const success = await onLogin(password);
    if (success) {
      setShowPasswordModal(false);
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    } else if (e.key === 'Escape') {
      setShowPasswordModal(false);
      setPassword('');
      setError(false);
    }
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="btn btn-icon pdf-export"
              onClick={onExportPDF}
              title="Export canvas to PDF"
            >
              <FileDown size={16} />
            </button>

            <div className="theme-selector">
              <button
                className="btn btn-icon theme-toggle"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Change theme"
              >
                <span className="theme-name">{currentTheme.icon} {currentTheme.name}</span>
              </button>

              {showThemeMenu && (
                <div className="theme-dropdown">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      className={`theme-option ${t.id === theme ? 'active' : ''}`}
                      onClick={() => {
                        onSetTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                    >
                      <span className="theme-icon">{t.icon}</span>
                      <span className="theme-label">{t.name}</span>
                      {t.id === theme && <span className="checkmark">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="header-center">
            {editingHeaderTitle ? (
              <input
                type="text"
                className="header-title-edit"
                value={tempHeaderTitle}
                onChange={(e) => onHeaderTitleChange(e.target.value)}
                onBlur={onHeaderTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onHeaderTitleSave();
                  if (e.key === 'Escape') onHeaderTitleCancel();
                }}
                autoFocus
              />
            ) : (
              <h1
                className={isAuthenticated ? 'editable-header-title' : ''}
                onClick={isAuthenticated ? onHeaderTitleClick : undefined}
                title={isAuthenticated ? 'Click to edit header title' : ''}
              >
                {headerTitle || 'Social Enterprise Business Model Canvas'}
              </h1>
            )}
          </div>

          <div className="header-right">
            {isAuthenticated ? (
              <>
                <div className="edit-mode-badge">
                  <Edit3 size={16} /> Edit Mode Enabled
                </div>
                <button className="btn btn-small" onClick={onLogout}>
                  <Lock size={16} /> Lock
                </button>
              </>
            ) : (
              <>
                <div className="view-mode-badge">
                  <Eye size={16} /> View Only Mode
                </div>
                <button className="btn btn-small" onClick={() => setShowPasswordModal(true)}>
                  <Unlock size={16} /> Unlock
                </button>
              </>
            )}

            {/* Theme selector for mobile - only visible on small screens */}
            <div className="theme-selector theme-selector-mobile">
              <button
                className="btn btn-icon theme-toggle"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                title="Change theme"
              >
                <span className="theme-icon-mobile">{currentTheme.icon}</span>
                <span className="theme-name">{currentTheme.name}</span>
              </button>

              {showThemeMenu && (
                <div className="theme-dropdown">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      className={`theme-option ${t.id === theme ? 'active' : ''}`}
                      onClick={() => {
                        onSetTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                    >
                      <span className="theme-icon">{t.icon}</span>
                      <span className="theme-label">{t.name}</span>
                      {t.id === theme && <span className="checkmark">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal password-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enter Password</h2>
              <button className="close-btn" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter password to unlock edit mode"
                  autoFocus
                />
                {error && (
                  <p className="error-message">Incorrect password. Please try again.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleLogin}>
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
