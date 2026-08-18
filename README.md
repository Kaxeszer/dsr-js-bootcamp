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

---

## Getting Started

```bash
npm install
npm run dev
```