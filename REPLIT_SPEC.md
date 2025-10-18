# SEBMC - Replit Deployment Spec

Use this specification to create the Social Enterprise Business Model Canvas app in Replit.

## Replit Template Selection

**Choose:** React + Vite (TypeScript)

Or start with: Node.js template and configure manually

## Project Specification

### Application Overview
Create a Social Enterprise Business Model Canvas (SEBMC) - an interactive planning tool for social enterprises with 9 customizable sections arranged in a specific grid layout.

### Tech Stack
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite 7+
- **Styling:** Pure CSS (no frameworks)
- **State Management:** React Hooks only
- **Drag & Drop:** @hello-pangea/dnd
- **Icons:** lucide-react
- **Data Persistence:** Browser localStorage + JSON export/import

### Dependencies (package.json)
```json
{
  "dependencies": {
    "@hello-pangea/dnd": "^18.0.1",
    "lucide-react": "^0.546.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.4",
    "typescript": "~5.9.3",
    "vite": "^7.1.7"
  }
}
```

### Core Features Required

1. **Password Protection**
   - View-only mode by default (no password)
   - Edit mode requires password: `jobshapedobject`
   - Password stored as SHA-256 hash
   - Session-based authentication (sessionStorage)

2. **Canvas Layout (CSS Grid)**
   - 10-column grid system
   - 3 rows with specific spanning rules
   - 9 sections total:
     - **Column 1:** Social Problem (top) + Network Partners (bottom)
     - **Column 2:** Service Portfolio (tall, spans 2 rows)
     - **Column 3:** Core Value Offerings (tall, spans 2 rows)
     - **Column 4:** Beneficiaries (top) + Channels (bottom)
     - **Column 5:** Impact (tall, spans 2 rows)
     - **Row 3:** Costs (left half) + Revenue Stream (right half, equal width)

3. **Section Details**
   Each section has:
   - Title
   - Subtitle (italicized description)
   - List of content items
   - Yellow border (#f4c430)
   - White background
   - Rounded corners

4. **Content Items**
   - Each item has: id, title, description
   - Draggable within sections (edit mode only)
   - Click to edit (opens modal)
   - Delete button (edit mode only)
   - Support for multi-line descriptions with bullet points (lines starting with `-`)

5. **Data Management**
   - Auto-save to localStorage on every change
   - Storage key: `sebmcCanvasData`
   - Export backup as JSON file
   - Import backup from JSON file
   - Clear all data (with confirmation)
   - Display "Last saved" timestamp

6. **UI Components Needed**
   - Header (with lock/unlock button)
   - Sidebar (tools panel, edit mode only)
   - Canvas sections (9 total)
   - Content items (draggable cards)
   - Edit modal (for editing items)
   - Password modal

### Color Scheme
- Primary Yellow: `#f4c430`
- Primary Black: `#000000`
- Primary White: `#ffffff`
- Gray shades for backgrounds and text

### Grid Layout CSS
```css
.business-model-canvas {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: auto auto auto;
  gap: 1.5rem;
}

/* Each section positioned using nth-child selectors */
/* Social Problem: grid-column: 1/3, grid-row: 1 */
/* Service Portfolio: grid-column: 3/5, grid-row: 1/3 (tall) */
/* Core Value: grid-column: 5/7, grid-row: 1/3 (tall) */
/* Beneficiaries: grid-column: 7/9, grid-row: 1 */
/* Impact: grid-column: 9/11, grid-row: 1/3 (tall) */
/* Network Partners: grid-column: 1/3, grid-row: 2 */
/* Channels: grid-column: 7/9, grid-row: 2 */
/* Costs: grid-column: 1/6, grid-row: 3 (50% width) */
/* Revenue Stream: grid-column: 6/11, grid-row: 3 (50% width) */
```

### File Structure
```
src/
├── components/
│   ├── Header.tsx          # Auth controls, mode indicator
│   ├── Sidebar.tsx         # Tools panel (export/import/clear)
│   ├── CanvasSection.tsx   # Individual section with drag-drop
│   ├── ContentItem.tsx     # Draggable item card
│   └── EditModal.tsx       # Item editing dialog
├── hooks/
│   ├── useAuth.ts          # Password auth logic
│   └── useCanvasData.ts    # Data CRUD + persistence
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   └── initialData.ts      # Default empty canvas structure
├── App.tsx                 # Main component
├── App.css                 # All styles
└── main.tsx                # React entry point
```

### Section Definitions
```typescript
const sections = {
  'social-problem': {
    title: 'Social problem',
    subtitle: 'A problem which is causing disequilibrium in the society.'
  },
  'service-portfolio': {
    title: 'Service portfolio',
    subtitle: 'A list of services/actions/programs that deliver the core value.'
  },
  'core-value': {
    title: 'Core value offerings',
    subtitle: 'The value proposition that aims to eradicate the social problem addressed.'
  },
  'beneficiaries': {
    title: 'Beneficiaries',
    subtitle: 'The target group/vulnerable segment who will be benefited.'
  },
  'impact': {
    title: 'Impact',
    subtitle: 'A set of matrices to measure the progress of the value offered.'
  },
  'network-partners': {
    title: 'Network partners',
    subtitle: 'Reference groups/peer-support network who are willing to join the cause.'
  },
  'channels': {
    title: 'Channels',
    subtitle: 'Media through which the services will be provided, i.e. online, off-line.'
  },
  'costs': {
    title: 'Costs',
    subtitle: 'Sources of expenditure, capital cost, operational cost.'
  },
  'revenue-stream': {
    title: 'Revenue stream',
    subtitle: 'Sources of earnings which will keep the venture sustainable.'
  }
}
```

### Key Implementation Details

1. **Password Hash (SHA-256)**
   ```typescript
   const CORRECT_PASSWORD_HASH = '1feb5334d184e393d997e5cd92951f013b1d8ceffce37e329419586b86fe400d';
   // This is the hash of "jobshapedobject"
   ```

2. **localStorage Auto-save**
   - Save on every add/edit/delete/reorder operation
   - Include timestamp in saved data
   - Load on component mount

3. **Drag & Drop Setup**
   - Use `@hello-pangea/dnd` library
   - Each section has its own DragDropContext
   - Droppable area for items
   - Draggable items with grip handle icon

4. **Type Imports**
   - Use `import type { ... }` for all TypeScript types
   - Prevents runtime import errors with Vite

5. **Responsive Design**
   - Desktop: Full 10-column grid
   - Tablet: Adjust to 2-column layout
   - Mobile: Single column stack

### Run Commands in Replit

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing Checklist

- [ ] Password lock/unlock works
- [ ] Add items in edit mode
- [ ] Edit items by clicking
- [ ] Delete items
- [ ] Drag & drop to reorder
- [ ] Data persists after page refresh
- [ ] Export downloads JSON file
- [ ] Import restores data from JSON
- [ ] Clear all data works with confirmation
- [ ] Layout matches grid specification
- [ ] Responsive on mobile/tablet
- [ ] All 9 sections display correctly

### Additional Notes

- Footer should credit: "Re-created with React + TypeScript based on original SEBMC by HotCubator"
- Use lucide-react icons: Lock, Unlock, Eye, Edit3, GripVertical, X, Plus, Download, Upload, Trash2, Menu, Clock
- Sidebar only visible in edit mode
- "Last saved" timestamp shown in sidebar
- Yellow dashed border on "Add Item" buttons

### Replit Configuration

In `.replit` file:
```toml
run = "npm run dev"
entrypoint = "src/main.tsx"

[nix]
channel = "stable-23_11"

[deployment]
run = ["sh", "-c", "npm run build && npm run preview"]
```

### Expected Outcome

A fully functional business model canvas tool where users can:
- View the canvas without authentication
- Unlock with password to edit
- Add, edit, delete, and reorder items
- Data automatically saves to browser
- Export/import for backup
- Clean, professional yellow-and-white design
- Responsive across all devices

---

## Quick Start Prompt for Replit Agent

"Create a React + TypeScript + Vite application for a Social Enterprise Business Model Canvas with 9 sections in a custom grid layout. Use @hello-pangea/dnd for drag-and-drop, lucide-react for icons, localStorage for persistence, and password protection (SHA-256 hash). Layout uses a 10-column CSS grid with specific section positioning. Include export/import JSON backup functionality. Use yellow (#f4c430) and white color scheme."
