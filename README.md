# DSR JS Bootcamp 2026

Personal project by **Luís Pereira (Kaxeszer)** for the DSR JavaScript Bootcamp (HTML, CSS, JavaScript, TypeScript, React).

Built with Webpack + React + TypeScript.

## Tech Stack

- React
- TypeScript
- Webpack
- ESLint
- React Router DOM

## Backend

This project connects to [task-board-api](https://github.com/koshkinoko-hana/task-board-api) (NestJS + Prisma + SQLite), run locally for authentication.

## Progress Log

### Week 1

**L1, React basics & TypeScript**
- Initialized Vite + React + TypeScript project (later migrated to Webpack)
- Cleaned up boilerplate
- Built SPA skeleton: Header, Login/Register/Tasks pages
- Added routing with React Router DOM
- Moved domain types (User, Task, AuthTokens) into types.ts
- Added a minimal API client with stub functions and mocked Promises
- Built a task creation form using useState (title + deadline)

**L2, Virtual DOM, Fiber**
- Replaced mock list with a generated list of 100 tasks
- Added client-side search/filter by title, with debounce (300ms)
- Fixed anti-pattern: callbacks recreated on every render, replaced with useCallback
- Fixed anti-pattern: expensive filtering computation on every render, replaced with useMemo
- Confirmed stable keys (task.id) instead of array index

### Week 2

**L3, Context: Authentication, Theming, Local Task Management**
- Implemented AuthContext with login, logout and access token, plus a useAuth hook
- Login form (username + password), token simulated and stored in localStorage
- Conditional rendering of Login/Dashboard based on authentication state, using a protected route
- Implemented ThemeContext with light/dark themes via CSS custom properties, selected at build time through .env
- Added task management to the Dashboard: create, read, update (completed status) and delete
- Persisted tasks in localStorage, synced with React state via useEffect
- Created a reusable useLocalTasks hook encapsulating all task operations
- Created a reusable useDebouncedValue hook, used for debounced task search (300ms, case-insensitive substring match)

**L4, Backend integration**
- Deployed the task-board-api backend locally, following the provided setup instructions
- Configured API_BASE_URL for development and production environments
- Removed .env from version control, added .env.example as a template
- Updated domain types (User, LoginResponse) to match the real API response shape (nickname, role)
- Replaced the mocked API client with real fetch calls to /auth/login and /tasks
- Replaced mock authentication in AuthContext with real backend authentication
- Login form now uses nickname/password matching the backend contract, with error handling for invalid credentials
- Real access token is stored in localStorage and used for authenticated requests; cleared on logout

### Experiment: Webpack Playground

**Branch:** `experiments/webpack-playground` (not merged into main)

Rewrote the Vite build configuration to use Webpack instead, preserving all functionality from previous phases (authentication, theming, task management).

- Replaced `vite.config.ts` with a custom `webpack.config.js` (ES Module syntax)
- Configured Babel (`@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`) to transpile TypeScript/JSX, replacing Vite's built-in transform
- Configured `html-webpack-plugin` to generate `index.html` with injected scripts
- Configured `style-loader` and `css-loader` to handle CSS imports
- Set up `webpack-dev-server` with `historyApiFallback` for React Router support
- Replaced Vite's `import.meta.env` with `process.env`, using `dotenv` and Webpack's `DefinePlugin` to inject environment variables at build time
- Renamed environment variables from `VITE_*` to plain names (`API_BASE_URL`, `APP_THEME`), since the `VITE_` prefix is Vite-specific and no longer relevant
- Updated `tsconfig.app.json` to use Node types instead of `vite/client` types
- Verified full functionality: authentication, theme switching, task CRUD operations and search all work identically to the Vite version

Dev server runs on port 5174 (`npm run dev`), production build outputs to `dist-webpack` (`npm run build`).

---

## Getting Started

```bash
npm install
npm run dev
```

Requires the [task-board-api](https://github.com/koshkinoko-hana/task-board-api) backend running locally on port 3000.