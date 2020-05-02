import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import Game from './components/game/game.js';
import produce from 'immer';


const initialState = {
    selected: [],
    easy: true
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
                easy: state.easy
            }
        case 'SET_DIFFICULTY':
            return {
                easy: action.value
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

