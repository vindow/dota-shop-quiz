import React from 'react';
import { connect } from 'react-redux';
import ReactHover from 'react-hover';
import items from '../../data/items.json';
import ItemHover from '../itemHover/itemHover.js';
import { select, deselect} from '../../actions.js';
import styled , { keyframes } from 'styled-components';
import './item.css';

const wrapperKeyFrame = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity 1;
    }
`;

const Wrapper = styled.div`
    &.fade-in {
        animation: ${wrapperKeyFrame} 0.3s ease-in-out 0s 1;
    }
`;

const hoverOptions = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0
}

class Item extends React.Component {

    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
    }

    getItemIndex = () => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === this.props.id) {
                return i;
            }
        }
        return 0;
    }

    selectItem = () => {
        if (this.props.locked !== true) {
            if (this.props.selected[this.props.index] === 0) {
                this.props.dispatch(select(this.props.index));
            } else {
                this.props.dispatch(deselect(this.props.index));
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.locked === true) {
            const wrapper = this.wrapperRef.current;
            wrapper.classList.add('fade-in');
            setTimeout(() => {
                wrapper.classList.remove('fade-in');
            }, 300)
        }
    }

    render() {
        if (this.props.id === "recipe") {
            return(
                <Wrapper ref={this.wrapperRef}>
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
                </Wrapper>
            );
        } else {
            return (
                <Wrapper ref={this.wrapperRef}>
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
                </Wrapper>
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