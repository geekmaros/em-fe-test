# Evil Martians Login Page

A minimalist, accessibility-first login page implemented with React, TypeScript, and Vite. The page demonstrates UX polish, calm visual design, explicit validation flows, and a realistic mock authentication API.

## Getting Started

```bash
npm install
npm run dev
```

The dev server prints the local URL. Press `Ctrl+C` to stop it.

To ship a production build:

```bash
npm run build
```

The compiled assets land in `dist/`.

## How It Works

- **Form UX** - Real `<form>` element, native labels, logical tab order, Enter-to-submit, auto-focused email field, and password manager-friendly attributes.
- **Validation** - Email + password validations run on blur and submit. The first invalid field receives focus to help keyboard and screen-reader users recover quickly.
- **States + messaging** - Visual states for focus, typing, valid, invalid, submitting, success, and error. Server errors surface through a focusable, calm alert region.
- **Mock API** - `src/api/loginApi.ts` simulates latency (900-1400 ms) and outcomes: success, invalid credentials, rate limit, and offline errors. Valid credentials are `abdulrasaq@evilmartians.com` / `password123`.
- **Scenario toggles** - Append `?scenario=success|invalid|rate|network` to the URL to force a server response and demo each edge case.

## Project Structure

```
src/
  api/loginApi.ts        // Mock server contract + scenarios
  components/
    Button.tsx
    Field.tsx
    LoginPage.tsx        // Core UI + UX logic
  validators/index.ts    // Field-level validation helpers
  App.tsx / App.css      // Page shell + global styles
  main.tsx / index.css   // Vite entry + base resets
```

Everything is framework-standard React + CSS (no UI kits or form libraries) to keep the implementation lean, readable, and easy to extend.
