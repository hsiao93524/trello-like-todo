const assert = require("assert");
const colors = require("./color-utils.js");

assert.strictEqual(
    colors.normalizeHexColor("#FFCC00"),
    "#ffcc00",
    "hex colors should be normalized to lowercase"
);

assert.strictEqual(
    colors.normalizeHexColor("ffcc00"),
    "#ffcc00",
    "missing hash should be added"
);

assert.strictEqual(
    colors.normalizeHexColor("not-a-color"),
    null,
    "invalid colors should be rejected"
);

assert.deepStrictEqual(
    colors.addRecentColor(
        ["#111111", "#222222"],
        "#222222"
    ),
    ["#222222", "#111111"],
    "existing recent colors should move to the front"
);

assert.deepStrictEqual(
    colors.addRecentColor(
        [
            "#000001",
            "#000002",
            "#000003",
            "#000004",
            "#000005"
        ],
        "#000006"
    ),
    [
        "#000006",
        "#000001",
        "#000002",
        "#000003",
        "#000004"
    ],
    "recent colors should keep at most 5 colors"
);

assert.deepStrictEqual(
    colors.normalizeSavedColors([
        {
            color: "#FFCC00",
            label: " 高優先 "
        },
        {
            color: "bad",
            label: "invalid"
        },
        {
            color: "#00AAFF",
            label: ""
        }
    ]),
    [
        {
            color: "#ffcc00",
            label: "高優先"
        },
        {
            color: "#00aaff",
            label: ""
        }
    ],
    "saved colors should normalize valid colors and labels"
);

assert.deepStrictEqual(
    colors.upsertSavedColor(
        [
            {
                color: "#111111",
                label: "old"
            }
        ],
        {
            color: "#222222",
            label: "new"
        },
        0
    ),
    [
        {
            color: "#222222",
            label: "new"
        }
    ],
    "saved colors should be editable by index"
);

assert.deepStrictEqual(
    colors.deleteSavedColor(
        [
            {
                color: "#111111",
                label: "one"
            },
            {
                color: "#222222",
                label: "two"
            }
        ],
        0
    ),
    [
        {
            color: "#222222",
            label: "two"
        }
    ],
    "saved colors should be removable by index"
);
