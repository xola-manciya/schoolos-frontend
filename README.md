# SchoolOS Frontend

Modern React + TypeScript frontend for SchoolOS - A comprehensive school management system.

## Features

- ⚡ Built with Vite for fast development
- 🎨 Tailwind CSS for beautiful UI
- 📱 Fully responsive design
- 🔐 JWT authentication with refresh tokens
- 📊 Interactive dashboards for different roles
- 📄 Invoice viewing and exporting
- 👥 Student and staff management
- 💳 Payment tracking and history

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Setup

### 1. Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### 2. Installation

```bash
# Install dependencies
pnpm install
# or: npm install

# Copy environment file
cp .env.example .env
# Edit .env with your API URL

# Run development server
pnpm dev
# or: npm run dev
```

### 3. Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

For production:

```env
VITE_API_URL=https://your-backend.railway.app
```

## Build

```bash
# Production build
pnpm build

# Preview production build
pnpm preview
```

## Deployment

### Cloudflare Pages

1. **Connect Repository:**
   - Go to Cloudflare dashboard → Pages
   - Create new project
   - Connect GitHub repository

2. **Build Settings:**
   - Framework preset: Vite
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: `/` (or frontend folder)

3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

4. **Custom Domain:**
   - Add `schoolos.co.za` in Cloudflare Pages settings
   - DNS is automatically configured

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities (API client)
│   ├── store/         # Zustand stores
│   ├── types/         # TypeScript types
│   └── App.tsx        # Main app component
├── public/            # Static assets
└── index.html         # HTML template
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Roles & Access

- **Principal:** Full access to all features
- **Admin:** Manage staff, students, finances
- **Teacher:** View students, classes, attendance
- **Accountant:** Manage payments, invoices
- **Support:** Basic access to help users

## License

Proprietary - SchoolOS (Pty) Ltd
