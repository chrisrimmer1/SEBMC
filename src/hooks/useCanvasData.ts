import { useState, useEffect, useCallback } from 'react';
import { CanvasData, ContentItem, SectionId } from '../types';
import { getInitialCanvasData } from '../utils/initialData';

const STORAGE_KEY = 'sebmcCanvasData';

export function useCanvasData() {
  const [canvasData, setCanvasData] = useState<CanvasData>(getInitialCanvasData());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setCanvasData(parsed);
        setLastSaved(new Date(parsed.lastModified));
      } catch (error) {
        console.error('Failed to parse saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  const saveData = useCallback((data: CanvasData) => {
    const dataToSave = {
      ...data,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    setCanvasData(dataToSave);
    setLastSaved(new Date());
  }, []);

  // Add item to section
  const addItem = useCallback((sectionId: SectionId, item: ContentItem) => {
    setCanvasData(prev => {
      const newData = {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionId]: {
            ...prev.sections[sectionId],
            items: [...prev.sections[sectionId].items, item]
          }
        }
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // Update item in section
  const updateItem = useCallback((sectionId: SectionId, itemId: string, updates: Partial<ContentItem>) => {
    setCanvasData(prev => {
      const newData = {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionId]: {
            ...prev.sections[sectionId],
            items: prev.sections[sectionId].items.map(item =>
              item.id === itemId ? { ...item, ...updates } : item
            )
          }
        }
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // Delete item from section
  const deleteItem = useCallback((sectionId: SectionId, itemId: string) => {
    setCanvasData(prev => {
      const newData = {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionId]: {
            ...prev.sections[sectionId],
            items: prev.sections[sectionId].items.filter(item => item.id !== itemId)
          }
        }
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // Reorder items in section
  const reorderItems = useCallback((sectionId: SectionId, items: ContentItem[]) => {
    setCanvasData(prev => {
      const newData = {
        ...prev,
        sections: {
          ...prev.sections,
          [sectionId]: {
            ...prev.sections[sectionId],
            items
          }
        }
      };
      saveData(newData);
      return newData;
    });
  }, [saveData]);

  // Export data as JSON
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(canvasData, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sebmc-backup-${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [canvasData]);

  // Import data from JSON
  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        saveData(imported);
      } catch (error) {
        console.error('Failed to import data:', error);
        alert('Invalid backup file');
      }
    };
    reader.readAsText(file);
  }, [saveData]);

  // Clear all data
  const clearData = useCallback(() => {
    if (confirm('Are you sure you want to clear all data?')) {
      const initialData = getInitialCanvasData();
      saveData(initialData);
    }
  }, [saveData]);

  return {
    canvasData,
    lastSaved,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    exportData,
    importData,
    clearData
  };
}
