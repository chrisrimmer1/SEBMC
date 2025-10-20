// Type definitions for SEBMC application

export interface ContentItem {
  id: string;
  title: string;
  description: string;
}

export interface CanvasSection {
  id: string;
  title: string;
  subtitle: string;
  items: ContentItem[];
  icon?: string;
}

export type SectionId =
  | 'social-problem'
  | 'service-portfolio'
  | 'core-value'
  | 'beneficiaries'
  | 'impact'
  | 'network-partners'
  | 'channels'
  | 'costs'
  | 'revenue-stream';

export interface CanvasData {
  sections: Record<SectionId, CanvasSection>;
  lastModified: string;
  headerTitle?: string;
  canvasTitle?: string;
  canvasSubtitle?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  mode: 'view' | 'edit';
}
