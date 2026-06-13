(function(root){

    function createAppState(){

        const i18nConfig =
            root.TRELLO_LIKE_TODO_I18N;

        let currentLocale =
            root.TRELLO_LIKE_TODO_STORAGE.loadLocale(
                i18nConfig.defaultLocale
            );

        if(!i18nConfig.messages[currentLocale]){
            currentLocale = i18nConfig.defaultLocale;
        }

        const context = {
            i18nConfig,
            colorUtils:root.TRELLO_LIKE_TODO_COLORS,
            dateUtils:root.TRELLO_LIKE_TODO_DATES,
            storage:root.TRELLO_LIKE_TODO_STORAGE,
            colorPanel:root.TRELLO_LIKE_TODO_COLOR_PANEL,
            historyUi:root.TRELLO_LIKE_TODO_HISTORY,
            boardUi:root.TRELLO_LIKE_TODO_BOARD,
            currentLocale,
            currentWeek:0,
            data:root.TRELLO_LIKE_TODO_STORAGE.loadData()
        };

        context.t = key=>t(key, context);
        context.saveData = ()=>saveData(context);
        context.renderApp = ()=>renderApp(context);

        return context;
    }

    function t(key, context){

        const keys =
            key.split(".");

        const currentMessage =
            keys.reduce(
                (value, currentKey)=>
                    value && value[currentKey],
                context.i18nConfig.messages[context.currentLocale]
            );

        if(currentMessage){
            return currentMessage;
        }

        return keys.reduce(
            (value, currentKey)=>
                value && value[currentKey],
            context.i18nConfig.messages[
                context.i18nConfig.defaultLocale
            ]
        ) || key;
    }

    function saveData(context){

        context.storage.saveData(context.data);
    }

    function setupLocaleSelect(context){

        const localeSelect =
            document.getElementById("localeSelect");

        localeSelect.innerHTML =
            Object.entries(context.i18nConfig.locales)
                .map(([locale, config])=>
                    `<option value="${locale}">
                        ${config.label}
                    </option>`
                )
                .join("");

        localeSelect.value = context.currentLocale;

        localeSelect.addEventListener("change", ()=>{

            context.currentLocale = localeSelect.value;

            context.storage.saveLocale(
                context.currentLocale
            );

            applyLocaleText(context);

            context.boardUi.renderBoard(context);
        });

        applyLocaleText(context);
    }

    function applyLocaleText(context){

        document.documentElement.lang =
            context.i18nConfig
                .locales[context.currentLocale]
                .htmlLang;

        document.title =
            context.t("app.title");

        document.getElementById("appTitle")
            .innerText = context.t("app.title");

        document.getElementById("taskTitle")
            .placeholder =
                context.t("toolbar.taskTitlePlaceholder");

        document.getElementById("addTaskButton")
            .innerText = context.t("toolbar.addTask");

        document.getElementById("previousWeekButton")
            .innerText = context.t("toolbar.previousWeek");

        document.getElementById("nextWeekButton")
            .innerText = context.t("toolbar.nextWeek");

        document.getElementById("historyTitle")
            .innerText = context.t("history.title");
    }

    function renderApp(context){

        context.boardUi.renderBoard(context);
    }

    function bindGlobalEvents(context){

        root.addTask = ()=>{
            context.boardUi.addTask(context);
        };

        root.changeWeek = offset=>{
            context.boardUi.changeWeek(offset, context);
        };

        document.addEventListener("click", event=>{

            const panel =
                document.querySelector(".color-panel");

            const eventPath =
                typeof event.composedPath === "function" ?
                    event.composedPath() :
                    [];

            if(
                panel &&
                !eventPath.includes(panel) &&
                !event.target.closest(".color-btn")
            ){
                context.colorPanel.closeColorPanel();
            }
        });
    }

    function initApp(){

        const context =
            createAppState();

        root.TRELLO_LIKE_TODO_APP_CONTEXT =
            context;

        context.saveData();
        setupLocaleSelect(context);
        renderApp(context);
        context.boardUi.setDefaultTaskDate(context);
        bindGlobalEvents(context);
    }

    root.TRELLO_LIKE_TODO_APP = {
        createAppState,
        t,
        setupLocaleSelect,
        applyLocaleText,
        renderApp,
        bindGlobalEvents,
        initApp
    };

    initApp();

})(typeof window !== "undefined" ? window : globalThis);
