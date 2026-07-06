(function(root){

    function setDefaultTaskDate(context){

        const taskDate =
            document.getElementById("taskDate");

        if(taskDate && !taskDate.value){

            taskDate.value =
                context.dateUtils.getDefaultTaskDate();
        }
    }

    function getDragAfterElement(column, y){

        const draggableElements = [
            ...column.querySelectorAll(".task:not(.dragging)")
        ];

        return draggableElements.reduce(
            (closest, child)=>{

                const box =
                    child.getBoundingClientRect();

                const offset =
                    y - box.top - box.height / 2;

                if(
                    offset < 0 &&
                    offset > closest.offset
                ){
                    return {
                        offset,
                        element:child
                    };
                }else{
                    return closest;
                }

            },
            {
                offset:Number.NEGATIVE_INFINITY
            }
        ).element;
    }

    function renderBoard(context){

        const board =
            document.getElementById("board");

        board.innerHTML = "";

        const today = new Date();

        for(let weekOffset = 0; weekOffset < 2; weekOffset++){

            const actualWeek =
                context.currentWeek + weekOffset;

            const weekDates =
                context.dateUtils.getWeekDates(actualWeek);

            const startDate =
                weekDates[0];

            const endDate =
                weekDates[6];

            const weekHeader =
                document.createElement("div");

            weekHeader.className =
                "week-header";

            weekHeader.innerHTML =
                `${startDate.month}/${startDate.date}
                 ~
                 ${endDate.month}/${endDate.date}`;

            board.appendChild(weekHeader);

            weekDates.forEach(dayObj=>{

                const column =
                    document.createElement("div");

                column.className = "column";

                if(
                    context.dateUtils.isSameDate(
                        dayObj.full,
                        today
                    )
                ){
                    column.classList.add("today");
                }

                column.innerHTML = `
                    <h3>${dayObj.label}</h3>
                `;

                setupColumnDrag(column, dayObj, context);

                context.data.tasks
                    .filter(task=>

                        task.targetDate ===
                        context.dateUtils.formatDate(dayObj.full)

                    )
                    .forEach(task=>{

                        column.appendChild(
                            createTaskCard(task, context)
                        );

                    });

                board.appendChild(column);

            });

        }

        context.historyUi.renderHistory(context);

        updateWeekLabel(context);
    }

    function createTaskCard(task, context){

        const card = document.createElement("div");

        card.className = "task";

        card.style.background = task.color || "#ffffff";

        card.dataset.id = task.id;

        card.draggable = true;

        card.addEventListener("dragstart", e=>{

            card.classList.add("dragging");

            e.dataTransfer.setData(
                "text/plain",
                task.id
            );

        });

        card.addEventListener("dragend", ()=>{

            card.classList.remove("dragging");

        });

        card.innerHTML = `
            <div class="task-title">
                ${task.title}
            </div>

            <div class="task-time">
                ${context.t("task.createdAt")}
                ${context.dateUtils.formatDateTime(task.createdAt)}
            </div>

            <div class="task-buttons">

                <button class="edit-btn">
                    ${context.t("task.edit")}
                </button>

                <button class="color-btn">
                    ${context.t("task.color")}
                </button>

                <button class="done-btn">
                    ${context.t("task.done")}
                </button>

                <button class="delete-btn">
                    ${context.t("task.delete")}
                </button>

            </div>
        `;

        card.querySelector(".delete-btn")
            .onclick = ()=>{
                deleteTask(task, context);
            };

        card.querySelector(".edit-btn")
            .onclick = ()=>{
                editTask(task, context);
            };

        card.querySelector(".done-btn")
            .onclick = ()=>{
                completeTask(task, context);
            };

        card.querySelector(".color-btn")
            .onclick = event=>{

            event.stopPropagation();

            context.colorPanel.openColorPanel(
                task,
                event.currentTarget,
                context
            );
        };

        return card;
    }

    function setupColumnDrag(column, dayObj, context){

        column.addEventListener("dragover", e=>{

            e.preventDefault();

            const dragging =
                document.querySelector(".dragging");

            const afterElement =
                getDragAfterElement(
                    column,
                    e.clientY
                );

            if(afterElement == null){

                column.appendChild(dragging);

            }else{

                column.insertBefore(
                    dragging,
                    afterElement
                );
            }

        });

        column.addEventListener("drop", e=>{

            e.preventDefault();

            const taskId =
                e.dataTransfer.getData(
                    "text/plain"
                );

            moveTaskToDate(
                taskId,
                context.dateUtils.formatDate(dayObj.full),
                context
            );

        });

    }

    function addTask(context){

        const title =
            document.getElementById("taskTitle")
            .value
            .trim();

        const targetDate =
            document.getElementById("taskDate")
            .value ||
            context.dateUtils.getDefaultTaskDate();

        if(!title){

            alert(context.t("task.emptyTitleAlert"));

            return;
        }

        context.data.tasks.push({

            id:Date.now(),

            title,

            targetDate,

            color:"#ffffff",

            createdAt:
                new Date().toISOString()

        });

        document.getElementById("taskTitle")
            .value = "";

        context.saveData();

        renderBoard(context);
    }

    function editTask(task, context){

        const newTitle = prompt(
            context.t("task.editTitlePrompt"),
            task.title
        );

        if(
            newTitle &&
            newTitle.trim()
        ){

            task.title =
                newTitle.trim();

            context.saveData();

            renderBoard(context);
        }
    }

    function deleteTask(task, context){

        if(!confirm(context.t("task.confirmDelete"))){
            return;
        }

        context.data.tasks =
            context.data.tasks.filter(
                taskItem=>taskItem.id !== task.id
            );

        context.saveData();

        renderBoard(context);
    }

    function completeTask(task, context){

        context.data.history.unshift({
            ...task,
            completedAt:
                new Date().toISOString()
        });

        context.data.tasks =
            context.data.tasks.filter(
                taskItem=>taskItem.id !== task.id
            );

        context.saveData();

        renderBoard(context);
    }

    function moveTaskToDate(taskId, targetDate, context){

        const task =
            context.data.tasks.find(
                taskItem=>taskItem.id == taskId
            );

        if(!task){
            return;
        }

        task.targetDate =
            targetDate;

        context.saveData();

        renderBoard(context);
    }

    function changeWeek(offset, context){

        context.currentWeek += offset;

        renderBoard(context);
    }

    function updateWeekLabel(context){

        document.getElementById(
            "currentWeekLabel"
        ).innerText =
            context.dateUtils.getTwoWeekRangeLabel(
                context.currentWeek
            );
    }

    root.TRELLO_LIKE_TODO_BOARD = {
        renderBoard,
        createTaskCard,
        setupColumnDrag,
        getDragAfterElement,
        addTask,
        editTask,
        deleteTask,
        completeTask,
        moveTaskToDate,
        changeWeek,
        updateWeekLabel,
        setDefaultTaskDate
    };

})(typeof window !== "undefined" ? window : globalThis);
