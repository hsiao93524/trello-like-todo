(function(root){

    const dataStorageKey = "weekly-trello";
    const localeStorageKey = "weekly-trello-locale";

    function createDefaultData(){

        return {
            tasks: [],
            history: [],
            colorSettings: {
                recentColors: [],
                savedColors: []
            }
        };
    }

    function loadData(){

        let data;

        try{
            data = JSON.parse(
                root.localStorage.getItem(dataStorageKey)
            );
        }catch(_error){
            data = null;
        }

        return normalizeData(data);
    }

    function saveData(data){

        root.localStorage.setItem(
            dataStorageKey,
            JSON.stringify(data)
        );
    }

    function normalizeData(data){

        const normalizedData =
            data && typeof data === "object" ?
                data :
                createDefaultData();

        if(!Array.isArray(normalizedData.tasks)){
            normalizedData.tasks = [];
        }

        if(!Array.isArray(normalizedData.history)){
            normalizedData.history = [];
        }

        migrateColorSettings(normalizedData);
        migrateLegacyTasks(normalizedData);

        return normalizedData;
    }

    function migrateColorSettings(data){

        const colorUtils =
            root.TRELLO_LIKE_TODO_COLORS;

        if(!data.colorSettings){

            data.colorSettings = {
                recentColors:Array.isArray(data.favoriteColors) ?
                    data.favoriteColors :
                    [],
                savedColors:[]
            };

            delete data.favoriteColors;
        }

        if(!Array.isArray(data.colorSettings.recentColors)){
            data.colorSettings.recentColors = [];
        }

        if(!Array.isArray(data.colorSettings.savedColors)){
            data.colorSettings.savedColors = [];
        }

        data.colorSettings.recentColors =
            colorUtils.normalizeRecentColors(
                data.colorSettings.recentColors
            );

        data.colorSettings.savedColors =
            colorUtils.normalizeSavedColors(
                data.colorSettings.savedColors
            );
    }

    function migrateLegacyTasks(data){

        const dateUtils =
            root.TRELLO_LIKE_TODO_DATES;

        data.tasks.forEach(task=>{

            if(!task.targetDate){

                const weekDates =
                    dateUtils.getWeekDates(task.week || 0);

                task.targetDate =
                    dateUtils.formatDate(
                        weekDates[task.day || 0].full
                    );
            }
        });
    }

    function loadLocale(defaultLocale){

        return root.localStorage.getItem(localeStorageKey) ||
            defaultLocale;
    }

    function saveLocale(locale){

        root.localStorage.setItem(
            localeStorageKey,
            locale
        );
    }

    const api = {
        loadData,
        saveData,
        normalizeData,
        migrateLegacyTasks,
        migrateColorSettings,
        loadLocale,
        saveLocale
    };

    root.TRELLO_LIKE_TODO_STORAGE = api;

    if(
        typeof module !== "undefined" &&
        module.exports
    ){
        module.exports = api;
    }

})(typeof window !== "undefined" ? window : globalThis);
