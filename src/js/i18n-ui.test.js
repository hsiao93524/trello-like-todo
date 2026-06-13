const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const scriptDir = __dirname;
const srcDir = path.join(scriptDir, "..");
const html = fs.readFileSync(
    path.join(srcDir, "index.html"),
    "utf8"
);
const i18nSource = fs.readFileSync(
    path.join(scriptDir, "i18n.js"),
    "utf8"
);
const appSource = fs.readFileSync(
    path.join(scriptDir, "app.js"),
    "utf8"
);
const colorPanelSource = fs.readFileSync(
    path.join(scriptDir, "color-panel.js"),
    "utf8"
);

const context = {
    window: {}
};

vm.runInNewContext(i18nSource, context);

const i18n = context.window.TRELLO_LIKE_TODO_I18N;

assert(i18n, "i18n config should be exposed on window");
assert(i18n.locales, "i18n config should list selectable locales");
assert(i18n.locales["zh-TW"], "zh-TW locale should be selectable");
assert(i18n.locales.ja, "ja locale should be selectable");
assert(i18n.locales.en, "en locale should be selectable");

assert(
    html.includes('<script src="js/i18n.js"></script>'),
    "index.html should load js/i18n.js"
);
assert(
    html.includes('<script src="js/color-utils.js"></script>'),
    "index.html should load js/color-utils.js"
);
assert(
    html.includes('<script src="js/app.js"></script>'),
    "index.html should load js/app.js"
);
assert(
    html.includes('<header class="app-header">'),
    "header should use app-header layout"
);
assert(
    html.includes('id="localeSelect"'),
    "header should include localeSelect"
);
assert(
    html.includes('class="locale-icon"'),
    "locale picker should include a globe icon"
);
assert(
    html.includes('aria-hidden="true"'),
    "locale icon should be hidden from assistive technology"
);
assert(
    appSource.includes("function t(key, context)"),
    "app.js should provide a translation lookup function"
);
assert(
    appSource.includes("function applyLocaleText(context)"),
    "app.js should update visible locale text"
);
assert(
    colorPanelSource.includes("function openSavedColorForm"),
    "color-panel.js should edit saved colors with an inline form"
);
assert(
    colorPanelSource.includes("function hasOpenSavedColorForm"),
    "color-panel.js should detect an open saved color form"
);
assert(
    colorPanelSource.includes("if(hasOpenSavedColorForm(panel))"),
    "main color panel actions should collapse saved color form first"
);
assert(
    colorPanelSource.includes("event.stopPropagation();"),
    "saved color form buttons should not bubble to document close handler"
);
assert(
    appSource.includes("event.composedPath()"),
    "document close handler should use the original event path"
);
assert(
    colorPanelSource.includes("saved-color-form"),
    "color-panel.js should include saved color form markup"
);

assert(
    i18n.messages.en.colorPanel.title,
    "i18n config should include color panel messages"
);
assert(
    i18n.messages.en.colorPanel.savedColors,
    "i18n config should include saved color messages"
);
assert(
    i18n.messages.en.colorPanel.savedColorLimitAlert,
    "i18n config should include saved color limit message"
);
assert(
    i18n.messages.en.colorPanel.save,
    "i18n config should include saved color form actions"
);
assert(
    i18n.messages.en.colorPanel.invalidColor,
    "i18n config should include saved color form validation"
);
