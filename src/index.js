import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import './index.css';
import Game from './components/game/game.js';


const initialState = {
    selected : [0, 0, 0, 0, 0, 0, 0, 0, 0]
};

function reducer(state = initialState, action) {
    switch(action.type) {
        case 'SELECT':
            return {
                selected : state.selected.map((item, index) => {
                    if (index === action.value) {
                        return 1;
                    }
                    return item;
                })
            }
        case 'DESELECT':
            return {
                selected : state.selected.map((item, index) => {
                    if (index === action.value) {
                        return 0;
                    }
                    return item;
                })
            }
        case 'RESET':
            return initialState;
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

