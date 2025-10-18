import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasSection } from './components/CanvasSection';
import { EditModal } from './components/EditModal';
import { useAuth } from './hooks/useAuth';
import { useCanvasDataDB as useCanvasData } from './hooks/useCanvasDataDB'; // Changed to database version
import type { ContentItem, SectionId } from './types';
import './App.css';

function App() {
  const { isAuthenticated, mode, login, logout } = useAuth();
  const {
    canvasData,
    lastSaved,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    exportData,
    importData,
    clearData
  } = useCanvasData();

  const [editingItem, setEditingItem] = useState<{ sectionId: SectionId; item: ContentItem } | null>(null);

  const handleEditItem = (sectionId: SectionId, item: ContentItem) => {
    setEditingItem({ sectionId, item });
  };

  const handleSaveEdit = (updates: Partial<ContentItem>) => {
    if (editingItem) {
      updateItem(editingItem.sectionId, editingItem.item.id, updates);
      setEditingItem(null);
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
          <h2>Social Enterprise Business Model Canvas</h2>
          <p className="canvas-subtitle">Plan your social impact venture</p>
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
          />

          {/* Column 2: Service Portfolio (tall) */}
          <CanvasSection
            section={sections['service-portfolio']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('service-portfolio', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />

          {/* Column 3: Core Value (tall) */}
          <CanvasSection
            section={sections['core-value']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('core-value', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />

          {/* Column 4: Beneficiaries (top) */}
          <CanvasSection
            section={sections['beneficiaries']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('beneficiaries', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />

          {/* Column 5: Impact (tall) */}
          <CanvasSection
            section={sections['impact']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('impact', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />

          {/* Column 1 bottom: Network Partners */}
          <CanvasSection
            section={sections['network-partners']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('network-partners', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />

          {/* Column 4 bottom: Channels */}
          <CanvasSection
            section={sections['channels']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('channels', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />

          {/* Bottom row: Costs */}
          <CanvasSection
            section={sections['costs']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('costs', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />

          {/* Bottom row: Revenue Stream */}
          <CanvasSection
            section={sections['revenue-stream']}
            isEditMode={isAuthenticated}
            onAddItem={addItem}
            onEditItem={(item) => handleEditItem('revenue-stream', item)}
            onDeleteItem={deleteItem}
            onReorderItems={reorderItems}
          />
        </div>

        <footer className="app-footer">
          <p>Re-created with React + TypeScript based on original SEBMC by HotCubator</p>
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
