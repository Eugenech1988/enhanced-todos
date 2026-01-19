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
 
 ## Known Limitations
 
 - **@atlaskit/pragmatic-drag-and-drop**: This library does not support mobile devices. In the future, it will need to be replaced with a library that supports mobile drag-and-drop functionality.
 
 ## Future Enhancements
 
  For future improvements, consider implementing:
 
  - **Column Management**: Allow users to reorder columns by dragging and dropping, add new columns, and remove existing columns
  - **Framer Motion** - For smoother animations and transitions, especially for component appearance and removal
  - **GSAP** - For advanced "smart" background effects and complex animations
  - **shadcn/ui** - For enhanced component styling and additional UI components
  - **Zustand** - For more efficient state management as the application grows
 
 ## Why I Use Tailwind CSS
 
 I use Tailwind CSS because it enables rapid UI development with its utility-first approach. Instead of writing custom CSS, I can compose existing utility classes to build custom designs directly in JSX. This approach offers several advantages:
 
 - **Rapid Prototyping**: Build interfaces faster with ready-to-use utility classes
 - **Consistency**: Maintain consistent spacing, colors, and typography across the application
 - **Maintainability**: Reduce CSS bloat and eliminate unused styles
 - **Responsive Design**: Built-in responsive prefixes make mobile-first development easier
 - **Customization**: Configure design tokens to match brand guidelines
 
 ## Why I Control Inputs with Refs and State Actions
 
 In this application, I control inputs using refs and state actions rather than controlled components for specific reasons:
 
 - **Performance**: Using refs avoids re-rendering components on every keystroke, which improves performance for large lists
 - **Avoid Unnecessary Re-renders**: Input elements don't re-render on every keystroke, preventing performance degradation
 - **Flexibility**: Refs allow direct DOM manipulation when needed, providing more control over input behavior
 - **Debouncing**: I can easily implement debounced search functionality by accessing the input value via ref after a delay
 - **Cleaner State Management**: For search functionality, I update state only after user stops typing, reducing unnecessary state updates
## Why I Use Local Storage for Persistence

In this application, I chose to use localStorage for persisting todos between sessions for several important reasons:

- **Persistence**: Data remains available even after closing and reopening the browser
- **Browser Compatibility**: localStorage is supported across all modern browsers and provides a simple API
- **No Server Dependencies**: Allows the application to maintain state without requiring backend services
- **Performance**: Provides fast read/write operations for client-side data management
- **Cross-Tab Consistency**: Data is shared across all tabs and windows for the same origin

The choice of localStorage over sessionStorage is particularly important for a todo application because:
- **Permanent Storage**: Todos remain available between browser sessions and page reloads
- **Data Retention**: Users don't lose their tasks when they refresh the page or close the browser
- **Cross-Session Continuity**: Tasks persist across multiple browsing sessions until manually removed

This provides a better user experience by ensuring that users don't lose their tasks when they refresh the page or close the browser.

## Installation

To get started with Enhanced Todos, follow these steps:


 1. Clone the repository:
    ```bash
    git clone https://github.com/Eugenech1988/enhanced-todos.git
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
- `bun run preview` - Locally previews the production build
- `bun run format` - Formats the codebase with Prettier
- `bun run format:check` - Checks if the codebase is formatted correctly

## Features

- Add and delete tasks
- Mark tasks as complete/incomplete
- Search through tasks with highlighted search terms
- Filter tasks (All, Completed, Active)
- Drag and drop to reorder tasks (when viewing all tasks)
- Kanban board view with customizable columns
- Move tasks between columns via drag and drop
- Responsive design that works on all device sizes
- Local storage persistence to save your tasks between sessions
- Smooth animations for dropdown menus and transitions
- Fixed header with scrollable task list area
- Dedicated mass action buttons for selected tasks

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AddTask/          # Component for adding new tasks
│   ├── FilterDropdown/   # Component for filtering tasks
│   ├── SearchTasks/      # Component for searching tasks
│   ├── Task/             # Component for individual task items
│   ├── TaskList/         # Component for displaying the list of tasks
│   ├── KanbanBoard/      # Component for displaying tasks in Kanban style
│   ├── Column/           # Component for Kanban columns
│   └── MassActions/      # Component for mass operations on selected tasks
├── context/              # React context providers
├── docs/                 # Documentation files
│   └── features.md       # Detailed documentation of features and functionality
├── hooks/                # Custom React hooks (e.g., drag-and-drop functionality)
├── utils/                # Utility functions
├── constants/            # Application constants
├── App.tsx               # Main application component
├── main.tsx              # Entry point of the application
└── index.css             # Global styles
```
