import React from 'react';
import items from '../../data/items.json';
import ItemHover from '../itemHover/itemHover.js';
import './item.css';

class Item extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="itemIcon">
                    <img src={"http://cdn.dota2.com/apps/dota2/images/items/" + items[this.props.index].id + "_lg.png"} />
                </div>
                <div className="itemInfo">
                    <ItemHover index={this.props.index}></ItemHover>
                </div>
            </div>
        );
    }
}

export default Item;