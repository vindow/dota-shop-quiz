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

    /*constructor(props) {
        super(props);
    }*/

    getItemIndex = () => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === this.props.id) {
                return i;
            }
        }
        return 0;
    }

    render() {
        return (
            <ReactHover options={hoverOptions}>
                <ReactHover.Trigger type='trigger'>
                    <div className="itemIcon">
                        <img alt="" src={"http://cdn.dota2.com/apps/dota2/images/items/" + this.props.id + "_lg.png"} />
                    </div>
                </ReactHover.Trigger>
                <ReactHover.Hover type='hover'>
                    <ItemHover index={this.getItemIndex()}></ItemHover>
                </ReactHover.Hover>
            </ReactHover>
        );
    }
}

export default Item;