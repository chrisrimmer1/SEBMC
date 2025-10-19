import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasSection } from './components/CanvasSection';
import { EditModal } from './components/EditModal';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';
import { useCanvasDataDB as useCanvasData } from './hooks/useCanvasDataDB'; // Changed to database version
import type { ContentItem, SectionId } from './types';
import { parseMarkdown } from './utils/markdown';
import { exportToPDF } from './utils/exportPDF';
import './App.css';

function App() {
  const { isAuthenticated, mode, login, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    canvasData,
    lastSaved,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    updateSubtitle,
    updateCanvasTitle,
    updateCanvasSubtitle,
    exportData,
    importData,
    clearData
  } = useCanvasData();

  const [editingItem, setEditingItem] = useState<{ sectionId: SectionId; item: ContentItem } | null>(null);
  const [editingCanvasTitle, setEditingCanvasTitle] = useState(false);
  const [editingCanvasSubtitle, setEditingCanvasSubtitle] = useState(false);
  const [tempCanvasTitle, setTempCanvasTitle] = useState('');
  const [tempCanvasSubtitle, setTempCanvasSubtitle] = useState('');

  const handleEditItem = (sectionId: SectionId, item: ContentItem) => {
    setEditingItem({ sectionId, item });
  };

  const handleSaveEdit = (updates: Partial<ContentItem>) => {
    if (editingItem) {
      updateItem(editingItem.sectionId, editingItem.item.id, updates);
      setEditingItem(null);
    }
  };

  const handleCanvasTitleClick = () => {
    if (isAuthenticated) {
      setTempCanvasTitle(canvasData.canvasTitle || 'Social Enterprise Business Model Canvas');
      setEditingCanvasTitle(true);
    }
  };

  const handleCanvasSubtitleClick = () => {
    if (isAuthenticated) {
      setTempCanvasSubtitle(canvasData.canvasSubtitle || 'Plan your social impact venture');
      setEditingCanvasSubtitle(true);
    }
  };

  const handleSaveCanvasTitle = () => {
    updateCanvasTitle(tempCanvasTitle);
    setEditingCanvasTitle(false);
  };

  const handleSaveCanvasSubtitle = () => {
    updateCanvasSubtitle(tempCanvasSubtitle);
    setEditingCanvasSubtitle(false);
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(canvasData);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const sections = canvasData.sections;

  return (
    <div className="app">
      <Header
        isAuthenticated={isAuthenticated}
        mode={mode}
        onLogin={login}
        onLogout={logout}
        theme={theme}
        onToggleTheme={toggleTheme}
        onExportPDF={handleExportPDF}
      />

      <Sidebar
        isEditMode={isAuthenticated}
        lastSaved={lastSaved}
        onExport={exportData}
        onImport={importData}
        onClear={clearData}
      />

      <main className="main-content">
        <div className="canvas-header">
          {editingCanvasTitle ? (
            <input
              type="text"
              className="canvas-title-edit"
              value={tempCanvasTitle}
              onChange={(e) => setTempCanvasTitle(e.target.value)}
              onBlur={handleSaveCanvasTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCanvasTitle();
                if (e.key === 'Escape') setEditingCanvasTitle(false);
              }}
              autoFocus
            />
          ) : (
            <h2
              className={isAuthenticated ? 'editable-canvas-heading' : ''}
              onClick={handleCanvasTitleClick}
              title={isAuthenticated ? 'Click to edit title' : ''}
            >
              {canvasData.canvasTitle || 'Social Enterprise Business Model Canvas'}
            </h2>
          )}

          {editingCanvasSubtitle ? (
            <textarea
              className="canvas-subtitle-edit"
              value={tempCanvasSubtitle}
              onChange={(e) => setTempCanvasSubtitle(e.target.value)}
              onBlur={handleSaveCanvasSubtitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSaveCanvasSubtitle();
                } else if (e.key === 'Escape') {
                  setEditingCanvasSubtitle(false);
                }
              }}
              rows={3}
              autoFocus
              placeholder="Use **bold** or *italic* for formatting. Press Ctrl+Enter to save, Esc to cancel."
            />
          ) : (
            <p
              className={`canvas-subtitle ${isAuthenticated ? 'editable-canvas-heading' : ''}`}
              onClick={handleCanvasSubtitleClick}
              title={isAuthenticated ? 'Click to edit subtitle' : ''}
            >
              {parseMarkdown(canvasData.canvasSubtitle || 'Plan your social impact venture')}
            </p>
          )}
        </div>

        <div className="business-model-canvas">
          {/* Column 1: Social Problem (top) + Network Partners (bottom) */}
          <CanvasSection
            section={sections['social-problem']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('social-problem', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Column 2: Service Portfolio (tall) */}
          <CanvasSection
            section={sections['service-portfolio']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('service-portfolio', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Column 3: Core Value (tall) */}
          <CanvasSection
            section={sections['core-value']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('core-value', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Column 4: Beneficiaries (top) */}
          <CanvasSection
            section={sections['beneficiaries']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('beneficiaries', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Column 5: Impact (tall) */}
          <CanvasSection
            section={sections['impact']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('impact', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Column 1 bottom: Network Partners */}
          <CanvasSection
            section={sections['network-partners']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('network-partners', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Column 4 bottom: Channels */}
          <CanvasSection
            section={sections['channels']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('channels', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Bottom row: Costs */}
          <CanvasSection
            section={sections['costs']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('costs', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />

          {/* Bottom row: Revenue Stream */}
          <CanvasSection
            section={sections['revenue-stream']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('revenue-stream', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
            onUpdateSubtitle={updateSubtitle}
          />
        </div>

        <footer className="app-footer">
          <p>
            Based on the Social Enterprise Business Model Canvas by{' '}
            <a
              href="https://hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas/"
              target="_blank"
              rel="noopener noreferrer"
            >
              HotCubator
            </a>
            , adapted from the original Business Model Canvas by Alexander Osterwalder.
          </p>
        </footer>
      </main>

      <EditModal
        item={editingItem?.item || null}
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default App;
