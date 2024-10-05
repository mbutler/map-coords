Hooks.on('init', function () {
    game.settings.register("map-coords", "offset", {
        name: game.i18n.format("settings.offset.name"),
        hint: game.i18n.format("settings.offset.hint"),
        scope: 'client',
        type: Number,
        default: 0,
        config: true,
    });

    game.settings.register("map-coords", "xValue", {
        name: game.i18n.format("settings.xValue.name"),
        hint: game.i18n.format("settings.xValue.hint"),
        scope: 'world',
        type: String,
        choices: {
            "num": game.i18n.format("settings.value.number"),
            "let": game.i18n.format("settings.value.letter")
        },
        default: "num",
        config: true,
    });

    game.settings.register("map-coords", "yValue", {
        name: game.i18n.format("settings.yValue.name"),
        hint: game.i18n.format("settings.yValue.hint"),
        scope: 'world',
        type: String,
        choices: {
            "num": game.i18n.format("settings.value.number"),
            "let": game.i18n.format("settings.value.letter")
        },
        default: "num",
        config: true,
    });

    game.settings.register("map-coords", "startPoint", {
        name: game.i18n.format("settings.startPoint.name"),
        hint: game.i18n.format("settings.startPoint.hint"),
        scope: 'world',
        type: String,
        choices: {
            "left": game.i18n.format("settings.startPoint.left"),
            "center": game.i18n.format("settings.startPoint.center"),
            "right": game.i18n.format("settings.startPoint.right")
        },
        default: "left",
        config: false, // Set to false if not needed in the settings UI
    });

    // Updated modifierKey setting with choices
    game.settings.register("map-coords", "modifierKey", {
        name: game.i18n.format("settings.modifierKey.name"),
        hint: game.i18n.format("settings.modifierKey.hint"),
        scope: 'client',
        type: String,
        choices: {
            'Control': 'Control',
            'Alt': 'Alt',
            'Shift': 'Shift',
            'Meta': 'Meta'
        },
        default: 'Control',
        config: true,
    });

    game.settings.register("map-coords", "timeOut", {
        name: game.i18n.format("settings.timeOut.name"),
        hint: game.i18n.format("settings.timeOut.hint"),
        scope: 'client',
        type: Number,
        default: 1500,
        config: true,
    });

    // New settings for font size and color
    game.settings.register('map-coords', 'fontSize', {
        name: game.i18n.format("settings.fontSize.name"),
        hint: game.i18n.format("settings.fontSize.hint"),
        scope: 'client',
        config: true,
        type: Number,
        default: 24,
    });

    game.settings.register('map-coords', 'fontColor', {
        name: game.i18n.format("settings.fontColor.name"),
        hint: game.i18n.format("settings.fontColor.hint"),
        scope: 'client',
        config: true,
        type: String,
        default: "#FFFFFF",
    });
});
