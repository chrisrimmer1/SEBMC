import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, X } from 'lucide-react';
import { ContentItem as ContentItemType } from '../types';

interface ContentItemProps {
  item: ContentItemType;
  index: number;
  isEditMode: boolean;
  onEdit: (item: ContentItemType) => void;
  onDelete: (id: string) => void;
}

export function ContentItem({ item, index, isEditMode, onEdit, onDelete }: ContentItemProps) {
  const formatDescription = (description: string) => {
    const lines = description.split('\n').filter(line => line.trim());

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
        const cleaned = trimmed.replace(/^[-•]\s*/, '');
        return (
          <div key={idx} className="list-item">
            {cleaned}
          </div>
        );
      }
      return (
        <div key={idx} className="plain-line">
          {trimmed}
        </div>
      );
    });
  };

  return (
    <Draggable draggableId={item.id} index={index} isDragDisabled={!isEditMode}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`content-item ${isEditMode ? 'editable' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
          onClick={() => isEditMode && onEdit(item)}
        >
          {isEditMode && (
            <div {...provided.dragHandleProps} className="drag-handle">
              <GripVertical size={16} />
            </div>
          )}

          <div className="content-item-content">
            <span className="item-title">{item.title}</span>
            <div className="item-desc">
              {formatDescription(item.description)}
            </div>
          </div>

          {isEditMode && (
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this item?')) {
                  onDelete(item.id);
                }
              }}
              title="Delete item"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}
