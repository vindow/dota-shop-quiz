import React from 'react';
import { connect } from 'react-redux';
import items from '../../data/items.json';
import ItemHover from '../itemHover/itemHover.js';
import { deselect } from '../../actions.js';
import styled , { keyframes } from 'styled-components';
import breakpoint from 'styled-components-breakpoint';

const imgPath = process.env.PUBLIC_URL + '/images/';

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
    ${ breakpoint('xs') `width:21.25px; height 16px;`}
    ${ breakpoint('sm') `width:42.5px; height 32px;`}
    ${ breakpoint('md') `width: 63.75px; height 48px;`}
    ${ breakpoint('lg') `width: 85px; height 64px;`}
    ${ breakpoint('xl') `width: 85px; height 64px;`}
    background-size: cover;
    background-image: url(${props => props.url});
`;

const ItemInfo = styled.div`
    display: none;
    z-index: 1;
    margin-top: 3px;
    margin-left: -2px;
    pointer-events: none;
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

    componentDidMount() {
        const wrapper = this.wrapperRef.current;
        wrapper.classList.add('fade-in');
        setTimeout(() => {
            wrapper.classList.remove('fade-in');
        }, 300)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevProps.id === 'unknown' && this.props.id !== 'unknown') || (this.props.id === 'unknown' && prevProps.id !== 'unknown')) {
            const wrapper = this.wrapperRef.current;
            wrapper.classList.add('fade-in');
            setTimeout(() => {
                wrapper.classList.remove('fade-in');
            }, 300)
        }
    }

    render() {
        let icon, hover;
        if (this.props.id === 'unknown') {
            icon = <Icon url={imgPath + "item-slot-unknown.png"}></Icon>
            hover = <div></div>;
        } else if (this.props.id === "recipe") {
            icon = <Icon url={imgPath + "recipe_lg.png"} onClick={this.deselectItem}></Icon>
            hover = <ItemInfo>
                        <ItemHover index={-1}></ItemHover>
                    </ItemInfo>
        } else {
            icon = <Icon url={imgPath + this.props.id + "_lg.png"} onClick={this.deselectItem}></Icon>
            hover = <ItemInfo>
                        <ItemHover index={this.getItemIndex()}></ItemHover>
                    </ItemInfo>
        }
        return (
            <Wrapper ref={this.wrapperRef}>
                {icon}
                {hover}
            </Wrapper>
        );
    }
}

function mapStateToProps(state) {
    return {
        selected : state.selected
    };
}

export default connect(mapStateToProps)(MysteryIcon);