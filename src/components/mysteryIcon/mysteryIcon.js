import React from 'react';
import { connect } from 'react-redux';
import items from '../../data/items.json';
import ItemHover from '../itemHover/itemHover.js';
import { deselect } from '../../actions.js';
import styled , { keyframes } from 'styled-components';

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

const Icon = styled.img `
    margin: 0px 5px;
`;

const ItemInfo = styled.div`
    display: none;
    ${Wrapper}:hover & {
        display: block;
        position: absolute;
    }
`;

class MysteryIcon extends React.Component {

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

    deselectItem = () => {
        this.props.dispatch(deselect(this.props.index));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.id === 'unknown' && this.props.id !== 'unknown') || (this.props.id === 'unknown'&& prevProps.id !== 'unknown')) {
            const wrapper = this.wrapperRef.current;
            wrapper.classList.add('fade-in');
            setTimeout(() => {
                wrapper.classList.remove('fade-in');
            }, 300)
        }
    }

    render() {
        if (this.props.id === 'unknown') {
            return(
                <Wrapper ref={this.wrapperRef}>
                    <div className="itemIcon">
                        <Icon alt="" src="http://cdn.dota2.com/apps/dota2/images/quiz/item-slot-unknown.png" />
                    </div>
                </Wrapper>
            );
        } else if (this.props.id === "recipe") {
            return(
                <Wrapper ref={this.wrapperRef}>
                    <div className="itemIcon" onClick={this.deselectItem}>
                        <Icon alt="" src="http://cdn.dota2.com/apps/dota2/images/items/recipe_lg.png" />
                    </div>
                    <ItemInfo>
                        <ItemHover index={-1}></ItemHover>
                    </ItemInfo>
                </Wrapper>
            );
        } else {
            return (
                <Wrapper ref={this.wrapperRef}>
                    <div className="itemIcon" onClick={this.deselectItem}>
                        <Icon alt="" src={"http://cdn.dota2.com/apps/dota2/images/items/" + this.props.id + "_lg.png"} />
                    </div>
                    <ItemInfo>
                        <ItemHover index={this.getItemIndex()}></ItemHover>
                    </ItemInfo>
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

export default connect(mapStateToProps)(MysteryIcon);