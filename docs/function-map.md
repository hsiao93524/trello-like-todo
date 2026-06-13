# Function Map

This document is a quick guide for finding app features and functions.

## Status Notes

- Runtime JavaScript files live in `src/js/`.
- `src/index.html` is now the app shell only.
- App logic is split into small classic browser scripts.
- Scripts use `window.TRELLO_LIKE_TODO_*` namespaces so the app can still run without a build step.

## Files

### `src/index.html`

Purpose:

- Keep the static app shell.
- Load `styles.css`.
- Load runtime scripts in order.

Main contents:

- App header.
- Locale selector.
- Task toolbar.
- Board container.
- History container.
- Script tags.

### `src/styles.css`

Purpose:

- Store all app styles.

Main contents:

- Header layout.
- Toolbar layout.
- Board and column styles.
- Task card styles.
- Color panel styles.
- History list styles.
- Responsive and overflow rules.

### `src/js/i18n.js`

Purpose:

- Store locale labels and UI messages.

Main contents:

- `defaultLocale`
- `locales`
- `messages`

### `src/js/color-utils.js`

Purpose:

- Store color data helpers.
- Keep color logic testable without the browser UI.

Functions:

- `normalizeHexColor(color)` - Normalize a hex color string.
- `addRecentColor(colors, color, limit)` - Add a color to the recent color list.
- `normalizeRecentColors(colors, limit)` - Clean the recent color list.
- `normalizeSavedColors(colors, limit)` - Clean the saved color list.
- `upsertSavedColor(colors, item, index, limit)` - Add or edit a saved color.
- `deleteSavedColor(colors, index, limit)` - Delete a saved color.

### `src/js/date-utils.js`

Purpose:

- Store date and week helpers.
- Keep date logic separate from DOM rendering.

Functions:

- `getWeekDates(weekOffset)` - Return Monday to Sunday dates for a week.
- `formatDate(date)` - Format a date as `YYYY-MM-DD`.
- `isSameDate(dateA, dateB)` - Check if two dates are the same calendar day.
- `getTwoWeekRangeLabel(currentWeek)` - Return the visible two-week range label.
- `getDefaultTaskDate()` - Return today's date for the task date input.

### `src/js/storage.js`

Purpose:

- Store all `localStorage` access.
- Normalize loaded data.
- Migrate old local data when needed.

Functions:

- `loadData()` - Load board data from `localStorage`.
- `saveData(data)` - Save board data to `localStorage`.
- `normalizeData(data)` - Ensure all root fields exist.
- `migrateLegacyTasks(data)` - Convert old `week` and `day` task data to `targetDate`.
- `migrateColorSettings(data)` - Convert old color data to `colorSettings`.
- `loadLocale(defaultLocale)` - Load selected locale.
- `saveLocale(locale)` - Save selected locale.

When this file changes data fields, also check `docs/local-storage-schema.md`.

### `src/js/color-panel.js`

Purpose:

- Render and control the card color panel.

Functions:

- `openColorPanel(task, colorButton, context)` - Open the color panel for a task.
- `closeColorPanel()` - Close the current color panel.
- `applyTaskColor(task, color, context)` - Apply a selected color to a task.
- `renderRecentColors(panel, context, onSelect)` - Render recent color swatches.
- `renderSavedColors(panel, context, onSelect)` - Render saved color rows.
- `openSavedColorForm(index, panel, context, selectedColor)` - Open the saved color form.
- `closeSavedColorForm(panel)` - Close the saved color form.
- `hasOpenSavedColorForm(panel)` - Check if the saved color form is open.
- `createSwatch(color, label, onSelect, context)` - Create a color swatch button.
- `escapeAttribute(value)` - Escape text used in HTML attributes.

### `src/js/history-ui.js`

Purpose:

- Render and control the completed task history.

Functions:

- `renderHistory(context)` - Render the history list.
- `createHistoryItem(item, context)` - Create a history item element.
- `deleteHistoryItem(item, context)` - Delete a history item.

### `src/js/board-ui.js`

Purpose:

- Render the board, columns, and task cards.
- Handle card actions and drag-and-drop.

Functions:

- `renderBoard(context)` - Render the two-week board.
- `createTaskCard(task, context)` - Create a task card element.
- `setupColumnDrag(column, dayObj, context)` - Enable drag-and-drop for a day column.
- `getDragAfterElement(column, y)` - Find the drag insert position.
- `addTask(context)` - Add a new task from the toolbar.
- `editTask(task, context)` - Edit a task title.
- `deleteTask(task, context)` - Delete a task.
- `completeTask(task, context)` - Move a task to history.
- `moveTaskToDate(taskId, targetDate, context)` - Move a task to another date.
- `changeWeek(offset, context)` - Move the board to previous or next weeks.
- `updateWeekLabel(context)` - Update the current week label.
- `setDefaultTaskDate(context)` - Set the default date input value.

### `src/js/app.js`

Purpose:

- Start the app.
- Connect state, storage, i18n, and UI modules.
- Keep global `addTask()` and `changeWeek()` wrappers for the current HTML buttons.

Functions:

- `createAppState()` - Create the app state object.
- `t(key, context)` - Return a translated message.
- `setupLocaleSelect(context)` - Initialize the locale selector.
- `applyLocaleText(context)` - Apply translated text to static UI.
- `renderApp(context)` - Render the main UI.
- `bindGlobalEvents(context)` - Bind global document events.
- `initApp()` - Load data and start the app.

## Shared Context

Most UI functions receive a `context` object.

Main fields:

- `data` - Current board data.
- `currentWeek` - Current week offset.
- `currentLocale` - Current UI locale.
- `t` - Translation function.
- `saveData` - Save current data.
- `renderApp` - Re-render the app.
- `dateUtils` - Date helper module.
- `colorUtils` - Color helper module.
- `colorPanel` - Color panel module.
- `historyUi` - History UI module.
- `boardUi` - Board UI module.

## Tests

Current test files:

- `src/js/color-utils.test.js`
- `src/js/i18n-ui.test.js`
- `src/js/file-split.test.js`
