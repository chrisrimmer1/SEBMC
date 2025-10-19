import { X } from 'lucide-react';
import type { SectionId } from '../types';
import { seedQuestions } from '../utils/seedQuestions';

interface SeedQuestionsModalProps {
  sectionId: SectionId;
  onClose: () => void;
}

export function SeedQuestionsModal({ sectionId, onClose }: SeedQuestionsModalProps) {
  const section = seedQuestions[sectionId];

  if (!section) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal seed-questions-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span className="seed-emoji">{section.emoji}</span> {section.title}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="seed-intro">Consider these guiding questions as you develop this section:</p>
          <ul className="seed-questions-list">
            {section.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
