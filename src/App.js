import React from 'react';
import Item from './components/item/item.js';
import './App.css';
import Game from './components/game/game.js';

function App() {
  // let items = []
  // for (let i = 0; i < 100; i++) {
  //   items.push(<Item index={i}></Item>)
  // }
  return (
    // <div className="grid">
    //   {items}
    // </div>
    <div>
      <Game></Game>
    </div>
  );
}

export default App;
