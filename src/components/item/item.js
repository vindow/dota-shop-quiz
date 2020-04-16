import React from 'react';
import { connect } from 'react-redux';
import ReactHover from 'react-hover';
import items from '../../data/items.json';
import ItemHover from '../itemHover/itemHover.js';
import { select, deselect} from '../../actions.js';
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

    selectItem = () => {
        if (this.props.selected[this.props.index] === 0) {
            this.props.dispatch(select(this.props.index));
        } else {
            this.props.dispatch(deselect(this.props.index));
        }
    }

    render() {
        if (this.props.id === "recipe") {
            return(
                <ReactHover options={hoverOptions}>
                    <ReactHover.Trigger type='trigger'>
                        <div className="itemIcon" onClick={this.selectItem}>
                            <img alt="" src="http://cdn.dota2.com/apps/dota2/images/items/recipe_lg.png" />
                        </div>
                    </ReactHover.Trigger>
                    <ReactHover.Hover type='hover'>
                        <ItemHover index={-1}></ItemHover>
                    </ReactHover.Hover>
                </ReactHover>
            );
        } else {
            return (
                <ReactHover options={hoverOptions}>
                    <ReactHover.Trigger type='trigger'>
                        <div className="itemIcon" onClick={this.selectItem}>
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
}

function mapStateToProps(state) {
    return {
        selected : state.selected
    };
}

export default connect(mapStateToProps)(Item);