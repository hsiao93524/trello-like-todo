(function(root){

    function applyTaskColor(task, color, context){

        const normalizedColor =
            context.colorUtils.normalizeHexColor(color);

        if(!normalizedColor){
            return;
        }

        task.color = normalizedColor;

        context.data.colorSettings.recentColors =
            context.colorUtils.addRecentColor(
                context.data.colorSettings.recentColors,
                normalizedColor
            );

        context.saveData();

        closeColorPanel();

        context.renderApp();
    }

    function closeColorPanel(){

        const existingPanel =
            document.querySelector(".color-panel");

        if(existingPanel){
            existingPanel.remove();
        }
    }

    function openColorPanel(task, colorButton, context){

        const existingPanel =
            document.querySelector(".color-panel");

        if(
            existingPanel &&
            existingPanel.dataset.taskId === String(task.id)
        ){
            closeColorPanel();
            return;
        }

        closeColorPanel();

        const panel =
            document.createElement("div");

        const currentColor =
            context.colorUtils.normalizeHexColor(task.color) ||
            "#ffffff";

        let selectedColor = currentColor;

        panel.className = "color-panel";
        panel.dataset.taskId = task.id;

        panel.innerHTML = `
            <div class="color-panel-title">
                ${context.t("colorPanel.title")}
            </div>

            <div class="color-panel-row">
                <span
                    class="color-preview"
                    style="background:${currentColor}"
                ></span>
                <input
                    type="color"
                    class="color-input"
                    value="${currentColor}"
                    aria-label="${context.t("colorPanel.pickerLabel")}"
                >
                <span class="color-value">
                    ${currentColor}
                </span>
            </div>

            <div class="color-panel-section">
                <div class="color-list-label">
                    ${context.t("colorPanel.recentColors")}
                </div>

                <div class="recent-colors"></div>
            </div>

            <div class="color-panel-section">
                <div class="color-list-label">
                    ${context.t("colorPanel.savedColors")}
                </div>

                <div class="saved-colors"></div>

                <button type="button" class="add-saved-color">
                    ${context.t("colorPanel.addSavedColor")}
                </button>

                <div class="saved-color-form-slot"></div>
            </div>

            <div class="color-panel-actions">
                <button type="button" class="cancel-color-btn">
                    ${context.t("colorPanel.cancel")}
                </button>

                <button type="button" class="apply-color-btn">
                    OK
                </button>
            </div>
        `;

        const colorInput =
            panel.querySelector(".color-input");

        const colorValue =
            panel.querySelector(".color-value");

        const colorPreview =
            panel.querySelector(".color-preview");

        function updateSelectedColor(color){

            const normalizedColor =
                context.colorUtils.normalizeHexColor(color);

            if(!normalizedColor){
                return;
            }

            selectedColor = normalizedColor;
            colorInput.value = normalizedColor;
            colorValue.innerText = normalizedColor;
            colorPreview.style.background = normalizedColor;
        }

        colorInput.addEventListener("input", ()=>{
            updateSelectedColor(colorInput.value);
        });

        panel.querySelector(".cancel-color-btn")
            .addEventListener("click", ()=>{
                if(hasOpenSavedColorForm(panel)){
                    closeSavedColorForm(panel);
                    return;
                }

                closeColorPanel();
            });

        panel.querySelector(".apply-color-btn")
            .addEventListener("click", ()=>{
                if(hasOpenSavedColorForm(panel)){
                    closeSavedColorForm(panel);
                    return;
                }

                applyTaskColor(task, selectedColor, context);
            });

        panel.querySelector(".add-saved-color")
            .addEventListener("click", ()=>{

            if(context.data.colorSettings.savedColors.length >= 5){
                alert(context.t("colorPanel.savedColorLimitAlert"));
                return;
            }

            openSavedColorForm(
                null,
                panel,
                context,
                selectedColor,
                updateSelectedColor
            );
        });

        renderRecentColors(panel, context, updateSelectedColor);
        renderSavedColors(panel, context, updateSelectedColor);

        document.body.appendChild(panel);

        const buttonRect =
            colorButton.getBoundingClientRect();

        panel.style.left =
            `${buttonRect.left + window.scrollX}px`;

        panel.style.top =
            `${buttonRect.bottom + window.scrollY + 6}px`;
    }

    function createSwatch(color, label, onSelect, context){

        const swatch =
            document.createElement("button");

        swatch.type = "button";
        swatch.className = "color-swatch";
        swatch.style.background = color;
        swatch.title = label || color;
        swatch.setAttribute(
            "aria-label",
            `${context.t("colorPanel.selectColor")} ${label || color}`
        );

        swatch.addEventListener("click", ()=>{
            onSelect(color);
        });

        return swatch;
    }

    function escapeAttribute(value){

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function renderRecentColors(panel, context, onSelect){

        const recentColors =
            panel.querySelector(".recent-colors");

        recentColors.innerHTML = "";

        if(context.data.colorSettings.recentColors.length === 0){

            recentColors.innerHTML = `
                <div class="color-list-empty">
                    ${context.t("colorPanel.emptyRecentColors")}
                </div>
            `;

            return;
        }

        context.data.colorSettings.recentColors.forEach(color=>{
            recentColors.appendChild(
                createSwatch(color, color, onSelect, context)
            );
        });
    }

    function renderSavedColors(panel, context, onSelect){

        const savedColors =
            panel.querySelector(".saved-colors");

        savedColors.innerHTML = "";

        if(context.data.colorSettings.savedColors.length === 0){

            savedColors.innerHTML = `
                <div class="color-list-empty">
                    ${context.t("colorPanel.emptySavedColors")}
                </div>
            `;

            return;
        }

        context.data.colorSettings.savedColors.forEach(
            (item, index)=>{

                const row =
                    document.createElement("div");

                row.className = "saved-color-row";

                const swatch =
                    createSwatch(
                        item.color,
                        item.label,
                        onSelect,
                        context
                    );

                const label =
                    document.createElement("div");

                label.className = "saved-color-label";
                label.innerText =
                    item.label || item.color;
                label.title =
                    `${item.label || item.color} ${item.color}`;

                const actions =
                    document.createElement("div");

                actions.className = "saved-color-actions";
                actions.innerHTML = `
                    <button
                        type="button"
                        class="saved-color-edit"
                    >
                        ${context.t("colorPanel.edit")}
                    </button>
                    <button
                        type="button"
                        class="saved-color-delete"
                    >
                        ${context.t("colorPanel.delete")}
                    </button>
                `;

                actions
                    .querySelector(".saved-color-edit")
                    .addEventListener("click", ()=>{
                        openSavedColorForm(
                            index,
                            panel,
                            context,
                            item.color,
                            onSelect
                        );
                    });

                actions
                    .querySelector(".saved-color-delete")
                    .addEventListener("click", ()=>{

                    if(!confirm(context.t("colorPanel.confirmDeleteSaved"))){
                        return;
                    }

                    context.data.colorSettings.savedColors =
                        context.colorUtils.deleteSavedColor(
                            context.data.colorSettings.savedColors,
                            index
                        );

                    context.saveData();
                    renderSavedColors(panel, context, onSelect);
                });

                row.appendChild(swatch);
                row.appendChild(label);
                row.appendChild(actions);
                savedColors.appendChild(row);
            }
        );
    }

    function openSavedColorForm(
        index,
        panel,
        context,
        selectedColor,
        onSelect
    ){

        const formSlot =
            panel.querySelector(".saved-color-form-slot");

        const item =
            Number.isInteger(index) ?
                context.data.colorSettings.savedColors[index] :
                {
                    color:selectedColor,
                    label:""
                };

        const formColor =
            context.colorUtils.normalizeHexColor(item.color) ||
            selectedColor;

        formSlot.innerHTML = `
            <div class="saved-color-form">
                <div class="saved-color-form-row">
                    <label>
                        ${context.t("colorPanel.formColor")}
                    </label>
                    <input
                        type="color"
                        class="saved-color-form-picker"
                        value="${formColor}"
                        aria-label="${context.t("colorPanel.formColor")}"
                    >
                </div>

                <div class="saved-color-form-row">
                    <label>
                        ${context.t("colorPanel.formCode")}
                    </label>
                    <input
                        type="text"
                        class="saved-color-form-code"
                        value="${formColor}"
                        placeholder="#ffcc00"
                    >
                </div>

                <div class="saved-color-form-row">
                    <label>
                        ${context.t("colorPanel.formLabel")}
                    </label>
                    <input
                        type="text"
                        class="saved-color-form-label"
                        value="${escapeAttribute(item.label)}"
                    >
                </div>

                <div class="saved-color-form-error"></div>

                <div class="saved-color-form-actions">
                    <button
                        type="button"
                        class="saved-color-form-cancel"
                    >
                        ${context.t("colorPanel.cancel")}
                    </button>

                    <button
                        type="button"
                        class="saved-color-form-save"
                    >
                        ${context.t("colorPanel.save")}
                    </button>
                </div>
            </div>
        `;

        const picker =
            formSlot.querySelector(
                ".saved-color-form-picker"
            );

        const codeInput =
            formSlot.querySelector(
                ".saved-color-form-code"
            );

        const labelInput =
            formSlot.querySelector(
                ".saved-color-form-label"
            );

        const error =
            formSlot.querySelector(
                ".saved-color-form-error"
            );

        function updateFormColor(color){

            const normalizedColor =
                context.colorUtils.normalizeHexColor(color);

            if(!normalizedColor){
                return;
            }

            picker.value = normalizedColor;
            codeInput.value = normalizedColor;
            error.innerText = "";
        }

        picker.addEventListener("input", ()=>{
            updateFormColor(picker.value);
        });

        codeInput.addEventListener("input", ()=>{

            const normalizedColor =
                context.colorUtils.normalizeHexColor(
                    codeInput.value
                );

            if(normalizedColor){
                picker.value = normalizedColor;
                error.innerText = "";
            }
        });

        formSlot
            .querySelector(".saved-color-form-cancel")
            .addEventListener("click", event=>{
                event.stopPropagation();

                formSlot.innerHTML = "";
            });

        formSlot
            .querySelector(".saved-color-form-save")
            .addEventListener("click", event=>{
            event.stopPropagation();

            const normalizedColor =
                context.colorUtils.normalizeHexColor(
                    codeInput.value
                );

            if(!normalizedColor){
                error.innerText =
                    context.t("colorPanel.invalidColor");
                return;
            }

            context.data.colorSettings.savedColors =
                context.colorUtils.upsertSavedColor(
                    context.data.colorSettings.savedColors,
                    {
                        color:normalizedColor,
                        label:labelInput.value
                    },
                    index
                );

            context.saveData();
            renderSavedColors(panel, context, onSelect);
            formSlot.innerHTML = "";
        });
    }

    function hasOpenSavedColorForm(panel){

        return Boolean(
            panel.querySelector(".saved-color-form")
        );
    }

    function closeSavedColorForm(panel){

        const formSlot =
            panel.querySelector(".saved-color-form-slot");

        if(formSlot){
            formSlot.innerHTML = "";
        }
    }

    root.TRELLO_LIKE_TODO_COLOR_PANEL = {
        applyTaskColor,
        closeColorPanel,
        openColorPanel,
        renderRecentColors,
        renderSavedColors,
        openSavedColorForm,
        closeSavedColorForm,
        hasOpenSavedColorForm,
        createSwatch,
        escapeAttribute
    };

})(typeof window !== "undefined" ? window : globalThis);
