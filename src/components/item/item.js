import React from 'react';
import { connect } from 'react-redux';
import ReactHover from 'react-hover';
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
    &.fade-in {
        animation: ${wrapperKeyFrame} 0.3s ease-in-out 0s 1;
    }
`;

const Icon = styled.img`
    margin: 0px 5px;
    &.selected {
        filter: saturate(10%) opacity(50%);
    }
`;

const FadedIcon = styled.div`
    filter: saturate(10%) opacity(50%);
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
        let img, hover;
        if (this.props.id === "recipe") {
            img = <Icon ref={this.imgRef} alt="" src="http://cdn.dota2.com/apps/dota2/images/items/recipe_lg.png" />
            hover = <ItemHover index={-1}></ItemHover>
        } else {
            img = <Icon ref={this.imgRef} alt="" src={"http://cdn.dota2.com/apps/dota2/images/items/" + this.props.id + "_lg.png"} />
            hover = <ItemHover index={this.getItemIndex()}></ItemHover>
        }
        let div;
        if (this.props.selected.includes(this.props.index)) {
            div = <FadedIcon onClick={this.selectItem}>{img}</FadedIcon>
        } else {
            div = <div onClick={this.selectItem}>{img}</div>
        }
        return(
            <Wrapper ref={this.wrapperRef}>
                <ReactHover options={hoverOptions}>
                    <ReactHover.Trigger type='trigger'>
                        {div}
                    </ReactHover.Trigger>
                    <ReactHover.Hover type='hover'>
                        {hover}
                    </ReactHover.Hover>
                </ReactHover>
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