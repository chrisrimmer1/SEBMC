import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
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
}

export function CanvasSection({
  section,
  isEditMode,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onReorderItems
}: CanvasSectionProps) {
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

  return (
    <div className={`canvas-section ${section.id}`}>
      <div className="section-header">
        <h3>{section.title}</h3>
        <p className="section-subtitle">{section.subtitle}</p>
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
