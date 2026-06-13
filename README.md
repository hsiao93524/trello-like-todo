# Weekly Trello Local

## Introduction

Weekly Trello Local is a simple web-based todo.

It helps users plan tasks by week, move cards between days like trello feature, and keep finished tasks in a history list. The app is built with plain HTML, CSS, and JavaScript, so it can run locally without a server.

## Features

- Show task cards for two weeks at the same time.
- Navigate to previous or next weeks.
- Add cards to a selected date.
- Drag and drop cards between day columns.
- Edit card titles.
- Change card colors.
- Mark cards as done.
- Save completed cards in the history list.
- Delete cards or history items.
- Save data in the browser with `localStorage`.
- Works without login, cloud sync, or external APIs.

## How to Use

Open `src/index.html` in a browser.

Use the top toolbar to create a new task and choose a date. Cards can be dragged to another day. Finished cards are moved to the history section.

## Project Structure

- `src/index.html` - main local web app.
- `src/js/i18n.js` - UI messages and locale settings.
- `src/js/color-utils.js` - color helper functions.
- `src/js/date-utils.js` - date and week helper functions.
- `src/js/storage.js` - localStorage load, save, and migration helpers.
- `src/js/color-panel.js` - card color panel UI.
- `src/js/history-ui.js` - completed task history UI.
- `src/js/board-ui.js` - board, column, card, and drag-and-drop UI.
- `src/js/app.js` - app startup and shared state wiring.
- `docs/function-map.md` - current function map.
- `docs/local-storage-schema.md` - localStorage data structure.
- `README.md` - project overview and basic usage.

## Design Documents

- [localStorage schema](docs/local-storage-schema.md)
- [Function map](docs/function-map.md)

## Notes

This project is designed to stay simple and local-first. Future work should keep the app easy to open, easy to understand, and usable without network access.
This project is worked with Codex.

## Todos

- [ ] Merge Edit, Color, Done, Delete in the card to a menu or dropdown to shirnk the width of card.
- [ ] Add `Today` button at the left of `previous week` button to jump to today's week
- [x] Package JS files in the `src/js` folder.
