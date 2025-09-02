# Day 88: AJAX, Fetch vs Axios, Interceptors & React Component Lifecycle (useEffect)

Goal: a single-file revision that lets students recall definitions, reasons, patterns, and code examples for AJAX, Fetch/axios, interceptors, and React lifecycle (mount/update/unmount) + useEffect usage.

---

## 1. What is AJAX?

- Definition: AJAX (Asynchronous JavaScript and XML) is the technique of making HTTP requests from the browser without a full page reload.
- Why use it:
  - Update UI dynamically (better UX).
  - Fetch/submit data in background.
  - Build SPAs that interact with server endpoints.
- If you don't use AJAX:
  - Full-page reloads for each server action.
  - Slower UX and loss of client-side state.
  - Harder to build interactive apps.

---

## 2. Fetch API vs axios

Summary:
- Fetch: built-in browser API. Promise-based. Minimal features (you handle JSON parsing, timeouts, etc.).
- axios: third-party library. Simplifies requests, auto JSON parsing, request cancellation, interceptors, default baseURL, easier error handling.

When to use:
- Use Fetch for small/simple needs or when avoiding extra dependencies.
- Use axios for production apps that need interceptors, globally configured clients, easier error/timeout handling and convenience.

Comparison (quick):
- JSON parsing: Fetch requires res.json(), axios returns parsed data at res.data.
- Interceptors: axios has built-in; Fetch needs wrapper functions/middleware.
- Cancel requests: Fetch uses AbortController; axios has cancel tokens (or AbortController in modern versions).
- Browser support: Fetch is widely supported (polyfill for older), axios works everywhere Fetch works.

Fetch example:
```javascript
// Fetch GET
fetch('/api/tasks')
  .then(res => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error(err));

// POST with fetch
fetch('/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New task' }),
})
  .then(r => r.json())
  .then(data => console.log(data));
```

axios example:
```javascript
import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 5000 });

api.get('/tasks')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));

api.post('/tasks', { title: 'New task' })
  .then(res => console.log(res.data));
```

---

## 3. Request & Response Interceptors (axios)

Purpose:
- Add auth tokens, default headers.
- Global error handling / retry logic / logging.
- Transform requests/responses centrally.

Where to add:
- Create an axios instance and attach interceptors in a single service file (e.g., src/services/api.js). Import this instance everywhere.

Example: create instance + interceptors + eject
```javascript
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000,
});

// Request interceptor: add auth token
const reqInterceptor = api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: central error handling
const resInterceptor = api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // handle auth error, redirect to login etc.
    }
    return Promise.reject(error);
  }
);

export function ejectInterceptors() {
  api.interceptors.request.eject(reqInterceptor);
  api.interceptors.response.eject(resInterceptor);
}

export default api;
```

Notes:
- For testing or component unmount cleanup you may eject interceptors.
- For global app behavior keep interceptors registered once (e.g., on app init).

Fetch "interceptors":
- No native interceptors. Wrap fetch in helper functions or use middleware to add headers / handle errors.

---

## 4. React Component Lifecycle (Functional components + useEffect)

Key phases:
- Mounting: component added to the DOM (initial render).
- Updating: component re-renders because props or state changed.
- Unmounting: component removed from the DOM (cleanup needed).

Sequence (simplified ASCII):
```
Mount
  render() -> DOM painted -> useEffect(() => { /* mount work */ }, [])
Update
  render() -> DOM updated -> useEffect(() => { /* after update */ }, [deps])
Unmount
  useEffect(() => { return () => { /* cleanup on unmount */ } }, [])
```

useEffect hook maps to lifecycle:
- componentDidMount: useEffect(fn, []) — run once after first render.
- componentDidUpdate: useEffect(fn, [dep1, dep2]) — run when listed deps change.
- componentWillUnmount: return cleanup function from useEffect.

Examples:

1) componentDidMount equivalent:
```javascript
useEffect(() => {
  // fetch data on mount
  fetchData();
}, []); // empty deps -> runs once
```

2) componentDidUpdate equivalent:
```javascript
useEffect(() => {
  // runs when `userId` changes
  fetchUser(userId);
}, [userId]);
```

3) componentWillUnmount cleanup (and abort fetch example):
```javascript
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/tasks', { signal: controller.signal })
    .then(r => r.json())
    .then(setTasks)
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });

  return () => {
    // runs on unmount -> cancel in-flight request
    controller.abort();
  };
}, []);
```

4) using axios with cleanup/eject interceptors (if added in component scope):
```javascript
useEffect(() => {
  const reqId = api.interceptors.request.use(...);
  const resId = api.interceptors.response.use(...);

  return () => {
    api.interceptors.request.eject(reqId);
    api.interceptors.response.eject(resId);
  };
}, []);
```

---

## 5. Practical patterns & recommendations

- Network requests:
  - Use axios for complex apps (interceptors, instance defaults).
  - Use Fetch + AbortController if you prefer native API and smaller bundle.
- Always handle errors and loading state: loading, success, error UI states.
- Cancel in-flight requests on unmount to avoid setting state on unmounted components.
- Keep API logic outside components: create service modules (api.js) and import them.
- Store auth tokens securely (avoid localStorage if security constraints demand better storage).
- Register global interceptors once at app startup, not repeatedly inside components unless necessary.

---

## 6. Cheatsheet — How to fetch safely in React (pattern)

- service/api.js (axios example)
```javascript
import axios from 'axios';
export default axios.create({ baseURL: '/api' });
```

- Component
```javascript
import api from './service/api';
import { useEffect, useState } from 'react';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/tasks')
      .then(res => { if (mounted) setTasks(res.data); })
      .catch(console.error)
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; }; // prevent setState on unmounted
  }, []);
}
```

Or with AbortController + fetch:
```javascript
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/tasks', { signal: controller.signal })
    .then(r => r.json())
    .then(setTasks)
    .catch(err => { if (err.name !== 'AbortError') console.error(err); });

  return () => controller.abort();
}, []);
```

---

## 7. Quick revision (bullet points)

- AJAX = async requests without page reload.
- Fetch: native, minimal; axios: feature-rich.
- Use axios interceptors for auth headers, error handling, logging.
- useEffect:
  - [] -> mount
  - [deps] -> run on deps change (update)
  - return cleanup -> unmount
- Cancel requests on unmount; avoid memory leaks / setState on unmounted components.
- Keep API logic in service modules and UI logic in components.

---

Study task:
- Convert a component fetch to axios using an api instance and add a request interceptor to attach a fake token.
- Add AbortController cleanup for a fetch request and confirm no warnings in console when navigating away.


<!-- Day 88 React -->
<!-- What is AJAX ? How to use AJAX ? What need to of AJAX ? what if I not use AJAX ?  -->
<!-- What is the link with AJAX with Fetch API & axios ? What is Fetch API and axios when to use it how to use it ? -->

<!-- What is request & response interceptor what it's work ? when to use request & response interceptor ? how to add request & response interceptor properly in workable ? -->

<!-- In React, "mounting" and "unmounting" and "update" what is this, How they each work ? -->
<!-- What is component Lifecycle in react ? what are the processes ? -->
<!-- What is useEffect hook ? what is the work of useEffect hook ? when to use useEffect hook ?  -->