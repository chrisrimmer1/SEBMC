# Social Enterprise Business Model Canvas (SEBMC)

A modern, interactive web application for planning and visualizing social enterprise business models. Built with React, TypeScript, and Vite for a fast, responsive experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)

## Features

✨ **Interactive Canvas** - 9 specialized sections adapted for social enterprises
🔒 **Password Protection** - View-only mode by default, edit mode requires authentication
🎯 **Drag & Drop** - Easily reorder items within sections
💾 **Auto-Save** - Changes automatically saved to browser storage
📥 **Export/Import** - Backup and restore your canvas as JSON
📱 **Fully Responsive** - Works on desktop, tablet, and mobile
⚡ **Lightning Fast** - Built with Vite for instant hot reload during development
🎨 **Clean Design** - Minimalist yellow and black theme inspired by HotCubator

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SEBMC.git
cd SEBMC

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

### Building for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Usage

### View Mode

Open the application - you'll see the Social Enterprise Business Model Canvas in view-only mode. You can browse the sections and existing content.

### Edit Mode

1. Click the **🔓 Unlock** button in the top-right corner
2. Enter password: `jobshapedobject`
3. You can now:
   - **Add items**: Click "+ Add Item" in any section
   - **Edit items**: Click on any item to edit its title and description
   - **Delete items**: Click the × button on any item
   - **Reorder items**: Drag items by their handle (⋮⋮) to reorder
   - **Export backup**: Click menu button → Export Backup
   - **Import backup**: Click menu button → Import Backup

### Bullet Points

When editing item descriptions, start a line with `-` to create a bullet point:

```
- First point
- Second point
Regular text
- Another point
```

### Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save (auto-saves anyway)
- **Esc**: Close modal or sidebar

## Canvas Sections

The SEBMC includes 9 sections organized in 3 rows:

### Row 1: Value Creation
- **Social Problem**: The problem causing disequilibrium in society
- **Service Portfolio**: Services/actions/programs that deliver the core value
- **Core Value Offerings**: The value proposition to eradicate the social problem
- **Beneficiaries**: Target group/vulnerable segment who will benefit
- **Impact**: Metrics to measure progress

### Row 2: Delivery
- **Network Partners**: Reference groups/peer-support network
- **Channels**: Media through which services will be provided

### Row 3: Sustainability
- **Costs**: Sources of expenditure (capital, operational)
- **Revenue Stream**: Sources of earnings to keep the venture sustainable

## Data Storage

All data is stored in your browser's localStorage. This means:

✅ Your data stays private and secure on your device
✅ Works offline - no internet connection required
✅ Fast performance - no server roundtrips
⚠️ Data is device-specific - use Export/Import to move between devices
⚠️ Clearing browser data will erase your canvas

**Recommendation**: Regularly export backups!

## Changing the Password

The default password is `jobshapedobject`. To change it:

1. Generate SHA-256 hash of your new password:
   ```javascript
   const hash = await crypto.subtle.digest('SHA-256',
     new TextEncoder().encode('your-new-password'));
   const hashHex = Array.from(new Uint8Array(hash))
     .map(b => b.toString(16).padStart(2, '0')).join('');
   console.log(hashHex);
   ```

2. Update `CORRECT_PASSWORD_HASH` in `src/hooks/useAuth.ts`

3. Rebuild the application

## Development

### Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main application
└── App.css         # All styles
```

### Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **@hello-pangea/dnd** - Drag and drop
- **lucide-react** - Icon library

### Adding a New Section

1. Add section ID to `types/index.ts`
2. Add section definition in `utils/initialData.ts`
3. Add section component in `App.tsx`
4. Update CSS grid layout in `App.css` if needed

See `CLAUDE.md` for detailed development documentation.

## Deployment

### GitHub Pages

```bash
npm install -D gh-pages
npm run build
npx gh-pages -d dist
```

### Netlify

1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Vercel

```bash
npm install -g vercel
vercel
```

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires:
- ES2020+ support
- CSS Grid and Flexbox
- localStorage API
- Web Crypto API (for password hashing)

## Credits

**Original Concept**: Social Enterprise Business Model Canvas by [HotCubator](https://hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas/)

**Implementation**: React + TypeScript recreation with modern tooling

## License

MIT License - see LICENSE file for details

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check `CLAUDE.md` for detailed documentation

## Roadmap

Potential future enhancements:
- [ ] Multiple canvas support
- [ ] PDF export
- [ ] Collaboration features
- [ ] Themes/custom colors
- [ ] Undo/redo
- [ ] Version history

---

Built with ❤️ for social entrepreneurs making a difference
