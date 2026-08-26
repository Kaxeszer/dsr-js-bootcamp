# DSR JS Bootcamp 2026

Personal project by **Luís Pereira (Kaxeszer)** for the DSR JavaScript Bootcamp (HTML, CSS, JavaScript, TypeScript, React).

Built with Vite + React + TypeScript.

## Tech Stack

- React
- TypeScript
- Vite
- ESLint
- React Router DOM
- MUI (Material UI)
- json-server (mock API)

## Backend

This project connects to [task-board-api](https://github.com/koshkinoko-hana/task-board-api) (NestJS + Prisma + SQLite), run locally for authentication.

## Progress Log

### Week 1

**L1, React basics & TypeScript**
- Initialized Vite + React + TypeScript project
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

**L3, Context: Authentication, Theming, Dashboard Task Management**
- Implemented AuthContext with login, logout and access token, plus a useAuth hook
- Login form (username + password), token simulated and stored in localStorage
- Conditional rendering of Login/Dashboard based on authentication state, using a protected route
- Implemented ThemeContext with light/dark themes via CSS custom properties, selected at build time through .env
- Dashboard shares the same task data (mock API) as the Tasks page: Tasks is the read/search view, Dashboard is the full CRUD management view (create, update completed status, delete)
- Created a reusable useApiTasks hook encapsulating all task operations against the mock API
- Created a reusable useDebouncedValue hook, used for debounced task search (300ms, case-insensitive substring match)

**L4, Backend integration**
- Deployed the task-board-api backend locally, following the provided setup instructions
- Configured VITE_API_BASE_URL for development and production environments
- Removed .env from version control, added .env.example as a template
- Updated domain types (User, LoginResponse) to match the real API response shape (nickname, role)
- Replaced the mocked API client with real fetch calls to /auth/login and /tasks
- Replaced mock authentication in AuthContext with real backend authentication
- Login form now uses nickname/password matching the backend contract, with error handling for invalid credentials
- Real access token is stored in localStorage and used for authenticated requests; cleared on logout

### Advisor Feedback

Following review of L1/L2, the advisor suggested:
- Adding navigation to the Header instead of typing URLs manually
- Moving BrowserRouter to main.tsx for a cleaner architecture
- Using a mock API tool (e.g. Mockoon) instead of hardcoded mock data
- Optionally using a UI library (MUI, Ant Design or Bootstrap) to save time on CSS

All four points were addressed and propagated across L1 → L2 → L3 → L4 → main.

---

## Getting Started

```bash
npm install
npm run dev
```

Requires the [task-board-api](https://github.com/koshkinoko-hana/task-board-api) backend running locally on port 3000, and the mock API running locally on port 3001 (`npm run mock-api`).