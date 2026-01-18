# Enhanced Todos - Features Documentation

## Overview
This document describes the enhanced features added to the task application, particularly focusing on the selection functionality, Kanban board view, and UI improvements.

## Added Features

### 1. Task Selection Functionality

#### Left-side Selection Checkbox
- A checkbox has been added to the left side of each task item, next to the drag-and-drop handle
- This checkbox is only visible when the filter is set to 'all' (`filter === 'all'`)
- It operates independently of the completion status of the task
- When unchecked, displays an empty gray checkbox with rounded corners
- When checked, displays a filled blue checkbox with a white checkmark inside
- Allows users to select specific tasks for batch operations

#### Select All Button
- A "Select all" button has been added to the TaskList component
- The button is positioned below the "Tasks List" header
- When clicked:
  - If all visible tasks are already selected → clears all selections
  - If not all visible tasks are selected → selects all visible tasks
- The button text dynamically changes based on the selection state:
  - Shows "Select all" when not all items are selected
  - Shows "Clear all" when all items are selected
- The button only affects currently visible tasks based on the active filter (all/active/completed)

#### Context Management
- Selection state is managed globally in the todo context
- The `selectedIds` array tracks IDs of all selected tasks
- Functions added to the context:
  - `setSelectedIds(ids: string[])`: Sets the selected IDs array
  - `selectAllTodos()`: Selects all tasks in the list
  - `clearSelectedTodos()`: Clears all selections
  - `removeSelectedTodos()`: Removes all selected tasks
  - `setCompletedForSelected(completed: boolean)`: Sets completion status for all selected tasks
- Selection state persists using sessionStorage

### 2. Mass Operations
- Added buttons for mass operations on selected tasks:
  - "Delete" button: Deletes all selected tasks
  - "Complete" button: Marks all selected tasks as completed
  - "Active" button: Marks all selected tasks as active (not completed)
- Buttons appear only when at least one task is selected
- Buttons show the count of selected tasks in the delete button label
- Mass operation buttons are encapsulated in a separate MassActions component
- Buttons have responsive design with minimum widths for better mobile experience

### 3. Component Architecture

#### MassActions Component
- Dedicated component for handling mass operations on selected todos
- Contains buttons for "Delete", "Complete", and "Active" operations
- Only renders when at least one todo is selected
- Receives selected count as a prop and accesses todo operations via context
- Located at the top panel of the TodoList component
- Includes responsive design with minimum widths for better mobile experience
### 3. UI Improvements

#### Task List Height Management
- The TaskList component now has a maximum height calculated as `calc(100vh - 151px)`
- This accounts for the height of the AddTask and SearchTasks components above it
- Vertical scrolling is enabled when the content exceeds the available space
- This ensures the interface remains usable regardless of screen size
- A scroll hint indicator ("↑↓ Scroll") appears in the bottom-right corner when scrolling is available


#### Visual Design
- Left-side checkboxes use SVG elements with rounded corners for visual consistency
- Proper hover states and visual feedback implemented
- Color scheme follows the existing design language (blue for selected, gray for unselected)

## Technical Implementation

### Component Changes

#### Task Component
- Added local state management for individual task selection
- Implemented the left-side checkbox with SVG graphics
- Connected to global selection state via context API
- Added handler function for selection toggling

#### TaskList Component
- Added "Select all" button with dynamic labeling
- Implemented logic to determine selection state
- Applied max-height and overflow properties for scroll management

#### Context Updates
- Extended the TodoContext with selection-related functions
- Added persistence for selection state using sessionStorage
- Maintained data integrity when todos are added/removed

#### MassActions Component
- Created a dedicated component for mass operation buttons
- Separates concerns by isolating mass operation UI and logic
- Makes the TaskList component cleaner and more maintainable

#### FilterDropdown Component
- Dropdown menu for selecting todo filters (All, Active, Completed)
- Features smooth opacity animations for showing/hiding (fadeIn/fadeOut)
- Includes visual feedback with blue border and text when dropdown is open
- Individual filter items have dedicated event handlers for improved performance
- Only the todo list area scrolls while header and filter controls remain fixed
## Usage Examples

### Selecting Tasks
1. View the task list (ensure filter is set to 'all')
2. Click the checkbox next to any task to select it
3. Selected tasks will show a filled blue checkbox with white checkmark
4. Use the "Select all" button to quickly select all visible tasks

### Clearing Selections
1. When all visible tasks are selected, the button label changes to "Clear all"
2. Click the button to deselect all tasks
3. Alternatively, click "Select all" button again when partially selected to select all, then click again to clear all

## Behavior Notes

- Selection state is independent of completion state
- When a task is deleted, its ID is automatically removed from selectedIds
- Selections persist across page refreshes
- The "Select all" button only affects currently visible tasks based on the active filter


## Custom Hooks

### useTodoDnD Hook
- Provides drag-and-drop functionality for todo items
- Includes two sub-functions:
  - `useTodoItemDnD`: Handles individual todo item dragging behavior
  - `useTodoMonitor`: Monitors drag events and handles reordering
- Only active when filter is set to 'all'
- Provides visual indicators during drag operations (highlighted edges)
- Enables reordering of todos by dragging them to new positions

### useClickOutside Hook
- Detects clicks outside of a specified DOM element
- Used primarily for closing dropdown menus and modals
- Supports both mouse and touch events
- Helps maintain clean UI interactions by automatically closing components when users click elsewhere
## Interactions with Other Components

### With Add Task Component
- Newly added tasks are not automatically selected
- Adding a new task does not affect existing selections
- The "Select all" button will include newly added tasks in the selection

### With Search Component
- Filtering by search term affects which tasks are displayed
- The "Select all" button only selects currently visible tasks based on search results
- Selected tasks remain selected even when search terms change
- Mass operations (delete, set completed/active) only affect currently visible selected tasks

### With Filter Component
- Changing filters affects which tasks are displayed
- The "Select all" button only selects tasks in the currently active filter (all/active/completed)
- Selections persist when switching between filters
- Mass operations only affect tasks in the current filter scope

### With Task Item Components
- Individual task checkboxes operate independently of bulk selection
- Clicking a task's completion checkbox (right-side CircleCheck) only affects that specific task's completion status
- Clicking the selection checkbox (left-side) only affects selection state, not completion state
- Deleting a task individually (trash icon) removes only that specific task
- Individual completion and deletion operations do not affect the selection state
- Clicking on the task text initiates inline editing mode
- When editing, a text input field appears allowing modification of the task title
- Editing does not affect selection or completion state


### With Mass Operation Buttons (Top Panel)
- "Complete" button: Changes completion status to completed for all selected tasks
- "Active" button: Changes completion status to active (not completed) for all selected tasks
- "Delete" button: Removes all selected tasks at once
- After mass deletion, selection state is cleared
- Mass operations only affect currently selected tasks
- Mass operation buttons are now part of the MassActions component
- Buttons have responsive design with minimum widths for better mobile experience

### With Kanban Board View
- Tasks can be viewed in a traditional list view or in a Kanban board view
- Kanban board consists of customizable columns (e.g., "To Do", "In Progress", "Done")
- Tasks can be moved between columns via drag and drop
- Each column has its own list of tasks
- The same selection functionality works in both views
- Mass operations work across all columns in Kanban view
- The application maintains the same filtering and search capabilities in both views
- Columns can be customized with different titles and configurations
- Tasks maintain their state and properties when moved between columns