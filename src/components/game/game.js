import React from 'react';
import Item from '../item/item';
import items from '../../data/items.json';

class Game extends React.Component {

    constructor(props) {
        super(props);
        console.log(items);
        const itemsWithRecipes = items.filter(item => item.components !== null);
        console.log(itemsWithRecipes);
    }

    render() {
        return(
            <div>
                <Item index="0"></Item>
                <div>
                    
                </div>
            </div>
        );
    }
}

export default Game;