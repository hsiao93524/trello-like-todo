(function(root){

    function normalizeHexColor(color){

        if(typeof color !== "string"){
            return null;
        }

        const trimmed =
            color.trim();

        const normalized =
            trimmed.startsWith("#") ?
                trimmed :
                `#${trimmed}`;

        if(!/^#[0-9a-fA-F]{6}$/.test(normalized)){
            return null;
        }

        return normalized.toLowerCase();
    }

    function addRecentColor(colors, color, limit = 5){

        const normalizedColor =
            normalizeHexColor(color);

        if(!normalizedColor){
            return normalizeRecentColors(colors, limit);
        }

        const existingColors =
            normalizeRecentColors(colors, limit)
                .filter(item=>item !== normalizedColor);

        return [
            normalizedColor,
            ...existingColors
        ].slice(0, limit);
    }

    function normalizeRecentColors(colors, limit = 5){

        if(!Array.isArray(colors)){
            return [];
        }

        const normalizedColors = [];

        colors.forEach(color=>{

            const normalizedColor =
                normalizeHexColor(color);

            if(
                normalizedColor &&
                !normalizedColors.includes(normalizedColor)
            ){
                normalizedColors.push(normalizedColor);
            }
        });

        return normalizedColors.slice(0, limit);
    }

    function normalizeSavedColors(colors, limit = 5){

        if(!Array.isArray(colors)){
            return [];
        }

        const normalizedColors = [];

        colors.forEach(item=>{

            if(!item || typeof item !== "object"){
                return;
            }

            const normalizedColor =
                normalizeHexColor(item.color);

            if(!normalizedColor){
                return;
            }

            normalizedColors.push({
                color:normalizedColor,
                label:typeof item.label === "string" ?
                    item.label.trim() :
                    ""
            });
        });

        return normalizedColors.slice(0, limit);
    }

    function upsertSavedColor(colors, item, index, limit = 5){

        const normalizedColor =
            normalizeHexColor(item && item.color);

        if(!normalizedColor){
            return normalizeSavedColors(colors, limit);
        }

        const normalizedColors =
            normalizeSavedColors(colors, limit);

        const savedColor = {
            color:normalizedColor,
            label:typeof item.label === "string" ?
                item.label.trim() :
                ""
        };

        if(
            Number.isInteger(index) &&
            index >= 0 &&
            index < normalizedColors.length
        ){
            normalizedColors[index] = savedColor;
            return normalizedColors;
        }

        if(normalizedColors.length >= limit){
            return normalizedColors;
        }

        return [
            ...normalizedColors,
            savedColor
        ];
    }

    function deleteSavedColor(colors, index, limit = 5){

        return normalizeSavedColors(colors, limit)
            .filter((_, itemIndex)=>itemIndex !== index);
    }

    const api = {
        normalizeHexColor,
        addRecentColor,
        normalizeRecentColors,
        normalizeSavedColors,
        upsertSavedColor,
        deleteSavedColor
    };

    root.TRELLO_LIKE_TODO_COLORS = api;

    if(
        typeof module !== "undefined" &&
        module.exports
    ){
        module.exports = api;
    }

})(typeof window !== "undefined" ? window : globalThis);
