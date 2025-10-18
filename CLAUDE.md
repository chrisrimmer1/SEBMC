# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SEBMC (Social Enterprise Business Model Canvas)** is a modern React + TypeScript application for planning and visualizing social enterprise business models. Built with Vite for lightning-fast development, it provides an interactive canvas with 9 specialized sections adapted from the traditional Business Model Canvas for social enterprises.

## Architecture

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7
- **Drag & Drop**: @hello-pangea/dnd (maintained fork of react-beautiful-dnd)
- **Icons**: lucide-react
- **Styling**: Pure CSS with CSS Grid and Flexbox
- **State Management**: React Hooks (no external state library)
- **Data Persistence**: localStorage + JSON export/import

### Project Structure

```
SEBMC/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Top navigation with auth controls
│   │   ├── Sidebar.tsx         # Tools panel (edit mode only)
│   │   ├── CanvasSection.tsx   # Individual section component
│   │   ├── ContentItem.tsx     # Draggable item within sections
│   │   └── EditModal.tsx       # Item editing dialog
│   ├── hooks/
│   │   ├── useAuth.ts          # Authentication logic
│   │   └── useCanvasData.ts    # Data management & persistence
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── utils/
│   │   └── initialData.ts      # Default canvas structure
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # All application styles
│   └── main.tsx                # React entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Component Architecture

#### 1. Header Component
- Displays app title and authentication status
- Shows mode indicator (View Only / Edit Mode)
- Provides Lock/Unlock button
- Contains password modal for authentication

#### 2. Sidebar Component
- Only visible in edit mode
- Provides data management tools:
  - Export backup (JSON download)
  - Import backup (JSON upload)
  - Clear all data
- Shows last saved timestamp
- Displays keyboard shortcuts

#### 3. CanvasSection Component
- Reusable component for each SEBMC section
- Manages its own drag-and-drop context
- Renders section header with title and subtitle
- Contains list of ContentItem components
- Shows "Add Item" button in edit mode

#### 4. ContentItem Component
- Individual draggable item within a section
- Shows drag handle in edit mode
- Supports multi-line descriptions with bullet points
- Click to edit functionality (edit mode only)
- Delete button (edit mode only)

#### 5. EditModal Component
- Modal dialog for editing items
- Title and description fields
- Supports multi-line descriptions
- Keyboard navigation (Enter to save, Esc to cancel)

### State Management

#### Authentication State (useAuth hook)
```typescript
{
  isAuthenticated: boolean,
  mode: 'view' | 'edit',
  login: (password: string) => Promise<boolean>,
  logout: () => void
}
```

- Password: "jobshapedobject" (SHA-256 hashed)
- Stored in sessionStorage (persists during browser session)
- Controls visibility of edit features

#### Canvas Data State (useCanvasData hook)
```typescript
{
  canvasData: CanvasData,
  lastSaved: Date | null,
  addItem: (sectionId, item) => void,
  updateItem: (sectionId, itemId, updates) => void,
  deleteItem: (sectionId, itemId) => void,
  reorderItems: (sectionId, items) => void,
  exportData: () => void,
  importData: (file) => void,
  clearData: () => void
}
```

- Auto-saves to localStorage on every change
- Tracks last modification timestamp
- Provides CRUD operations for items

### SEBMC Sections

The Social Enterprise Business Model Canvas has 9 sections organized in 3 rows:

**Row 1 (5 columns):**
1. **Social problem** - Problem causing disequilibrium in society
2. **Service portfolio** - List of services/actions/programs delivering core value
3. **Core value offerings** - Value proposition to eradicate the social problem
4. **Beneficiaries** - Target group/vulnerable segment who will benefit
5. **Impact** - Metrics to measure progress

**Row 2 (2 columns):**
6. **Network partners** - Reference groups/peer-support network
7. **Channels** - Media through which services are provided

**Row 3 (2 columns):**
8. **Costs** - Sources of expenditure (capital, operational)
9. **Revenue stream** - Sources of earnings for sustainability

### Data Structure

```typescript
interface ContentItem {
  id: string;           // Unique identifier
  title: string;        // Item heading
  description: string;  // Multi-line text (supports bullets with '-' prefix)
}

interface CanvasSection {
  id: SectionId;
  title: string;
  subtitle: string;
  items: ContentItem[];
  icon?: string;
}

interface CanvasData {
  sections: Record<SectionId, CanvasSection>;
  lastModified: string;  // ISO timestamp
}
```

### localStorage Schema

**Key**: `sebmcCanvasData`

**Value**: JSON stringified CanvasData object

```json
{
  "sections": {
    "social-problem": {
      "id": "social-problem",
      "title": "Social problem",
      "subtitle": "...",
      "items": [...]
    },
    // ... other sections
  },
  "lastModified": "2025-10-18T12:00:00.000Z"
}
```

## Development Workflow

### Running Locally

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs at `http://localhost:5173/` with instant hot module replacement.

### Making Changes

#### Adding a New Section

1. Add section ID to `SectionId` type in `types/index.ts`
2. Add section definition in `utils/initialData.ts`
3. Add section component to `App.tsx` in appropriate row
4. Update CSS grid layout if needed in `App.css`

#### Modifying Styles

All styles are in `src/App.css`:
- **Color scheme**: Yellow (#f4c430) and black/white
- **Layout**: CSS Grid for canvas, Flexbox for components
- **Responsive**: Breakpoints at 1400px, 1024px, 768px, 480px
- **CSS Variables**: Defined in `:root` for easy theming

#### Changing Password

Update `CORRECT_PASSWORD_HASH` in `src/hooks/useAuth.ts`:

```typescript
// Generate new hash
const password = "your-new-password";
const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
console.log(hashHex); // Use this value
```

### Testing Changes

1. **Visual Testing**: Open `http://localhost:5173/` in browser
2. **View Mode**: Test without authentication
3. **Edit Mode**: Enter password "jobshapedobject" to test:
   - Adding items
   - Editing items
   - Deleting items
   - Drag and drop reordering
   - Export/import functionality
4. **Persistence**: Refresh page to verify localStorage works
5. **Responsive**: Test different screen sizes (DevTools)

## Key Features

### 1. Password Protection
- View-only mode by default (no password required)
- Edit mode requires password authentication
- Session-based (stays logged in during browser session)
- SHA-256 hashed password comparison

### 2. Drag and Drop
- Only enabled in edit mode
- Reorder items within each section
- Visual feedback during drag
- Auto-saves new order

### 3. Data Persistence
- **Primary**: Browser localStorage (instant, automatic)
- **Backup**: JSON export/import for data portability
- No backend required - fully client-side

### 4. Responsive Design
- Desktop: Full 5-column grid layout
- Tablet: 3-column then 2-column grid
- Mobile: Single column, touch-friendly
- Sidebar adapts to screen size

### 5. Content Formatting
- Multi-line descriptions supported
- Bullet points: Lines starting with `-` or `•`
- Plain text lines for regular content
- Preserves formatting on save/reload

## Common Tasks

### Export Data Programmatically

```typescript
const canvasData = localStorage.getItem('sebmcCanvasData');
const data = JSON.parse(canvasData);
console.log(data);
```

### Reset to Default State

```typescript
localStorage.removeItem('sebmcCanvasData');
location.reload();
```

### Add Keyboard Shortcut

Edit `App.tsx` and add event listener:

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      // Custom action
    }
  };
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Customize Colors

Edit CSS variables in `App.css`:

```css
:root {
  --primary-yellow: #your-color;
  --primary-black: #your-color;
  /* ... */
}
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in `dist/` directory.

### Deploy to GitHub Pages

1. Install gh-pages: `npm install -D gh-pages`
2. Add to package.json:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

### Deploy to Netlify/Vercel

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## TypeScript Notes

- Strict mode enabled
- All components fully typed
- No `any` types used
- Type inference maximized
- Compile errors caught at build time

## Performance Considerations

- Vite HMR for instant feedback during development
- React.memo not needed (small component tree)
- localStorage is synchronous but fast for this use case
- Drag operations use CSS transforms (GPU accelerated)
- No unnecessary re-renders (hooks properly memoized)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features used
- CSS Grid and Flexbox required
- localStorage required
- crypto.subtle.digest required (for password hashing)

## Future Enhancements

Potential features to add:
- Multiple canvas support (tabs or dropdown)
- Real-time collaboration (WebSocket)
- PDF export
- Image upload for sections
- Theming support
- Undo/redo functionality
- Version history
- Comments/notes on items

## Troubleshooting

### Dev server won't start
- Check if port 5173 is available
- Try `npm install` again
- Delete `node_modules` and reinstall

### Changes not persisting
- Check browser console for errors
- Verify localStorage is enabled
- Check if in private/incognito mode

### Drag and drop not working
- Ensure you're in edit mode (authenticated)
- Check console for errors
- Verify @hello-pangea/dnd is installed

### TypeScript errors
- Run `npm run build` to see all errors
- Check `tsconfig.json` settings
- Ensure all dependencies have type definitions

## License

MIT License - See LICENSE file for details

## Credits

Based on the Social Enterprise Business Model Canvas by HotCubator
(https://hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas/)
