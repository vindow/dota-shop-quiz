import React from 'react';
// Eventually store the items data into redux, pass array index into items
import items from '../../data/items.json';

class Item extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        console.log(items)
        return (
            <div>
                <img src={"http://cdn.dota2.com/apps/dota2/images/items/" + items[0].id + "_lg.png"} />
                <div>
                    <span>{items[0].dname}</span>
                    <p>{items[0].active[0].desc}</p>
                    <span>Cost: {items[0].cost}</span>
                </div>
            </div>
        );
    }
}

export default Item;