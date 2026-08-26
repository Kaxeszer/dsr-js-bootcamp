# DSR JS Bootcamp 2026

Personal project by **Luís Pereira (Kaxeszer)** for the DSR JavaScript Bootcamp (HTML, CSS, JavaScript, TypeScript, React).

Built with Vite + React + TypeScript.

## Tech Stack

- React
- TypeScript
- Vite
- ESLint
- React Router DOM

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

**L3, Context: Authentication, Theming, Local Task Management**
- Implemented AuthContext with login, logout and access token, plus a useAuth hook
- Login form (username + password), token simulated and stored in localStorage
- Conditional rendering of Login/Dashboard based on authentication state, using a protected route
- Implemented ThemeContext with light/dark themes via CSS custom properties, selected at build time through .env
- Added task management to the Dashboard: create, read, update (completed status) and delete
- Persisted tasks in localStorage, synced with React state via useEffect
- Created a reusable useLocalTasks hook encapsulating all task operations
- Created a reusable useDebouncedValue hook, used for debounced task search (300ms, case-insensitive substring match)

---

## Getting Started

```bash
npm install
npm run dev
```