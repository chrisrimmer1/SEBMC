import { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Plus, Edit2, HelpCircle } from 'lucide-react';
import type { CanvasSection as CanvasSectionType, ContentItem as ContentItemType, SectionId } from '../types';
import { ContentItem } from './ContentItem';
import { generateId } from '../utils/initialData';

interface CanvasSectionProps {
  section: CanvasSectionType;
  isEditMode: boolean;
  onAddItem: (sectionId: SectionId, item: ContentItemType) => void;
  onEditItem: (item: ContentItemType) => void;
  onDeleteItem: (sectionId: SectionId, itemId: string) => void;
  onReorderItems: (sectionId: SectionId, items: ContentItemType[]) => void;
  onUpdateSubtitle: (sectionId: SectionId, subtitle: string) => void;
  onShowSeedQuestions: (sectionId: SectionId) => void;
}

export function CanvasSection({
  section,
  isEditMode,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onReorderItems,
  onUpdateSubtitle,
  onShowSeedQuestions
}: CanvasSectionProps) {
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);
  const [editedSubtitle, setEditedSubtitle] = useState(section.subtitle);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(section.items);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorderItems(section.id as SectionId, items);
  };

  const handleAddItem = () => {
    const newItem: ContentItemType = {
      id: generateId(),
      title: 'New Item',
      description: 'Click to edit this item'
    };
    onAddItem(section.id as SectionId, newItem);
  };

  const handleSubtitleClick = () => {
    if (isEditMode) {
      setIsEditingSubtitle(true);
      setEditedSubtitle(section.subtitle);
    }
  };

  const handleSubtitleSave = () => {
    onUpdateSubtitle(section.id as SectionId, editedSubtitle);
    setIsEditingSubtitle(false);
  };

  const handleSubtitleCancel = () => {
    setEditedSubtitle(section.subtitle);
    setIsEditingSubtitle(false);
  };

  const handleSubtitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubtitleSave();
    } else if (e.key === 'Escape') {
      handleSubtitleCancel();
    }
  };

  return (
    <div className={`canvas-section ${section.id}`}>
      <div className="section-header">
        <div className="section-title-row">
          <h3>{section.title}</h3>
          {isEditMode && (
            <button
              className="btn btn-icon btn-help"
              onClick={() => onShowSeedQuestions(section.id)}
              title="Show guiding questions"
            >
              <HelpCircle size={16} />
            </button>
          )}
        </div>
        {isEditingSubtitle ? (
          <div className="subtitle-edit-container">
            <textarea
              className="subtitle-edit-input"
              value={editedSubtitle}
              onChange={(e) => setEditedSubtitle(e.target.value)}
              onKeyDown={handleSubtitleKeyDown}
              onBlur={handleSubtitleSave}
              autoFocus
              rows={2}
            />
          </div>
        ) : (
          <p
            className={`section-subtitle ${isEditMode ? 'editable' : ''}`}
            onClick={handleSubtitleClick}
            title={isEditMode ? 'Click to edit subtitle' : ''}
          >
            {section.subtitle}
            {isEditMode && <Edit2 size={12} className="edit-icon-inline" />}
          </p>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={section.id}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`section-content ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            >
              {section.items.map((item, index) => (
                <ContentItem
                  key={item.id}
                  item={item}
                  index={index}
                  isEditMode={isEditMode}
                  onEdit={onEditItem}
                  onDelete={(id) => onDeleteItem(section.id as SectionId, id)}
                />
              ))}
              {provided.placeholder}

              {isEditMode && (
                <button className="add-item-btn" onClick={handleAddItem}>
                  <Plus size={16} /> Add Item
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
