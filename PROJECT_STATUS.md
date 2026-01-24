# Project Status & Source of Truth

> **Last Updated:** January 2026
> **Version:** 1.0.0
> **Status:** 🟢 Stable / Maintenance

## 📊 Project Status Dashboard

| Metric | Status | Details |
| :--- | :--- | :--- |
| **Build Health** | 🟢 Passing | Standard `react-scripts` build |
| **Deployment** | 🟢 Active | GitHub Pages (Manual/Action) |
| **Tech Stack** | React 19, CSS3 | Zero-dependency runtime (mostly) |
| **Data Source** | Flat-file (.txt) | Custom Regex Parsing Engine |
| **Test Coverage** | 🔴 Low | Basic rendering tests only |

---

## 1. Identity & Mission Audit

### Core Purpose (North Star)
To provide a **zero-maintenance, high-performance personal portfolio platform** that allows developers to manage content via simple text files without touching the codebase, combining the simplicity of Markdown with the power of React.

### Value Proposition
Unlike static HTML templates (hard to update) or headless CMS solutions (overkill/expensive), Antigravity (this project) allows users to update their live portfolio by simply editing a `projects.txt` file in the repository. It solves the "Stale Portfolio Syndrome" by making updates as easy as writing a notepad entry.

### Stakeholder Mapping
*   **Owner (Developer/User)**:
    *   *Goal*: Showcase skills/experience with minimal friction.
    *   *Metric*: Time-to-update (aiming for < 5 mins).
*   **Visitor (Recruiter/Client)**:
    *   *Goal*: Quickly assess competence and fit.
    *   *Metric*: Load speed, information clarity, mobile responsiveness.

---

## 2. Technical & Environmental Context

### Component Architecture
The application follows a **Domain-Based Component Structure** rather than strict Atomic Design. Each major resume section is a self-contained module.

```text
src/
├── components/          # Domain Modules
│   ├── Personal/        # Hero section (first fold)
│   ├── Education/       # Timeline visualization
│   ├── Projects/        # Grid/Card layout
│   └── ...
├── utils/               # Shared Logic
│   └── analytics.js     # GA & Custom interaction tracking
└── App.js               # Layout Orchestrator & Global State
```

### State Management Strategy
*   **Global Layout State**: Managed in `App.js` via `useState`. Handles the *visibility* and *ordering* of sections based on metadata checks.
*   **Local Content State**: Each component (e.g., `Education.js`) manages its own data fetching and parsing state. This decentralization isolates errors (e.g., if Projects fail to load, Education still works).
*   **Theme State**: Lifted to `App.js` but reflected in DOM via `data-theme` attribute for CSS variables.

### Data Fetching & API Layer
*   **Protocol**: Client-side HTTP `fetch()` requests to relative paths (e.g., `/education.txt`).
*   **Parsing Engine**: Custom Regex-based parser in each component.
    *   *Pros*: Zero backend, hosted on any static server.
    *   *Cons*: Brittle standard (requires strict `[Key]: Value` formatting).
*   **Caching**: Relies on browser HTTP cache; no application-level caching implemented.

### Styling & UI Framework
*   **Strategy**: Vanilla CSS with CSS Variables (Custom Properties) for theming.
*   **Theme System**: `index.css` defines `--primary-color`, `--background`, etc., which are toggled by the root `data-theme` attribute.
*   **Responsive**: Media queries attached to component CSS files (Mobile First approach).

### Performance Benchmarks
*   **Critical Path**: Parallel fetching of 5-6 text files on load.
*   **Bundle Size**: Moderate (standard React bundle).
*   **Rendering**: Low overhead; mostly static content once loaded.

---

## 3. Functional Documentation

### Feature Inventory
| Feature | Status | Type | Description |
| :--- | :--- | :--- | :--- |
| **Dynamic Content** | 🟢 Live | Core | Loads content from `.txt` files |
| **Theme Toggle** | 🟢 Live | UI | Dark/Light mode switcher |
| **Section Ordering** | 🟢 Live | UX | Reorder sections via `[Order]` tag in text files |
| **Analytics** | 🟢 Live | Logic | Scroll depth & time-on-site tracking |
| **Mobile Menu** | 🟡 In-Dev | UI | Better hamburger menu for mobile |
| **Schema Validation** | 🔴 Missing | Core | No error handling for bad `.txt` syntax |

### Logic Flow (The Rendering Loop)
1.  **Boot**: `App.js` mounts.
2.  **Config Fetch**: `loadSectionOrder` probes all known text files to extract `[Title]` and `[Order]`.
3.  **Layout**: `App.js` sorts sections and renders the component tree.
4.  **Hydration**: Each child component (e.g., `<Projects />`) triggers its own `useEffect` to fetch the full `.txt` content.
5.  **Parsing**: Component parses regex matches (`[Content]...`) and updates local state.
6.  **Paint**: Content appears.

### Error Taxonomy
*   **Parsing Failures**: If a user misses a newline or colon in `.txt`, the Regex may fail silently or produce empty entries.
    *   *Current Handling*: `console.error` only. UI might show empty boxes.
*   **Network 404**: If a file is deleted.
    *   *Current Handling*: Component catches error and renders nothing (or empty container).

---

## 4. Strategic Roadmap

### Immediate Priorities (Next 3 Milestones)
1.  **Resilience**: Implement **Error Boundaries** and a "Fallback State" if text parsing fails (e.g., show a friendly error message instead of a blank space).
2.  **SEO Optimization**: Implement `react-helmet` to dynamically update `<title>` and `<meta>` description based on `personal.txt` content.
3.  **Type Safety**: Migrate core parsing logic to TypeScript interfaces to prevent runtime crashes during parsing.

### Scalability Path
*   **Complexity**: If data structure becomes too complex for `Key: Value` text pairs, migrate specific sections to JSON (e.g., `projects.json`) while keeping simple text for bio.
*   **Volume**: Implement code-splitting (`React.lazy`) for heavy components if the portfolio grows large (e.g., high-res image galleries).

### Self-Correction Protocol
*   **Monthly Audit**: Review `npm audit` and update dependencies.
*   **Documentation Sync**: Update this `PROJECT_STATUS.md` whenever a new "Module" (component) is added.

---

## 5. Strategic Persona & Conversion

### Target Audience A: Recruiters
*   **Strategy**: "The Engineer's Portfolio".
*   **Key Highlight**: Emphasize that this site itself is an engineering project. "I built a custom flat-file CMS parsing engine in React just to host this resume."
*   **Call to Action**: "View Source Code" (prominent link to GitHub).

### Target Audience B: Freelance Clients
*   **Strategy**: "I Build Fast, Maintainable Webs."
*   **Key Highlight**: Focus on the **speed** and **dark mode** implementation. "If I can make a simple resume look this good and load this fast, imagine what I can do for your SaaS dashboard."
*   **Call to Action**: "Available for Contract - [Email Me]" button in the Hero section.
