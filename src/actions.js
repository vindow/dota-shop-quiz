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

export function setDifficulty(value) {
    return {
        type : "SET_DIFFICULTY",
        value
    }
}