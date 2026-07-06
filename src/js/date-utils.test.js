const assert = require("assert");
const dates = require("./date-utils.js");

const morningDate = new Date(2026, 6, 5, 6, 58, 25);

const formattedIsoDate =
    dates.formatDateTime(morningDate.toISOString());

assert(
    formattedIsoDate.includes("AM"),
    "ISO date times should use AM text"
);

assert(
    formattedIsoDate.includes("6:58:25"),
    "ISO date times should keep the local time"
);

assert(
    !formattedIsoDate.includes("\u4e0a\u5348"),
    "ISO date times should not use Chinese AM text"
);

const formattedLegacyDate =
    dates.formatDateTime("2026/7/5 \u4e0a\u53486:58:25");

assert.strictEqual(
    formattedLegacyDate,
    "2026/7/5 \u4e0a\u53486:58:25",
    "legacy Chinese date times should be shown unchanged"
);

assert.strictEqual(
    dates.formatDateTime("not a date"),
    "not a date",
    "unknown date strings should be shown unchanged"
);
