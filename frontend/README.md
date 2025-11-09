# JusticeAI Frontend (WIP Name)

> **Accelerating exoneration for the wrongfully convicted through AI-powered legal document analysis**

This React frontend allows users to upload PDF legal documents and receive AI-generated summaries and analysis using Google Gemini. Built for the Hack for Social Impact hackathon to help legal advocates work more efficiently on wrongful conviction cases.

---

## Quick Start ⚡

### Prerequisites
- **Node.js 20.19+ or 22.12+** (required by Vite 7)
- Backend server running (see [backend README](../backend/README.md))

### Get Running in 3 Steps
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
# Open http://localhost:5173 in your browser
```

**Important**: The backend must be running on `http://localhost:8000` for API integration to work. Check the [backend README](../backend/README.md) for setup instructions, API keys, and configuration.

---

## Tech Stack 🛠️

- **React** 19.1.1 - UI framework
- **TypeScript** 5.9.3 - Type safety
- **Vite** 7.1.14 - Lightning-fast build tool
- **Axios** 1.13.2 - HTTP client for API calls
- **react-markdown** 10.1.0 - Renders formatted summaries
- **Styling** - CSS Variables + Inline Styles (light mode only, no frameworks)

---

## Project Structure 📁

```
frontend/
├── src/
│   ├── pages/
│   │   ├── ModalTestPage.tsx      # Test page for upload modal UI
│   │   └── ApiTestPage.tsx        # Test page for API integration
│   ├── services/
│   │   └── api.ts                 # API service layer (all backend calls)
│   ├── PdfUploadModal.tsx         # Main PDF upload modal component
│   ├── App.tsx                    # Navigation & page switching
│   ├── main.tsx                   # React entry point
│   ├── index.css                  # Design tokens (CSS variables)
│   └── App.css
├── public/                        # Static assets
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
├── tsconfig.app.json              # Main TypeScript config
└── CLAUDE.md                      # AI development context
```

---

## Key Architectural Decisions 🏗️

### No Routing Library
We use **state-based page switching** in `App.tsx` instead of React Router. Simple and lightweight for our hackathon scope.

### CSS Variables + Inline Styles
- **Design tokens** defined in `src/index.css` (30+ variables for colors, spacing, typography)
- Components use **inline styles** that reference variables: `backgroundColor: 'var(--primary-blue)'`
- This hybrid approach gives us consistency without a CSS framework

### Light Mode Only
**Design constraint**: We only support light mode. No dark mode styling.

### TypeScript Strict Mode
- `verbatimModuleSyntax` is enabled
- **Use type-only imports** for React types:
  ```typescript
  // ✅ Correct
  import { useState, type ChangeEvent, type FormEvent } from 'react'

  // ❌ Will cause build errors
  import { useState, ChangeEvent, FormEvent } from 'react'
  ```

### Page-Based Testing
- Separate test pages for isolated feature testing
- `ModalTestPage` - Test UI/UX without API
- `ApiTestPage` - Test backend integration
- Easy to develop and test features independently

---

## Development Workflow 💻

### Running the Dev Server
```bash
npm run dev
```
Opens at `http://localhost:5173` with hot module replacement (HMR).

### Building for Production
```bash
npm run build
```
Outputs to `dist/` directory.

### Linting
```bash
npm run lint
```

### ⚠️ IMPORTANT: Pre-Push Checklist
**Always run these commands before pushing to ensure your changes won't break deployment:**

```bash
npm run lint    # Check for code quality issues
npm run build   # Verify production build works
```

If either command fails, fix the issues before pushing!

### Dev Server Notes
- **After installing new packages**: Restart the dev server (Ctrl+C, then `npm run dev`)
- Vite caches dependencies and needs a restart to recognize new packages

---

## API Integration 🔌

### Backend Connection
- **Backend URL**: `http://localhost:8000`
- **Main Endpoint**: `POST /pdf/process`
- **CORS**: Enabled on backend (allows all origins in dev)

### Using the API Service
All API calls go through `src/services/api.ts`:

```typescript
import { uploadPdfForProcessing } from './services/api'

// Upload a PDF file
const response = await uploadPdfForProcessing(
  file,              // File object
  prompt,            // Optional custom prompt
  maxTokens          // Optional token limit (default: 2000)
)

// Response includes:
// - success: boolean
// - filename: string
// - file_size: number
// - extracted_text_length: number
// - markdown_summary: string (formatted with react-markdown)
// - summary_type: string
```

### Backend Configuration
For API keys, environment variables, and backend setup details, see the [backend README](../backend/README.md).

---

## Making Changes ✏️

### Adding Styles
Use CSS variables from `src/index.css`:

```typescript
// Available variables:
// Colors: --primary-blue, --text-gray, --success-bg, --error-text, etc.
// Spacing: --spacing-sm, --spacing-md, --spacing-lg, etc.
// Border radius: --radius-sm, --radius-md, --radius-lg
// Font sizes: --font-size-sm, --font-size-md

const myStyle = {
  backgroundColor: 'var(--primary-blue)',
  padding: 'var(--spacing-md)',
  borderRadius: 'var(--radius-lg)',
}
```

### Adding Components
- Place reusable components in `src/`
- Use **PascalCase** naming: `ComponentName.tsx`
- Test pages go in `src/pages/` with "Page" suffix

### TypeScript Tips
- Main config is in `tsconfig.app.json` (not `tsconfig.json`)
- Always use **type-only imports** for types
- Strict mode is enabled - fix all type errors

### API Calls
- Use `uploadPdfForProcessing()` from `services/api.ts`
- Handle errors with try/catch
- Display loading states for better UX

---

## Current Status & Next Steps ✅

### What's Working
✅ Basic Vite + React + TypeScript setup
✅ PDF upload modal with inline CSS
✅ API service layer with axios
✅ Test pages for isolated feature testing
✅ Navigation system (state-based, no router)
✅ API integration complete with react-markdown rendering
✅ Error handling and loading states implemented
✅ Light mode only CSS configuration
✅ Production build working (type-only imports configured)

### What's Next
(No planned features at this time)

---

## Troubleshooting 🔧

### API Not Working
**Problem**: Network errors or CORS issues

**Solutions**:
1. Verify backend is running on `http://localhost:8000`
2. Check backend logs for errors
3. See [backend README](../backend/README.md) for configuration details

### New Packages Not Loading
**Problem**: Just installed a package but getting import errors

**Solution**: Restart the dev server:
```bash
# Press Ctrl+C
npm run dev
```

### Build Fails but Dev Works
**Problem**: `npm run build` fails with errors

**Solutions**:
1. Check for type errors - strict mode catches more in builds
2. Look for unused imports/variables
3. Verify all type-only imports are correct

---

## Resources 📚

- **[Backend README](../backend/README.md)** - API keys, environment setup, backend docs
- **[CLAUDE.md](./CLAUDE.md)** - Detailed project context for AI development
- **[Vite Documentation](https://vite.dev/)** - Build tool docs
- **[React Documentation](https://react.dev/)** - React 19 docs
- **[TypeScript Documentation](https://www.typescriptlang.org/)** - TypeScript reference

---

## Contributing to This Project

1. **Pull latest changes**: `git pull`
2. **Make your changes** following the patterns above
3. **Test locally**: `npm run dev` and verify functionality
4. **Run pre-push checks**:
   ```bash
   npm run lint
   npm run build
   ```
5. **Commit with descriptive messages** (see git commit guidelines in `~/.claude/CLAUDE.md`)
6. **Push**: `git push`

---

**Questions?** Check the backend README, CLAUDE.md, or ask the team!

Happy hacking! 🚀
