 # Enhanced Todos
 
 Enhanced Todos is a modern, feature-rich todo list application built with React and TypeScript. This application provides an intuitive interface for managing your daily tasks with advanced functionality including filtering, search, drag-and-drop reordering, and persistent storage.
 
 ## Technologies Used
 
 - **React** - A JavaScript library for building user interfaces
 - **TypeScript** - A typed superset of JavaScript that compiles to plain JavaScript
 - **Vite** - A fast build tool for modern web projects
 - **Tailwind CSS** - A utility-first CSS framework for rapid UI development
 - **Lucide React** - A collection of beautiful SVG icons for React
 - **clsx** - A utility for constructing className strings conditionally
 - **tailwind-merge** - A utility for merging Tailwind CSS classes with conflict resolution
 - **@atlaskit/pragmatic-drag-and-drop** - A drag and drop toolkit for building accessible, robust drag and drop experiences

## Installation

To get started with Enhanced Todos, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd enhanced-todos
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   npm install
   ```

3. Start the development server:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the application.

## Available Scripts

In the project directory, you can run:

- `bun run dev` - Runs the app in development mode
- `bun run build` - Builds the app for production
- `bun run lint` - Lints the codebase
- `bun run preview` - Locally previews the production build
- `bun run format` - Formats the codebase with Prettier
- `bun run format:check` - Checks if the codebase is formatted correctly

## Features

- Add and delete todos
- Mark todos as complete/incomplete
- Search through todos
- Drag and drop to reorder todos
- Responsive design that works on all device sizes
- Local storage persistence to save your todos between sessions

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Todo/       # Individual todo item component
│   ├── TodoList/   # List of todo items component
│   └── TodoActions/ # Actions panel component
├── context/        # React context providers
├── utils/          # Utility functions
├── App.tsx         # Main application component
├── main.tsx        # Entry point of the application
└── index.css       # Global styles
```
