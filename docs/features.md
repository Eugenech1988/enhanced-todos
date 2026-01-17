# Enhanced Todos - Features Documentation

## Overview
This document describes the enhanced features added to the todo application, particularly focusing on the selection functionality and UI improvements.

## Added Features

### 1. Todo Selection Functionality

#### Left-side Selection Checkbox
- A checkbox has been added to the left side of each todo item, next to the drag-and-drop handle
- This checkbox is only visible when the filter is set to 'all' (`filter === 'all'`)
- It operates independently of the completion status of the todo
- When unchecked, displays an empty gray checkbox with rounded corners
- When checked, displays a filled blue checkbox with a white checkmark inside
- Allows users to select specific todos for batch operations

#### Select All Button
- A "Select all" button has been added to the TodoList component
- The button is positioned below the "Todos List" header
- When clicked:
  - If all visible todos are already selected → clears all selections
  - If not all visible todos are selected → selects all visible todos
- The button text dynamically changes based on the selection state:
  - Shows "Select all" when not all items are selected
  - Shows "Clear all" when all items are selected
- The button only affects currently visible todos based on the active filter (all/active/completed)

#### Context Management
- Selection state is managed globally in the todo context
- The `selectedIds` array tracks IDs of all selected todos
- Functions added to the context:
  - `setSelectedIds(ids: string[])`: Sets the selected IDs array
  - `selectAllTodos()`: Selects all todos in the list
  - `clearSelectedTodos()`: Clears all selections
  - `removeSelectedTodos()`: Removes all selected todos
  - `setCompletedForSelected(completed: boolean)`: Sets completion status for all selected todos
- Selection state persists using sessionStorage

### 2. Mass Operations
- Added buttons for mass operations on selected todos:
  - "Delete selected" button: Deletes all selected todos
  - "Set completed" button: Marks all selected todos as completed
  - "Set active" button: Marks all selected todos as active (not completed)
- Buttons appear only when at least one todo is selected
- Buttons show the count of selected todos in the delete button label
- Mass operation buttons are encapsulated in a separate MassActions component

### 3. Component Architecture

#### MassActions Component
- Dedicated component for handling mass operations on selected todos
- Contains buttons for "Delete selected", "Set completed", and "Set active" operations
- Only renders when at least one todo is selected
- Receives selected count as a prop and accesses todo operations via context
- Located at the top panel of the TodoList component

### 3. UI Improvements

#### Todo List Height Management
- The TodoList component now has a maximum height calculated as `calc(100vh - 220px)`
- This accounts for the height of the AddTodo and SearchTodos components above it
- Vertical scrolling is enabled when the content exceeds the available space
- This ensures the interface remains usable regardless of screen size
- A scroll hint indicator ("↑↓ Scroll") appears in the bottom-right corner when scrolling is available

#### Visual Design
- Left-side checkboxes use SVG elements with rounded corners for visual consistency
- Proper hover states and visual feedback implemented
- Color scheme follows the existing design language (blue for selected, gray for unselected)

## Technical Implementation

### Component Changes

#### Todo Component
- Added local state management for individual todo selection
- Implemented the left-side checkbox with SVG graphics
- Connected to global selection state via context API
- Added handler function for selection toggling

#### TodoList Component
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
- Makes the TodoList component cleaner and more maintainable

## Usage Examples

### Selecting Todos
1. View the todo list (ensure filter is set to 'all')
2. Click the checkbox next to any todo to select it
3. Selected todos will show a filled blue checkbox with white checkmark
4. Use the "Select all" button to quickly select all visible todos

### Clearing Selections
1. When all visible todos are selected, the button label changes to "Clear all"
2. Click the button to deselect all todos
3. Alternatively, click "Select all" button again when partially selected to select all, then click again to clear all

## Behavior Notes

- Selection state is independent of completion state
- When a todo is deleted, its ID is automatically removed from selectedIds
- Selections persist across page refreshes
- The "Select all" button only affects currently visible todos based on the active filter

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

### With Add Todo Component
- Newly added todos are not automatically selected
- Adding a new todo does not affect existing selections
- The "Select all" button will include newly added todos in the selection

### With Search Component
- Filtering by search term affects which todos are displayed
- The "Select all" button only selects currently visible todos based on search results
- Selected todos remain selected even when search terms change
- Mass operations (delete, set completed/active) only affect currently visible selected todos

### With Filter Component
- Changing filters affects which todos are displayed
- The "Select all" button only selects todos in the currently active filter (all/active/completed)
- Selections persist when switching between filters
- Mass operations only affect todos in the current filter scope

### With Todo Item Components
- Individual todo checkboxes operate independently of bulk selection
- Clicking a todo's completion checkbox (right-side CircleCheck) only affects that specific todo's completion status
- Clicking the selection checkbox (left-side) only affects selection state, not completion state
- Deleting a todo individually (trash icon) removes only that specific todo
- Individual completion and deletion operations do not affect the selection state
- Clicking on the todo text initiates inline editing mode
- When editing, a text input field appears allowing modification of the todo title
- Editing does not affect selection or completion state

### With Mass Operation Buttons (Top Panel)
- "Set completed" button: Changes completion status to completed for all selected todos
- "Set active" button: Changes completion status to active (not completed) for all selected todos
- "Delete selected" button: Removes all selected todos at once
- After mass deletion, selection state is cleared
- Mass operations only affect currently selected todos
- Mass operation buttons are now part of the MassActions component