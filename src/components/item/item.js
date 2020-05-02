import React from 'react';
import { connect } from 'react-redux';
import items from '../../data/items.json';
import ItemHover from '../itemHover/itemHover.js';
import { select, deselect} from '../../actions.js';
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
    margin: 1%;
    border: 2px #343434 solid;
    &.fade-in {
        z-index: -1;
        animation: ${wrapperKeyFrame} 0.3s ease-in-out 0s 1;
    }
`;

const Icon = styled.div.attrs(props => ({
    url: props.url,
}))`
    background-size: cover;
    width: 4.4vw;
    height: 3.21vw;
    background-image: url(${props => props.url});
`;

const FadedIcon = styled.div.attrs(props => ({
    url: props.url,
}))`
    background-size: cover;
    width: 4.4vw;
    height: 3.21vw;
    filter: saturate(10%) opacity(50%);
    background-image: url(${props => props.url});
    z-index: 0;
`;

const ItemInfo = styled.div`
    display: none;
    z-index: 1;
    margin-top: 3px;
    margin-left: -2px;
    ${Wrapper}:hover & {
        display: block;
        position: absolute;
    }
`;

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
        if (this.props.locked !== true && this.props.clickable === true) {
            if (this.props.selected.includes(this.props.index)) {
                this.props.dispatch(deselect(this.props.index));
            } else {
                this.props.dispatch(select(this.props.index));
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
        let imgURL, hover;
        if (this.props.id === "recipe") {
            imgURL = "http://cdn.dota2.com/apps/dota2/images/items/recipe_lg.png"
            hover = <ItemHover index={-1}></ItemHover>
        } else {
            imgURL = "http://cdn.dota2.com/apps/dota2/images/items/" + this.props.id + "_lg.png"
            hover = <ItemHover index={this.getItemIndex()}></ItemHover>
        }
        let div;
        if (this.props.selected.includes(this.props.index)) {
            div = <FadedIcon url={imgURL} onClick={this.selectItem}></FadedIcon>
        } else {
            div = <Icon url={imgURL} onClick={this.selectItem}></Icon>
        }

        return(
            <Wrapper ref={this.wrapperRef}>
                {div}
                <ItemInfo>
                    {hover}
                </ItemInfo>
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        selected : state.selected
    };
}

export default connect(mapStateToProps)(Item);