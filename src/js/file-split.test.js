const assert = require("assert");
const fs = require("fs");
const path = require("path");

const scriptDir = __dirname;
const srcDir = path.join(scriptDir, "..");
const html = fs.readFileSync(
    path.join(srcDir, "index.html"),
    "utf8"
);

const expectedFiles = [
    "styles.css",
    "i18n.js",
    "color-utils.js",
    "date-utils.js",
    "storage.js",
    "color-panel.js",
    "history-ui.js",
    "board-ui.js",
    "app.js"
];

expectedFiles.forEach(fileName=>{
    const filePath = fileName === "styles.css"
        ? path.join(srcDir, fileName)
        : path.join(scriptDir, fileName);

    assert(
        fs.existsSync(filePath),
        `${fileName} should exist`
    );
});

assert(
    html.includes('<link rel="stylesheet" href="styles.css">'),
    "index.html should load styles.css"
);

assert(
    !/<style>[\s\S]*<\/style>/.test(html),
    "index.html should not keep inline CSS"
);

assert(
    !/<script>\s*const days =/.test(html),
    "index.html should not keep the main app script inline"
);

const expectedScriptOrder = [
    "i18n.js",
    "color-utils.js",
    "date-utils.js",
    "storage.js",
    "color-panel.js",
    "history-ui.js",
    "board-ui.js",
    "app.js"
];

let lastIndex = -1;

expectedScriptOrder.forEach(fileName=>{
    const scriptSrc = fileName === "styles.css"
        ? fileName
        : `js/${fileName}`;
    const scriptTag = `<script src="${scriptSrc}"></script>`;
    const index = html.indexOf(scriptTag);

    assert(
        index > lastIndex,
        `${scriptTag} should be loaded after the previous runtime script`
    );

    lastIndex = index;
});
