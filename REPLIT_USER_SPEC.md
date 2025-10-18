# Social Enterprise Business Model Canvas - User Specification for Replit

## What to Build

A web-based planning tool for social enterprises called the Social Enterprise Business Model Canvas (SEBMC). Users can fill out 9 different sections to plan their social impact venture.

## Visual Layout

The canvas should display 9 sections arranged in a specific grid pattern (see reference image):

**Top Row (5 sections):**
1. **Social Problem** (left)
2. **Service Portfolio** (tall - extends down)
3. **Core Value Offerings** (tall - extends down)
4. **Beneficiaries**
5. **Impact** (tall - extends down)

**Middle Row (2 sections, filling gaps):**
6. **Network Partners** (below Social Problem)
7. **Channels** (below Beneficiaries)

**Bottom Row (2 sections, equal width):**
8. **Costs** (left half)
9. **Revenue Stream** (right half)

Each section should have:
- A title (bold, black text)
- A subtitle explanation in smaller italics
- An area where users can add multiple items

## User Functionality

### Viewing Mode (Default)
- Anyone can view the canvas without logging in
- See all sections and their content
- Read-only - cannot make changes
- Clean, professional appearance

### Edit Mode (Password Protected)
- Users click "Unlock" and enter password: **jobshapedobject**
- Password required to make any changes
- Clear visual indicator showing "Edit Mode" is active
- "Lock" button to return to view-only mode

### Adding Content (Edit Mode Only)
- Each section has an "Add Item" button
- Clicking opens a form to enter:
  - Item title (short heading)
  - Item description (can be multiple lines)
  - Support bullet points (lines starting with dash `-`)
- Items appear as cards within their section
- New items save automatically

### Editing Content (Edit Mode Only)
- Click any item to edit it
- Update title or description
- Changes save automatically
- Show when last saved (timestamp)

### Deleting Content (Edit Mode Only)
- Each item has a delete button (X icon)
- Confirm before deleting
- Deletion saves automatically

### Reordering Content (Edit Mode Only)
- Drag and drop items to reorder them within a section
- Visual feedback while dragging (handle icon)
- New order saves automatically

## Design & Styling

**Color Scheme:**
- Primary color: Golden yellow (#f4c430 or similar)
- Section borders: Yellow, 2-3px thick
- Section backgrounds: White
- Text: Black on white
- Accent colors: Grays for subtle elements

**Visual Style:**
- Clean and professional
- Rounded corners on sections
- Subtle shadows for depth
- Yellow "Add Item" buttons with dashed borders
- Icons for actions (lock, unlock, edit, delete, drag, export, import)

**Responsive Design:**
- Desktop: Show full grid layout as described
- Tablet: Adapt layout (2 columns or stacked)
- Mobile: Single column, touch-friendly
- Ensure usable on all screen sizes

## Section Content (What Each Section is For)

1. **Social Problem**
   - "A problem which is causing disequilibrium in the society"
   - Users describe the social issue they're addressing

2. **Service Portfolio**
   - "A list of services/actions/programs that deliver the core value"
   - Users list their programs and offerings

3. **Core Value Offerings**
   - "The value proposition that aims to eradicate the social problem addressed"
   - Users describe their unique solution

4. **Beneficiaries**
   - "The target group/vulnerable segment who will be benefited"
   - Users identify who they're helping

5. **Impact**
   - "A set of matrices to measure the progress of the value offered"
   - Users define success metrics

6. **Network Partners**
   - "Reference groups/peer-support network who are willing to join the cause"
   - Users list organizations and partners

7. **Channels**
   - "Media through which the services will be provided, i.e. online, off-line"
   - Users specify delivery methods

8. **Costs**
   - "Sources of expenditure, capital cost, operational cost"
   - Users itemize expenses

9. **Revenue Stream**
   - "Sources of earnings which will keep the venture sustainable"
   - Users identify income sources

## User Experience Priorities

1. **Simplicity**: Should be intuitive without instructions
2. **Reliability**: Never lose data, always auto-save
3. **Speed**: Fast loading, instant saving
4. **Privacy**: Data belongs to the user, not shared publicly
5. **Portability**: Easy to backup and restore data
6. **Accessibility**: Keyboard navigation, screen reader friendly

## Edge Cases to Handle

- What if user clears browser data?
  - Provide export backup feature as safety net
- What if user forgets password?
  - Password is `jobshapedobject` (document this somewhere)
- What if import file is corrupted?
  - Show error message, don't break the app
- What if user tries to add 100+ items to one section?
  - Should still work, but consider scrolling within sections

## Success Criteria

The app is successful if:
- ✅ Users can view an empty canvas without logging in
- ✅ Users can unlock edit mode with the password
- ✅ Users can add/edit/delete/reorder items in all 9 sections
- ✅ Data automatically saves and persists across sessions
- ✅ Users can export their work as a backup
- ✅ Users can import a backup to restore their work
- ✅ Layout matches the described grid structure
- ✅ Works on desktop, tablet, and mobile
- ✅ No bugs or data loss under normal usage

## Optional Enhancements (Nice to Have)

If time/scope allows:
- User accounts (each user has their own canvas)
- Multiple canvases per user (different projects)
- Real-time collaboration (multiple people editing)
- PDF export (printable version)
- Undo/redo functionality
- Dark mode toggle
- Custom color themes
- Public sharing links (read-only)

## Technical Freedom

Replit should choose:
- Frontend framework (React, Vue, Svelte, etc.)
- Backend technology (Node.js, Python, Go, etc.)
- Database choice (PostgreSQL, MongoDB, SQLite, etc.)
- Styling approach (CSS, Tailwind, styled-components, etc.)
- Hosting/deployment strategy
- Authentication method (JWT, sessions, etc.)

**Just make sure it:**
- Loads fast
- Saves reliably
- Looks professional
- Works on all devices
- Matches the layout described above

## Reference

Based on the Social Enterprise Business Model Canvas by HotCubator:
https://hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas/

---

## TL;DR Prompt for Replit Agent

"Build a web app for the Social Enterprise Business Model Canvas with 9 sections in a specific grid layout. Users can view by default, unlock with password 'jobshapedobject' to edit. In edit mode, users can add/edit/delete/drag-reorder items within each section. Auto-save all changes. Provide export/import backup as files. Use yellow (#f4c430) borders and professional design. Layout: 5 columns on top, 2 in middle (filling gaps under columns 1 and 4), 2 equal-width sections at bottom. Columns 2, 3, 5 extend full height (tall). Must work on desktop/tablet/mobile."
