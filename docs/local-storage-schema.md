# localStorage Schema

This document describes the data saved by Weekly Trello Local in browser `localStorage`.

## Storage Keys

| Key | Type | Purpose |
| --- | --- | --- |
| `weekly-trello` | JSON string | Stores active task cards and completed task history. |
| `weekly-trello-locale` | string | Stores the selected UI language. |

## `weekly-trello`

Root data format:

| Field | Type | Description |
| --- | --- | --- |
| `tasks` | `Task[]` | Active task cards shown on the board. |
| `history` | `HistoryItem[]` | Completed task records. |
| `colorSettings` | `ColorSettings` | Recent and saved card colors. |

Example:

```json
{
  "tasks": [],
  "history": [],
  "colorSettings": {
    "recentColors": [],
    "savedColors": []
  }
}
```

## `Task`

Active task card data.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `number` | Yes | Unique task ID. Currently generated with `Date.now()`. |
| `title` | `string` | Yes | Task card title. |
| `targetDate` | `string` | Yes | Target date for the card. Format: `YYYY-MM-DD`. |
| `color` | `string` | Yes | Card background color. Example: `#ffffff`. |
| `createdAt` | `string` | Yes | Task creation time. Stored as an ISO 8601 string from `toISOString()`. |

Example:

```json
{
  "id": 1718260000000,
  "title": "Write README",
  "targetDate": "2026-06-13",
  "color": "#ffffff",
  "createdAt": "2026-06-13T13:30:00.000Z"
}
```

## `HistoryItem`

Completed task record.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `number` | Yes | Original task ID. |
| `title` | `string` | Yes | Original task card title. |
| `targetDate` | `string` | Yes | Original target date. Format: `YYYY-MM-DD`. |
| `color` | `string` | Yes | Original card background color. |
| `createdAt` | `string` | Yes | Original task creation time. |
| `completedAt` | `string` | Yes | Completion time. Stored as an ISO 8601 string from `toISOString()`. |

Example:

```json
{
  "id": 1718260000000,
  "title": "Write README",
  "targetDate": "2026-06-13",
  "color": "#ffffff",
  "createdAt": "2026-06-13T13:30:00.000Z",
  "completedAt": "2026-06-13T14:00:00.000Z"
}
```

## `ColorSettings`

Card color panel settings.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `recentColors` | `string[]` | Yes | Recently applied card colors. Normalized hex colors, limited to 5 items. |
| `savedColors` | `SavedColor[]` | Yes | User-saved color presets, limited to 5 items. |

Example:

```json
{
  "recentColors": [
    "#ffcc00",
    "#ffffff"
  ],
  "savedColors": [
    {
      "color": "#ffcc00",
      "label": "Important"
    }
  ]
}
```

## `SavedColor`

Saved color preset data.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `color` | `string` | Yes | Normalized hex color. Example: `#ffcc00`. |
| `label` | `string` | Yes | Optional display label. Empty string is allowed. |

Example:

```json
{
  "color": "#ffcc00",
  "label": "Important"
}
```

## `weekly-trello-locale`

Selected language setting.

| Value | Description |
| --- | --- |
| `zh-TW` | Traditional Chinese |
| `ja` | Japanese |
| `en` | English |

Example:

```txt
zh-TW
```

## Legacy Data

Older task data may use `week` and `day` instead of `targetDate`.

Older time fields may be saved as browser-formatted strings from
`toLocaleString()`. The current app keeps those values unchanged when the
browser cannot parse them as a date.

| Field | Type | Description |
| --- | --- | --- |
| `week` | `number` | Week offset from the current week. |
| `day` | `number` | Day index from `0` to `6`. `0` means Monday. |

Legacy example:

```json
{
  "id": 1718260000000,
  "title": "Old task",
  "week": 0,
  "day": 1,
  "color": "#ffffff",
  "createdAt": "6/13/2026, 9:30:00 PM"
}
```

The current app migrates legacy task data to `targetDate` when loaded.

Older color data may use `favoriteColors`. The current app migrates it to:

```json
{
  "colorSettings": {
    "recentColors": [],
    "savedColors": []
  }
}
```
