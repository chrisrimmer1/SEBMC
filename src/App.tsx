import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasSection } from './components/CanvasSection';
import { EditModal } from './components/EditModal';
import { useAuth } from './hooks/useAuth';
import { useCanvasData } from './hooks/useCanvasData';
import { ContentItem, SectionId } from './types';
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
          {/* Row 1: Social problem, Service portfolio, Core value, Beneficiaries, Impact */}
          <div className="canvas-row row-1">
            <CanvasSection
              section={sections['social-problem']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('social-problem', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
            <CanvasSection
              section={sections['service-portfolio']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('service-portfolio', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
            <CanvasSection
              section={sections['core-value']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('core-value', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
            <CanvasSection
              section={sections['beneficiaries']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('beneficiaries', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
            <CanvasSection
              section={sections['impact']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('impact', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
          </div>

          {/* Row 2: Network partners and Channels */}
          <div className="canvas-row row-2">
            <CanvasSection
              section={sections['network-partners']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('network-partners', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
            <CanvasSection
              section={sections['channels']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('channels', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
          </div>

          {/* Row 3: Costs and Revenue stream */}
          <div className="canvas-row row-3">
            <CanvasSection
              section={sections['costs']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('costs', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
            <CanvasSection
              section={sections['revenue-stream']}
              isEditMode={isAuthenticated}
              onAddItem={addItem}
              onEditItem={(item) => handleEditItem('revenue-stream', item)}
              onDeleteItem={deleteItem}
              onReorderItems={reorderItems}
            />
          </div>
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
