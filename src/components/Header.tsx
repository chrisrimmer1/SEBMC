import { useState } from 'react';
import { Lock, Unlock, Eye, Edit3 } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  mode: 'view' | 'edit';
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
}

export function Header({ isAuthenticated, mode, onLogin, onLogout }: HeaderProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

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
          <h1>Social Enterprise Business Model Canvas</h1>

          <div className="mode-indicator">
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
