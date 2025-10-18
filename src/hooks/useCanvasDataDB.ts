import { useState, useEffect, useCallback } from 'react';
import type { CanvasData, ContentItem, SectionId } from '../types';
import { getInitialCanvasData } from '../utils/initialData';

// API endpoints
const API_BASE = '/.netlify/functions';

export function useCanvasDataDB() {
  const [canvasData, setCanvasData] = useState<CanvasData>(getInitialCanvasData());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE}/get-canvas`);

        if (response.ok) {
          const { canvasData: data, lastModified } = await response.json();
          setCanvasData(data);
          setLastSaved(new Date(lastModified));
        } else if (response.status === 404) {
          // No data in database yet, use initial data
          console.log('No canvas data found, using initial data');
        } else {
          throw new Error('Failed to load canvas data');
        }
      } catch (err) {
        console.error('Error loading canvas:', err);
        setError('Failed to load canvas data. Using local version.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save to database whenever data changes
  const saveData = useCallback(async (data: CanvasData) => {
    const dataToSave = {
      ...data,
      lastModified: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE}/save-canvas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ canvasData: dataToSave }),
      });

      if (!response.ok) {
        throw new Error('Failed to save canvas data');
      }

      const { lastModified } = await response.json();
      setCanvasData(dataToSave);
      setLastSaved(new Date(lastModified));
      setError(null);
    } catch (err) {
      console.error('Error saving canvas:', err);
      setError('Failed to save changes');
      // Still update local state even if save fails
      setCanvasData(dataToSave);
    }
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
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    exportData,
    importData,
    clearData
  };
}
