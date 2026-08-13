# CodeAlpha_AppDevelopment

A collection of three React apps built as part of an app development task list:

| Task | App | Description |
|------|-----|-------------|
| 1 | **Flashcard Quiz App** | Study flashcards with a flip-to-reveal answer, plus add/edit/delete support. |
| 2 | **Random Quote Generator** | Shows a random quote on load, with a button to fetch a new one. |
| 3 | **Fitness Tracker** | Logs daily steps and workouts, with a dashboard of progress bars and a 7-day chart. |

All three are built with [React](https://react.dev/) and [Vite](https://vitejs.dev/), and share a dark, minimalist UI theme.

---

## Prerequisites

Before doing anything else, make sure these are installed on your machine:

- **[Node.js](https://nodejs.org/)** (LTS version) — this includes `npm`, which is used to install dependencies and run the project. Without this, none of the commands below will work.
- **[Git](https://git-scm.com/downloads)** — only needed if you're cloning this repo from GitHub rather than downloading it as a ZIP.
- A code editor such as **[VS Code](https://code.visualstudio.com/)** (optional, but recommended).

Check they're installed by running:
```bash
node -v
npm -v
git -v
```
Each should print a version number. If any command says "not found," install that tool and restart your terminal.

---

## Getting the code

**Option A — clone with Git:**
```bash
git clone https://github.com/yourusername/CodeAlpha_tasks.git
cd CodeAlpha_tasks
```
This downloads the full project, including its Git history, into a new `CodeAlpha_tasks` folder and moves you into it.

**Option B — download as ZIP:**
On the repo's GitHub page, click **Code → Download ZIP**, extract it, then open a terminal inside the extracted folder.

---

## Step-by-step setup (what each command does)

Run these once, in order, from inside the project folder:

```bash
npm install
```
Reads `package.json` and downloads all the libraries the project depends on (React, Vite, Recharts, etc.) into a local `node_modules` folder. This has to run once before anything else will work — the apps import these libraries and won't run without them.

```bash
npm install recharts
```
Only needed if `recharts` isn't already listed in `package.json`. `recharts` is the charting library the Fitness Tracker uses for its weekly bar chart. If `npm install` above already pulled it in (check `package.json` — it should be listed under `"dependencies"`), you can skip this.

---

## Running the project

There are two ways to view the apps: one at a time, or all three together with a switcher menu.

### Option 1: Run all three at once (recommended)

Open `src/App.jsx` and replace its contents with:

```jsx
import { useState } from "react";
import FlashcardQuizApp from "./flashcard-quiz-app-dark";
import RandomQuoteGenerator from "./random-quote-generator";
import FitnessTrackerApp from "./fitness-tracker-app";

function App() {
  const [active, setActive] = useState("flashcards");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: 12, background: "#1B1B1B" }}>
        <button onClick={() => setActive("flashcards")}>Flashcards</button>
        <button onClick={() => setActive("quotes")}>Quotes</button>
        <button onClick={() => setActive("fitness")}>Fitness</button>
      </div>

      {active === "flashcards" && <FlashcardQuizApp />}
      {active === "quotes" && <RandomQuoteGenerator />}
      {active === "fitness" && <FitnessTrackerApp />}
    </div>
  );
}

export default App;
```

**What this does:** it imports all three app components and keeps track of which one is "active" in a variable (`active`). The three buttons at the top update that variable when clicked, and only the matching app is displayed below. This gives you one running project with a menu to flip between all three tasks.

Then start the dev server:
```bash
npm run dev
```
This compiles the project and starts a local web server, printing a URL such as `http://localhost:5173`. Open that link in your browser to see the apps, with buttons at the top to switch between them. Leave this command running in the terminal while you're using the apps — closing it (Ctrl+C) stops the server.

### Option 2: Run each app individually

Instead of the switcher, open `src/App.jsx` and import just the one app you want to test.

**Flashcard Quiz App:**
```jsx
import FlashcardQuizApp from "./flashcard-quiz-app-dark";

function App() {
  return <FlashcardQuizApp />;
}

export default App;
```

**Random Quote Generator:**
```jsx
import RandomQuoteGenerator from "./random-quote-generator";

function App() {
  return <RandomQuoteGenerator />;
}

export default App;
```

**Fitness Tracker:**
```jsx
import FitnessTrackerApp from "./fitness-tracker-app";

function App() {
  return <FitnessTrackerApp />;
}

export default App;
```

**What this does:** `App.jsx` is the entry point Vite renders to the page — whatever component it returns is what shows up in the browser. Swapping the import and the returned component changes which single app is displayed.

Save the file after editing, then run:
```bash
npm run dev
```
Every time you edit and save `App.jsx` while the dev server is running, the browser refreshes automatically — no need to stop and restart `npm run dev` between swaps.

---

## Project structure

```
CodeAlpha_tasks/
├── src/
│   ├── App.jsx                       # Entry point — controls which app renders
│   ├── flashcard-quiz-app-dark.jsx   # Task 1: Flashcard Quiz App
│   ├── random-quote-generator.jsx    # Task 2: Random Quote Generator
│   ├── fitness-tracker-app.jsx       # Task 3: Fitness Tracker App
│   ├── main.jsx                      # Mounts App into the HTML page (rarely needs editing)
│   └── index.css                     # Global styles
├── index.html                        # The single HTML page the app is injected into
├── package.json                      # Lists dependencies and defines npm commands like "dev"
├── vite.config.js                    # Vite's build/dev server configuration
└── README.md
```

---

## Notes

- All three apps store their data in React state only (in-memory). Refreshing the page resets everything — there's no local storage or backend connected.
- Stopping the dev server: click into the terminal running `npm run dev` and press **Ctrl+C**.
- If port `5173` is already in use (e.g. another `npm run dev` still running elsewhere), Vite automatically tries `5174`, `5175`, etc. — check the terminal output for the exact URL it lands on.

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| `npm error ENOENT ... package.json` | Terminal isn't inside the project folder | Run `cd CodeAlpha_tasks` (or wherever `package.json` lives), then retry |
| `Failed to resolve import "./..."` | The imported file doesn't exist in `src/`, or the name doesn't match exactly | Check the filename in `src/` matches the import path exactly, including case |
| Blank white page, no error | JS error not shown as an overlay | Open browser DevTools (F12) → Console tab, and check for red errors |
| `500 Internal Server Error` | Syntax error in the file being compiled | Check the VS Code terminal running `npm run dev` for a detailed error message |
| Server responds on a different port than expected | Another dev server is already running on the default port | Check the terminal output for the actual URL, or close other running `npm run dev` sessions |
