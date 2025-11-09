# Frontend - Hack for Social Impact

## Project Overview
React + TypeScript + Vite frontend application for PDF processing. Integrates with a FastAPI backend to upload PDFs and receive AI-generated summaries using Google Gemini.

## Tech Stack
- **React** 19.1.1
- **TypeScript** 5.9.3
- **Vite** 7.1.14 (build tool)
- **Axios** 1.13.2 (HTTP client)
- **react-markdown** 10.1.0 (markdown rendering)
- **Styling**: CSS Variables + Inline Styles (no frameworks)

## Project Structure
```
frontend/
├── src/
│   ├── pages/
│   │   ├── ModalTestPage.tsx    # Test page for PDF upload modal
│   │   └── ApiTestPage.tsx      # Test page for API integration
│   ├── services/
│   │   └── api.ts               # API service layer (axios)
│   ├── App.tsx                  # Main app with navigation
│   ├── PdfUploadModal.tsx       # PDF upload modal component
│   ├── main.tsx                 # React entry point
│   ├── App.css
│   └── index.css
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## Current Features

### Components
1. **PdfUploadModal** (`src/PdfUploadModal.tsx`)
   - Modal overlay with file upload
   - Accepts only PDF files
   - Shows selected file name and size
   - Upload and Cancel buttons
   - All inline CSS styling

2. **ModalTestPage** (`src/pages/ModalTestPage.tsx`)
   - Test page for modal functionality
   - Opens modal on button click
   - Displays selected file information

3. **ApiTestPage** (`src/pages/ApiTestPage.tsx`)
   - Test page for backend API integration
   - Direct file input for PDF upload
   - Calls `/pdf/process` endpoint
   - Shows loading, error, and success states
   - Uses `react-markdown` to render formatted markdown summaries
   - Displays API response with metadata and formatted summary

### API Service
**Location**: `src/services/api.ts`

**Function**: `uploadPdfForProcessing(file, prompt?, maxTokens?)`
- Uploads PDF to backend using FormData
- Endpoint: `POST http://localhost:8000/pdf/process`
- Returns: `PdfProcessResponse` with metadata and markdown summary
- Error handling for network and API errors

**Response Type**:
```typescript
interface PdfProcessResponse {
  success: boolean
  filename: string
  file_size: number
  extracted_text_length: number
  markdown_summary: string
  summary_type: string
}
```

**Error Type**:
```typescript
interface PdfProcessError {
  detail: string
}
```

### Navigation
**App.tsx** provides simple page switching:
- "Modal Test" - Test modal UI/UX
- "API Test" - Test backend API integration
- No routing library (uses state-based rendering)

## Backend Integration

### API Endpoint
- **URL**: `http://localhost:8000/pdf/process`
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Parameters**:
  - `file`: PDF file (required)
  - `prompt`: Custom prompt (optional)
  - `max_tokens`: Max tokens for AI (optional, default: 2000)

### Error Handling
- 400: Invalid file type, size limit (10MB), or PDF processing errors
- 500: Server/Gemini API errors
- Network errors: Connection failures

## Development Setup

### Installation
```bash
npm install
```

### Running Dev Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## Important Notes

### Styling Approach
**⚠️ IMPORTANT: DESIGN FOR LIGHT MODE ONLY - No dark mode support**

- **CSS Variables + Inline Styles** - Hybrid approach using design tokens
- CSS custom properties (variables) defined in `src/index.css` for colors, spacing, typography, etc.
- Components use inline styles that reference CSS variables via `var(--variable-name)`
- No CSS frameworks (Tailwind, MUI, etc.)
- Example: `backgroundColor: 'var(--primary-blue)'`

### Page-Based Testing
- Separate test pages for different features
- Modal test page: UI/UX testing without API
- API test page: Backend integration testing
- Easy to test features in isolation

### Vite Dev Server
- **Important**: After `npm install` of new packages, restart dev server
- Vite caches dependencies and needs restart to recognize new packages
- Press Ctrl+C and run `npm run dev` again

### Backend Dependency
- Backend must be running on `http://localhost:8000`
- API calls will fail if backend is down
- CORS is enabled on backend (allows all origins in dev)

## File Organization Conventions

### Components
- Place reusable components in `src/`
- Use PascalCase for component files: `ComponentName.tsx`

### Pages
- Test pages go in `src/pages/`
- Named with "Page" suffix: `ModalTestPage.tsx`

### Services
- API and business logic in `src/services/`
- Use lowercase with extensions: `api.ts`

### Types
- TypeScript interfaces defined inline or in service files
- Export types that are used across multiple files

## TypeScript Configuration
**Note**: Main configuration is in `tsconfig.app.json` (referenced by `tsconfig.json`)

- **Strict mode** enabled
- **verbatimModuleSyntax** enabled - requires type-only imports for types
- No unused locals/parameters
- ES2022 target
- JSX: react-jsx (automatic transform)
- Module resolution: bundler

### Type-Only Imports
When importing types from React or other libraries, use type-only imports:
```typescript
// ✅ Correct - type-only imports
import { useState, type ChangeEvent, type FormEvent } from 'react'

// ❌ Incorrect - will cause build errors
import { useState, ChangeEvent, FormEvent } from 'react'
```

## Current Status
✅ Basic Vite + React + TypeScript setup
✅ PDF upload modal with inline CSS
✅ API service layer with axios
✅ Test pages for isolated feature testing
✅ Navigation system (state-based, no router)
✅ Production build working (type-only imports configured)
✅ API integration complete with react-markdown rendering
✅ Error handling and loading states implemented
✅ Light mode only CSS configuration

## Next Steps
1. Integrate modal with API (combine ModalTestPage + ApiTestPage functionality)
2. Create main production page with full workflow
3. Add file upload progress indicator
4. Implement custom prompt and max tokens input fields
5. Add result export/download functionality
