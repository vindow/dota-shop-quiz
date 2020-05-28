import React from 'react';
import { connect } from 'react-redux';
import { applySettings } from '../../actions.js';
import styled, { keyframes } from 'styled-components';

const dialogKeyFrame = keyframes`
    0% {
        opacity: 0;
        top: 0%;
    }
    100% {
        opacity: 1;
        top: 20%;
    }
`;

const Dialog = styled.div`
    width: 30%;
    position: fixed;
    display: block;
    text-align: center;
    margin: auto;
    top: 20%;
    left: 0;
    right: 0;
    padding: 0.25em 0em 1em 0em;
    background-color: #222222;
    border: 2px rgb(49, 49, 49) groove;
    animation: ${dialogKeyFrame} 0.5s ease-in-out 0s 1;
`;

const OptionText = styled.div`
    font-size: 1.25em;
    margin: 0.5em 0em;
`;

const WarningText = styled.div`
    font-size: 1em;
    margin: 0.5em;
    color: red;
`;

const ConfirmButton = styled.button`
    background-color: #224022;
    border: 1px solid #336033;
    text-align: center;
    color: #33ca33;
    font-size: 1.25em;
    padding: 6px 22px;
    margin: 0em 0.5em 0.25em 0.5em;
`;

const CancelButton = styled.button`
    background-color: #601a1a;
    border: 1px solid #703333;
    text-align: center;
    color: #da2222;
    font-size: 1.25em;
    padding: 6px 22px;
    margin: 0em 0.5em 0.25em 0.5em;
`;

const DifficultyButton = styled.button`
    background-color: #2d2d2d;
    border: 2px groove #3d3d3d;
    text-align: center;
    padding: 6px 22px;
    color: #aaaaaa;
    font-size: 1em;
    margin: 0em 0.5em 0em 0.5em;
    &:disabled {
        background-color: #444444;
        color: #dddddd;
        border: 2px solid #666666;
    }
`;

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEasy: this.props.easy,
            isClassic: this.props.classic
        }
    }
    
    setEasy = () => {
        console.log("set to easy");
        this.setState({isEasy : true});
    }

    setHard = () => {
        console.log("set to hard");
        this.setState({isEasy : false});
    }

    setClassic = () => {
        console.log("set to classic");
        this.setState({isClassic : true});
    }

    setTimed = () => {
        console.log("Set to timed");
        this.setState({isClassic : false});
    }

    apply = () => {
        if (this.state.isEasy === this.props.easy && this.state.isClassic === this.props.classic) {
            this.props.onClose(false);
        } else {
            this.props.onClose(true);
            this.props.dispatch(applySettings({easy: this.state.isEasy, classic: this.state.isClassic}));
        }
    }

    close = () => {
        this.props.onClose(false);
    }

    render() {
        return (
            <Dialog>
                <OptionText>Difficulty</OptionText>
                <div>
                    <DifficultyButton onClick={this.setEasy} disabled={this.state.isEasy}>Easy</DifficultyButton>
                    <DifficultyButton onClick={this.setHard} disabled={!this.state.isEasy}>Hard</DifficultyButton>
                </div>
                <OptionText>Game Mode</OptionText>
                <div>
                    <DifficultyButton onClick={this.setClassic} disabled={this.state.isClassic}>Classic</DifficultyButton>
                    <DifficultyButton onClick={this.setTimed} disabled={!this.state.isClassic}>Time Attack</DifficultyButton>
                </div>
                <WarningText>Changing options will reset game progress!</WarningText>
                <div>
                    <ConfirmButton onClick={this.apply}>Apply</ConfirmButton>
                    <CancelButton onClick={this.close}>Cancel</CancelButton>
                </div>
            </Dialog>
        );
    }

}

function mapStateToProps(state) {
    return {
        classic : state.classic,
        easy : state.easy
    };
}

export default connect(mapStateToProps)(Settings);