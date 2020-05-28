import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import Game from './components/game/game.js';
import produce from 'immer';


const initialState = {
    selected: [],
    easy: true,
    classic: true
};

function reducer(state = initialState, action) {
    switch(action.type) {
        case 'SELECT':
            return produce(state, draft => {
                draft.selected.push(action.value);
            })
        case 'DESELECT':
            return produce(state, draft => {
                draft.selected.splice(draft.selected.indexOf(action.value), 1);
            })
        case 'RESET':
            return {
                selected: [],
                easy: state.easy,
                classic: state.classic
            }
        case 'APPLY_SETTINGS':
            return {
                selected: [],
                easy: action.value.easy,
                classic: action.value.classic
            }
        case 'SET_DIFFICULTY':
            return {
                selected: state.selected,
                easy: action.value,
                classic: state.classic
            }
        case "SET_GAME_MODE":
            return {
                selected: state.selected,
                easy: state.easy,
                classic: action.value
            }
        default:
            return state;
    }
}

const store = createStore(reducer);

const App = () => (
    <Provider store={store}>
        <Game></Game>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));

