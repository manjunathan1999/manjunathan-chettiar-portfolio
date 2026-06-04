# Manjunathan Chettiar Portfolio

An interactive developer portfolio for **Manjunathan Chettiar**, a Back-end Software Engineer focused on Python, FastAPI, Django, Celery, SQL, AI integrations, microservices, and scalable data pipelines.

The site is built as a retro terminal-inspired portfolio experience: a neo-brutalist visual system, animated Matrix-style hero, conversational command-line interface, 3D WebGL render panel, technical project sections, writing cards, and contact flow.

## Highlights

- Interactive terminal with portfolio commands such as `help`, `about`, `skills`, `projects`, `experience`, `contact`, `theme`, `matrix`, and `play`.
- Terminal quick commands, command history navigation, autocomplete hints, boot animation, and synthesized Web Audio feedback.
- Retro terminal themes: default, cyber green, amber decay, and monochrome.
- Embedded Snake mini-game launched from the terminal with `play`, `snake`, or `game`.
- Matrix rain background in the hero and an additional terminal matrix overlay mode.
- 3D animated WebGL object built with React Three Fiber, Drei, and Three.js.
- Smooth page scrolling with Lenis and section navigation.
- Dark/light theme toggle with local storage persistence.
- Resume-driven content for experience, skills, projects, education, certifications, and contact details.
- Responsive layout with Tailwind CSS v4 and reusable UI primitives.

## Tech Stack

- **Framework:** React 19, Vite 6, TypeScript
- **Styling:** Tailwind CSS v4, custom CSS variables, neo-brutalist utility classes
- **Animation:** Motion for React, Lenis smooth scrolling
- **3D:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Icons:** Lucide React
- **Markdown:** React Markdown for blog-style content cards
- **Effects:** Canvas Confetti, Web Audio API, Matrix rain canvas effects
- **UI primitives:** Local shadcn-style components under `src/components/ui`

## Project Structure

```text
.
├── src
│   ├── App.tsx                 # Main page composition and section order
│   ├── constants.ts            # Resume, skills, projects, education, and contact data
│   ├── index.css               # Tailwind theme, global styles, terminal themes
│   ├── main.tsx                # React entry point
│   ├── components
│   │   ├── Hero.tsx            # Matrix hero, identity block, social links, terminal
│   │   ├── Terminal.tsx        # Interactive portfolio terminal
│   │   ├── BootLoader.tsx      # Terminal boot sequence
│   │   ├── TerminalSnake.tsx   # Snake mini-game overlay
│   │   ├── TerminalMatrixOverlay.tsx
│   │   ├── Hero3D.tsx          # React Three Fiber render panel
│   │   ├── Navbar.tsx          # Navigation, theme toggle, audio toggle, progress bar
│   │   ├── Experience.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   └── ui                  # Reusable UI components
│   └── lib
│       ├── audio.ts            # Synthesized terminal sounds
│       └── utils.ts            # Utility helpers
├── index.html
├── vite.config.ts
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
npm install
```

### Environment Variables

No environment variables are required for the current portfolio UI.

### Run Locally

```bash
npm run dev
```

The Vite dev server is configured to run on:

```text
http://localhost:3000
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Check

```bash
npm run type-check
```

This project uses `npm run type-check` for TypeScript checking and `npm run lint` for ESLint.

### Test

```bash
npm run test
```

### Format

```bash
npm run format
```

## Editing Portfolio Content

Most portfolio content is stored in `src/constants.ts`.

Update this file to change:

- Name, role, email, phone, and LinkedIn URL
- Professional summary
- Experience entries and achievements
- Skill categories
- Project cards and details
- Education history
- Certifications

The blog-style writing cards are currently defined inside `src/App.tsx` as the `blogPosts` array.

## Terminal Commands

The terminal is one of the main interaction surfaces of the portfolio.

Useful commands include:

```text
help                  Show available commands
ls                    List virtual portfolio files
cat about.txt         Read profile summary
cat skills.json       Read skills as JSON-style output
cat projects.md       Read project summaries
cat experience.md     Read work experience
cat contact.cfg       Read contact details
about / whoami        Show profile information
skills                Show technical stack
projects              Show portfolio projects
experience            Show work history
contact               Show contact channels
theme default         Reset terminal theme
theme cyber-green     Switch to green terminal theme
theme amber-decay     Switch to amber terminal theme
theme monochrome      Switch to black-and-white terminal theme
matrix [word]         Launch terminal matrix overlay
play / snake / game   Launch Snake mini-game
clear                 Clear terminal history
exit                  Print session close message
```

The terminal also supports natural prompts such as asking about skills, projects, experience, or contact information.

## Deployment

This is a static Vite React application. After running:

```bash
npm run build
```

deploy the generated `dist` directory to any static hosting provider such as Vercel, Netlify, Cloudflare Pages, GitHub Pages, or a static file server.

## CI/CD with Vercel

This repository includes a GitHub Actions workflow at `.github/workflows/vercel.yml`.

The pipeline runs on:

- Pull requests to `main`: type-checks, builds, and deploys a Vercel preview.
- Pushes to `main`: type-checks, builds, and deploys to Vercel production.

Add these secrets in GitHub under **Settings > Secrets and variables > Actions**:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

You can get them by linking the project with the Vercel CLI:

```bash
npx vercel login
npx vercel link
```

After linking, Vercel creates `.vercel/project.json`. Use its `orgId` and `projectId` values for the GitHub secrets, and create `VERCEL_TOKEN` from the Vercel dashboard under account tokens.

## Notes

- The contact form currently simulates submission in the browser and does not send messages to a backend service.
- Audio feedback is generated with the Web Audio API and can be muted from the navbar.
- Theme and audio preferences are persisted in browser local storage.
- GitHub graph and profile links point to `manjunathanchettiar2908`.
