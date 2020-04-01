import React from 'react';
import ReactHover from 'react-hover';
import items from '../../data/items.json';
import ItemHover from '../itemHover/itemHover.js';
import './item.css';

const hoverOptions = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0
  }

class Item extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ReactHover options={hoverOptions}>
                <ReactHover.Trigger type='trigger'>
                    <div className="itemIcon">
                        <img src={"http://cdn.dota2.com/apps/dota2/images/items/" + items[this.props.index].id + "_lg.png"} />
                    </div>
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                    <ItemHover index={this.props.index}></ItemHover>
                </ReactHover.Hover>
            </ReactHover>
        );
    }
}

export default Item;