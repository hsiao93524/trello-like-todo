(function(root){

    function renderHistory(context){

        const historyList =
            document.getElementById("historyList");

        historyList.innerHTML = "";

        context.data.history.forEach(item=>{
            historyList.appendChild(
                createHistoryItem(item, context)
            );
        });
    }

    function createHistoryItem(item, context){

        const div =
            document.createElement("div");

        div.className = "history-item";

        div.innerHTML = `
            <strong>${item.title}</strong>

            <br>

            ${context.t("history.originalDate")}
            ${item.targetDate || "-"}

            <br>

            ${context.t("history.completedAt")}
            ${context.dateUtils.formatDateTime(item.completedAt)}

            <br><br>

            <button class="history-delete">
                ${context.t("history.deleteRecord")}
            </button>
        `;

        div.querySelector(".history-delete")
            .onclick = ()=>{
                deleteHistoryItem(item, context);
            };

        return div;
    }

    function deleteHistoryItem(item, context){

        if(!confirm(context.t("history.confirmDeleteRecord"))){
            return;
        }

        context.data.history =
            context.data.history.filter(
                historyItem => historyItem !== item
            );

        context.saveData();

        renderHistory(context);
    }

    root.TRELLO_LIKE_TODO_HISTORY = {
        renderHistory,
        createHistoryItem,
        deleteHistoryItem
    };

})(typeof window !== "undefined" ? window : globalThis);
