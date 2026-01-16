 # Enhanced Todos
   
 Enhanced Todos is a modern, feature-rich todo list application built with React and TypeScript. This application provides an intuitive interface for managing your daily tasks with advanced functionality including filtering, search, and persistent storage.
 
 ## Technologies Used
 
 - **React** - A JavaScript library for building user interfaces (including React Activity from React 19.2 for declarative UI state management)
 - **TypeScript** - A typed superset of JavaScript that compiles to plain JavaScript
 - **Vite** - A fast build tool for modern web projects
 - **Tailwind CSS** - A utility-first CSS framework for rapid UI development
 - **Lucide React** - A collection of beautiful SVG icons for React
 - **clsx** - A utility for constructing className strings conditionally
 - **tailwind-merge** - A utility for merging Tailwind CSS classes with conflict resolution
 - **@atlaskit/pragmatic-drag-and-drop** - A drag and drop toolkit for building accessible, robust drag and drop experiences

 ## Why I Use Tailwind CSS

 I use Tailwind CSS because it enables rapid UI development with its utility-first approach. Instead of writing custom CSS, I can compose existing utility classes to build custom designs directly in JSX. This approach offers several advantages:

 - **Rapid Prototyping**: Build interfaces faster with ready-to-use utility classes
 - **Consistency**: Maintain consistent spacing, colors, and typography across the application
 - **Maintainability**: Reduce CSS bloat and eliminate unused styles
 - **Responsive Design**: Built-in responsive prefixes make mobile-first development easier
 - **Customization**: Configure design tokens to match brand guidelines

 ## Why I Use React Activity from React 19.2
 
 React Activity was used to manage UI states declaratively, reduce conditional logic in JSX, and provide a scalable and predictable approach for complex UI flows.
 
 ## Why I Control Inputs with Refs and State Actions

 In this application, I control inputs using refs and state actions rather than controlled components for specific reasons:

 - **Performance**: Using refs avoids re-rendering components on every keystroke, which improves performance for large lists
 - **Avoid Unnecessary Re-renders**: Input elements don't re-render on every keystroke, preventing performance degradation
 - **Flexibility**: Refs allow direct DOM manipulation when needed, providing more control over input behavior
 - **Debouncing**: I can easily implement debounced search functionality by accessing the input value via ref after a delay
 - **Cleaner State Management**: For search functionality, I update state only after user stops typing, reducing unnecessary state updates
## Why I Use Session Storage for Persistence

In this application, I chose to use sessionStorage for persisting todos between sessions for several important reasons:

- **Session-Based Storage**: Data persists throughout the browser tab session and is cleared when the tab is closed, which is ideal for temporary task management
- **Automatic Cleanup**: Unlike localStorage, data doesn't remain indefinitely, which prevents accumulation of old tasks that are no longer relevant
- **Security**: Data is isolated to the specific browser tab and doesn't persist across different tabs or browser sessions
- **Browser Compatibility**: sessionStorage is supported across all modern browsers and provides a simple API
- **No Server Dependencies**: Allows the application to maintain state without requiring backend services
- **Performance**: Provides fast read/write operations for client-side data management

While localStorage would provide permanent storage, sessionStorage strikes the right balance between persistence and automatic cleanup for a todo application.

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
 - Responsive design that works on all device sizes
 - Session storage persistence to save your todos between sessions
 - Dynamic imports for optimized loading (where beneficial)
 
 ## Project Structure
 
 ```
 src/
 ├── components/     # Project components
 ├── context/        # React context providers
 ├── utils/          # Utility functions
 ├── App.tsx         # Main application component
 ├── main.tsx        # Entry point of the application
 └── index.css       # Global styles
 ```

 ## Dynamic Imports Analysis

 After analyzing the project structure, I determined that dynamic imports are not strictly necessary for this application due to its small size and simple architecture. All components load simultaneously and are used on a single screen. However, dynamic imports could be beneficial in the future when:

 - Adding routing functionality between different pages
 - Integrating heavy libraries or components
 - Implementing lazy loading for performance optimization

 For the current state of the application, static imports are sufficient and maintain simplicity while keeping bundle size reasonable.
