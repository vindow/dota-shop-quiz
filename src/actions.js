export function select(value) {
    return {
        type : "SELECT",
        value
    };
}

export function deselect(value) {
    return {
        type : "DESELECT",
        value
    };
}

export function reset() {
    return {
        type : "RESET"
    };
}

export function applySettings(value) {
    return {
        type : "APPLY_SETTINGS",
        value
    };
}

export function setDifficulty(value) {
    return {
        type : "SET_DIFFICULTY",
        value
    };
}

export function setGameMode(value) {
    return {
        type : "SET_GAME_MODE",
        value
    };
}