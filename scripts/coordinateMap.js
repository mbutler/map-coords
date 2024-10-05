class coord {
    coords() {
        let rows = this.row1 - this.row0 + 1;
        let cols = this.col1 - this.col0 + 1;
        for (let i = 0; i < cols; i++) {
            let label = this.labelGen(this.xValue, i);
            const name = new PIXI.Text(label, this.style);
            name.anchor.set(0.5);
            let pos = this.top(this.row0, i + this.col0);
            name.position.set(pos[0], pos[1]);
            this.ref.addChild(name);
        }
        for (let i = 0; i < rows; i++) {
            let label = this.labelGen(this.yValue, i);
            const name = new PIXI.Text(label, this.style);
            name.anchor.set(0.5, 0.5);
            let pos = this.left(i + this.row0, this.col0);
            name.position.set(pos[0], pos[1]);
            this.ref.addChild(name);
        }
    }

    individual() {
        let rows = this.row1 - this.row0 + 1;
        let cols = this.col1 - this.col0 + 1;
        let tinyStyle = new PIXI.TextStyle({
            fontFamily: CONFIG.defaultFontFamily,
            fontSize: this.size / 6,
            fill: "#FFFFFF",
            stroke: "#111111",
            strokeThickness: 3,
            align: 'center',
        });
        for (let c = 0; c < cols; c++) {
            let colName = this.labelGen(this.xValue, c);
            for (let r = 0; r < rows; r++) {
                let rowName = this.labelGen(this.yValue, r);
                let label = `${colName}, ${rowName}`;
                let name = new PIXI.Text(label, tinyStyle);
                let pos = canvas.grid.grid.getPixelsFromGridPosition(r + this.row0, c + this.col0);
                if (this.isHexGrid) {
                    pos[0] += this.w / 3;
                    pos[1] += this.h / 8;
                }
                name.position.set(pos[0], pos[1]);
                this.label.addChild(name);
            }
        }
    }

    labelGen(val, i) {
        switch (val) {
            case "num": return `${i}`;
            case "let": {
                if (i < 26) return String.fromCharCode(65 + i);
                else {
                    return this.numToSSColumn(i);
                }
            }
        }
    }

    numToSSColumn(num) {
        let s = '', t;
        while (num > 0) {
            t = (num - 1) % 26;
            s = String.fromCharCode(65 + t) + s;
            num = Math.floor((num - t) / 26);
        }
        return s || undefined;
    }

    top(row, col) {
        let pos = canvas.grid.grid.getPixelsFromGridPosition(row, col);
        pos[0] += this.w / 2;
        pos[1] = this.internal.top - this.off - this.size / 4;
        return pos;
    }

    left(row, col) {
        let pos = canvas.grid.grid.getPixelsFromGridPosition(row, col);
        pos[1] += this.isHexGrid ? 0 : this.h / 2;
        pos[0] = this.internal.left - this.off - this.size / 4;
        return pos;
    }

    mouseCoords(event) {
        let pos = event.data.getLocalPosition(canvas.app.stage);
        let [row, col] = canvas.grid.grid.getGridPositionFromPixels(pos.x, pos.y);
        row -= this.row0;
        col -= this.col0;
        let rowName = this.labelGen(this.yValue, row);
        let colName = this.labelGen(this.xValue, col);
        let name = new PIXI.Text(`${colName}, ${rowName}`, this.style);
        name.anchor.set(0.2);
        name.position.set(pos.x, pos.y);
        let label = canvas.interface.addChild(name);
        setTimeout(() => { label.destroy(); }, this.timeOut);
    }

    addListener() {
        let modifierKey = game.settings.get("map-coords", "modifierKey");
        canvas.stage.on("click", (event) => {
            if (!game.keyboard.isModifierActive(modifierKey)) return;
            this.mouseCoords(event);
        });
    }

    addContainer() {
        this.ref = canvas.interface.addChild(new PIXI.Container());
        this.label = canvas.interface.addChild(new PIXI.Container());
        this.ref.visible = true;
        this.label.visible = false;
    }

    toggle() {
        switch (this.state) {
            case 1: {
                this.ref.visible = true;
                this.label.visible = true;
                this.state = 2;
                break;
            }
            case 2: {
                this.ref.visible = false;
                this.label.visible = false;
                this.state = 3;
                break;
            }
            case 3: {
                this.ref.visible = true;
                this.label.visible = false;
                this.state = 1;
                break;
            }
        }
    }

    logTokenCoordinates() {
        try {
            // Get all tokens on the canvas
            const tokens = canvas.tokens.placeables;
            if (tokens.length === 0) return; // No tokens to process

            // Array to hold each token's coordinate information
            let tokenCoordinates = [];

            // Iterate over each token
            for (let token of tokens) {
                // Get token's center position
                let x = token.x + token.w / 2;
                let y = token.y + token.h / 2;

                // Convert pixel position to grid coordinates
                let [row, col] = canvas.grid.grid.getGridPositionFromPixels(x, y);

                // Adjust for grid origin
                row -= this.row0;
                col -= this.col0;

                // Generate coordinate labels
                let rowName = this.labelGen(this.yValue, row);
                let colName = this.labelGen(this.xValue, col);

                // Compile token information
                let tokenInfo = `${token.document.name}: ${colName}, ${rowName}`;
                tokenCoordinates.push(tokenInfo);
            }

            // Create the message content
            let messageContent = `<b>Token Starting Coordinates:</b><br>${tokenCoordinates.join('<br>')}`;

            // Send the message to chat
            ChatMessage.create({
                content: messageContent,
                speaker: { alias: "Map Coordinates" }
            });
        } catch (error) {
            console.error("Error in logTokenCoordinates:", error);
        }
    }

    constructor() {
        try {
            this.internal = canvas.dimensions.sceneRect;
            this.size = canvas.dimensions.size;
            let fontSize = game.settings.get("map-coords", "fontSize") || this.size / 2;
            let fontColor = game.settings.get("map-coords", "fontColor") || "#FFFFFF";
            this.style = new PIXI.TextStyle({
                fontFamily: CONFIG.defaultFontFamily,
                fontSize: fontSize,
                fill: fontColor,
                stroke: "#111111",
                strokeThickness: 3,
                align: 'center',
            });
            let [row0, col0] = canvas.grid.grid.getGridPositionFromPixels(this.internal.left, this.internal.top);
            let [row1, col1] = canvas.grid.grid.getGridPositionFromPixels(this.internal.right, this.internal.bottom);
            this.row0 = row0;
            this.row1 = row1;
            this.col0 = col0;
            this.col1 = col1;
            this.off = game.settings.get("map-coords", "offset");
            this.xValue = game.settings.get("map-coords", "xValue");
            this.yValue = game.settings.get("map-coords", "yValue");
            this.timeOut = game.settings.get("map-coords", "timeOut");
            this.h = canvas.grid.h;
            this.w = canvas.grid.w;
            this.isHexGrid = canvas.grid.isHex;
            this.state = 1;
            this.addContainer();
            this.coords();
            this.individual();
            this.addListener();
        } catch (error) {
            console.error("Error initializing MapCoordinates:", error);
        }
    }
}

function getSceneControlButtons(buttons) {
    let tokenButton = buttons.find(b => b.name == "token");
    if (tokenButton) {
        // Ensure tools array exists
        if (!tokenButton.tools) tokenButton.tools = [];

        tokenButton.tools.push({
            name: "map-coords",
            title: game.i18n.localize("button.name"),
            icon: "far fa-map",
            visible: true,
            onClick: () => {
                // Ensure MapCoordinates is initialized
                if (!window.MapCoordinates) {
                    if (!canvas.ready) {
                        ui.notifications.warn("Canvas is not ready yet.");
                        return;
                    }
                    window.MapCoordinates = new coord();
                }
                window.MapCoordinates.toggle();
            },
            button: true
        });

        // Add new tool for logging token coordinates
        tokenButton.tools.push({
            name: "log-token-coords",
            title: game.i18n.localize("button.logTokenCoords"),
            icon: "fas fa-list",
            visible: true,
            onClick: () => {
                if (!window.MapCoordinates) {
                    if (!canvas.ready) {
                        ui.notifications.warn("Canvas is not ready yet.");
                        return;
                    }
                    window.MapCoordinates = new coord();
                }
                window.MapCoordinates.logTokenCoordinates();
            },
            button: true
        });
    }
}



Hooks.on('canvasReady', () => {
    if (!canvas.grid.isGrid) return;
    try {
        let map = new coord();
        window.MapCoordinates = map;
        // Call the logTokenCoordinates method
        map.logTokenCoordinates();
    } catch (error) {
        console.error("Error creating MapCoordinates instance on canvasReady:", error);
    }
});

Hooks.on('getSceneControlButtons', getSceneControlButtons);
