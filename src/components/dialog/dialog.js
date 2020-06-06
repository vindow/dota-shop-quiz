import React from 'react';
import styled, { keyframes } from 'styled-components';
import Item from '../item/item.js';
import breakpoint from 'styled-components-breakpoint';

const mainKeyFrame = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const Main = styled.div`
    text-align: center;
    margin-top: -0.5em;
    animation: ${mainKeyFrame} 0.25s ease-in-out 0s 1;
`;

const Row = styled.div`
    display: flex;
    justify-content: center;
`;

const LargeText = styled.div`
    ${ breakpoint('xs') `font-size: 1.5em;`}
    ${ breakpoint('sm') `font-size: 2em;`}
    ${ breakpoint('md') `font-size: 3em;`}
    margin: 0.25em;
`;

const MediumText = styled.div`
    ${ breakpoint('xs') `font-size: 1em;`}
    ${ breakpoint('sm') `font-size: 1.5em;`}
    ${ breakpoint('md') `font-size: 2em;`}
    margin: 0.25em;
`;

const LargeSymbolText = styled.div`
    ${ breakpoint('xs') `font-size: 1em;`}
    ${ breakpoint('sm') `font-size: 1.5em;`}
    ${ breakpoint('md') `font-size: 2em;`}
    margin: auto 0;
`;

const RestartButton = styled.button`
    background-color: #333333;
    border: 1px solid #444444;
    text-align: center;
    padding: 6px 22px;
    color: #dddddd;
    font-size: 1.5em;
    margin-bottom: 0.25em;
    margin-top: 0.5em;
`;

class Dialog extends React.Component {
    constructor(props) {
        super(props);
    }

    getAnswer = () => {
        let components = [];
        let recipe = this.props.item.components;
        console.log(recipe);
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe"){
                components.push(<Item key={i} locked={true} clickable={false} id={recipe[i]}></Item>);
            } else {
                components.push(<Item id="recipe" locked={true} clickable={false}></Item>);
            }
            components.push(<LargeSymbolText>+</LargeSymbolText>);
        }
        components.pop();
        return components;
    }

    close = () => {
        this.props.onClose();
    }

    render() {
        if (this.props.win) {
            return(
                <Main>
                    <LargeText>Game Complete!</LargeText>
                    <LargeText>Final Score: {this.props.score}</LargeText>
                    <RestartButton onClick={this.close}>Replay?</RestartButton>
                </Main>
            );
        } else {
            return(
                <Main>
                    <LargeText>Game Over</LargeText>
                    <MediumText>Final Score: {this.props.score}</MediumText>
                    <MediumText>Items Completed: {this.props.streak}</MediumText>
                    <Row>
                        <Item id={this.props.item.id} locked={true} clickable={false}></Item>
                        <LargeSymbolText>=</LargeSymbolText>
                        {this.getAnswer()}
                    </Row>
                    <RestartButton onClick={this.close}>Restart</RestartButton>
                </Main>
            );
        }
    }
}

export default Dialog;