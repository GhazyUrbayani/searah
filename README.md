# seArah 🔍

<!-- HEADER -->
<div align="center">

  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.herokuapp.com/?font=Poppins+Code&size=24&pause=1000&color=00BFFF&center=true&vCenter=true&width=600&lines=SeArah+-+Full-Stack+Web+App;React+%2B+TypeScript+%2B+Express.js;Real-time+%7C+Drizzle+ORM+%7C+SQLite" alt="Typing SVG">
  </a>

  <p>
    <em>
      A modern full-stack monorepo application built with React, TypeScript, and Express.js -
      featuring real-time WebSocket communication, Drizzle ORM, and seamless Vercel deployment.
    </em>
  </p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## About

**Searah** is a full-stack monorepo web application with a unified codebase for both frontend and backend. The client is powered by React 18 + Vite + TypeScript with Radix UI components and TanStack Query, while the server runs on Express.js 5 with Drizzle ORM over SQLite. Real-time features are handled via native WebSocket (`ws`). The entire project is deployable to Vercel with a single configuration.

---

## ✨ Features

- ⚛️ **React 18 + Vite** - Lightning-fast frontend with hot module replacement
- 🔒 **Authentication** - Session-based auth with Passport.js (local strategy)
- 🗄️ **Database** - Drizzle ORM with SQLite (`better-sqlite3`) for lightweight persistence
- 🔄 **Real-time** - WebSocket integration via `ws` for live updates
- 🎨 **UI Components** - Full Radix UI + shadcn/ui component library with Tailwind CSS
- 📦 **Monorepo** - Shared `shared/` directory for types and schemas used across client & server
- 🌐 **Vercel Deploy** - Ready-to-deploy with `vercel.json` configuration
- 📊 **Data Viz** - Recharts integration for charts and analytics
- 🧩 **Form Handling** - React Hook Form + Zod validation

---

## 🛠 Tech Stack

<div align="center">

  <table>
    <tr>
      <th>Layer</th>
      <th>Technology</th>
    </tr>
    <tr>
      <td><b>Frontend</b></td>
      <td>React 18, TypeScript, Vite, Wouter (routing), TanStack Query</td>
    </tr>
    <tr>
      <td><b>UI</b></td>
      <td>Tailwind CSS v3, Radix UI, shadcn/ui, Framer Motion, Lucide React</td>
    </tr>
    <tr>
      <td><b>Backend</b></td>
      <td>Express.js 5, TypeScript (tsx), Passport.js, WebSocket (ws)</td>
    </tr>
    <tr>
      <td><b>Database</b></td>
      <td>SQLite (better-sqlite3), Drizzle ORM, Drizzle Kit, Zod</td>
    </tr>
    <tr>
      <td><b>Build & Deploy</b></td>
      <td>Vite, esbuild, Vercel</td>
    </tr>
  </table>

</div>

---

## 📁 Project Structure

```
searah/
├── client/ # Frontend source (React + Vite)
├── server/ # Backend source (Express.js)
│ ├── index.ts # Server entry point
│ ├── routes.ts # API route definitions
│ ├── storage.ts # Data access layer (Drizzle)
│ ├── static.ts # Static file serving
│ └── vite.ts # Vite dev middleware
├── shared/ # Shared types & schemas (client + server)
├── api/ # Vercel serverless functions
├── dist/ # Production build output
├── script/ # Build scripts
├── drizzle.config.ts # Drizzle ORM configuration
├── vite.config.ts # Vite configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── vercel.json # Vercel deployment config
├── tsconfig.json
└── package.json
```
---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/GhazyUrbayani/searah.git
cd searah
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup the Database

```bash
npm run db:push
```

### 4. Run in Development Mode

```bash
npm run dev
```

> App runs on `http://localhost:5000` (Express serves both API and frontend via Vite middleware)

---

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production (client + server) |
| `npm start` | Run production build |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push Drizzle schema to SQLite database |

---

## 🤝 Contributing

1. Fork this repository
2. Create your feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

<div align="center">
  <strong>Built with ❤️ by <a href="https://github.com/GhazyUrbayani">GhazyUrbayani</a> 🚀</strong>
</div>
