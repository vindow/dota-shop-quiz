import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Border = styled.div`
    margin-bottom: 0.5em;
    margin-top: -1em;
    position: relative;
    height: 5px;
    width: 100%;
    border-bottom: 2px solid rgb(49, 49, 49);
`;

const Bar = styled.div.attrs(props => ({
    percent: props.percent
}))`
    background: ${props => {
        let r;
        let g;
        if (props.percent > 50) {
            r = props.percent * -3 + 300;
            g = 150;
        } else {
            g = props.percent * 3;
            r = 150;
        }
        return "rgb(" + r + "," + g + ",0)";
    }};
    height: 100%;
    border-radius: inherit;
    transition: width .1s linear;
    width: ${props => props.percent}%;
`;

class ProgressBar extends React.Component {
    render() {
        if (this.props.classic) {
            return null;
        } else {
            return(
                <Border>
                    <Bar  percent={this.props.percentage}></Bar>
                </Border>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        classic : state.classic
    }
}

export default connect(mapStateToProps)(ProgressBar);