import React from 'react';
import { connect } from 'react-redux';
import { reset } from '../../actions.js';
import Item from '../item/item';
import items from '../../data/items.json';
import styled, { keyframes } from 'styled-components';
import './game.css';

const wrapperKeyFrame = keyframes`
    0% {
        opacity: 1;
        top: 0px
    }
    100% {
        opacity 0;
        top: -100px;
    }
`;
const Wrapper = styled.div`
    opacity: 0;
    position: relative;
    background-color: red;
    &.is-test-open {
        animation: ${wrapperKeyFrame} 1s ease-in-out 0s 1;
    }
    
`;
class Game extends React.Component {

    constructor(props) {
        super(props);
        console.log(items);

        this.wrapperRef = React.createRef();
        
        let itemsWithRecipe = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].components !== null) {
                itemsWithRecipe.push(items[i]);
            }
        }
        console.log(itemsWithRecipe);
        let materialIDs = [];
        for (let i = 0; i < itemsWithRecipe.length; i++) {
            let tmp = itemsWithRecipe[i].components;
            for (let j = 0; j < tmp.length; j++) {
                if (!materialIDs.includes(tmp[j])) {
                    materialIDs.push(tmp[j]);
                }
            }
        }
        console.log(materialIDs);
        
        let recipe = itemsWithRecipe[0].components;

        let components = [];
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe"){
                let component = this.getItemData(recipe[i]);
                if (component === null) {
                    console.log("null item! id: " + recipe[i]);
                }
                components.push(component);
            }
        }
        let filtered = items.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (recipe[i] === item.id) {
                    return;
                }
            }
            if (materialIDs.includes(item.id)) {
                return item;
            }
        });
        let componentCosts = [];
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe") {
                componentCosts.push(this.getItemData(recipe[i]).cost);
            }
        }
        if (itemsWithRecipe[0].cost !== 0) {
            componentCosts.push(itemsWithRecipe[0].cost);
        }
        console.log(componentCosts);
        let costFiltered = filtered.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (item.cost <= (componentCosts[i] + 100) && item.cost >= (componentCosts[i] - 100)) {
                    return item;
                }
            }
        });
        console.log(costFiltered);
        let randItems = [];
        for (let i = 0; i < 8 - recipe.length; i++) {
            let rand = Math.floor(Math.random() * costFiltered.length);
            randItems.push(costFiltered[rand]);
        }
        components = components.concat(randItems);

        this.state = {
            itemsToQuiz: itemsWithRecipe,
            current: 0,
            currentRecipe : recipe,
            currentQuiz : components,
            materials: materialIDs,
            frozen: false
        }
    }

    getItemData = (itemID) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemID) {
                return items[i];
            }
        }
        return null;
    }

    generateRandomItems = (recipe) => {
        //TODO: Add an exception to power treads (don't add band of elvenskin and robe of magi to pool)
        /*let components = recipe.filter((item) => {
            return item !== "recipe"
        });*/
        let filtered = items.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (recipe[i] === item.id) {
                    return;
                }
            }
            if (this.state.materials.includes(item.id)) {
                return item;
            }
        });
        console.log(filtered);
        let componentCosts = [];
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe") {
                componentCosts.push(this.getItemData(recipe[i]).cost);
            }
        }
        console.log(this.state.itemsToQuiz[this.state.current + 1]);
        let recipeCost = this.state.itemsToQuiz[this.state.current + 1].RecipeCost;
        if (recipeCost !== 0) {
            componentCosts.push(recipeCost);
        }
        console.log(componentCosts);
        let costFiltered = filtered.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (item.cost <= (componentCosts[i] + 200) && item.cost >= (componentCosts[i] - 200)) {
                    return item;
                }
            }
        });
        console.log(costFiltered);
        let randItems = [];
        for (let i = 0; i < 8 - recipe.length; i++) {
            let rand = Math.floor(Math.random() * costFiltered.length);
            randItems.push(costFiltered[rand]);
        }
        return randItems;
        
    }

    getQuizComponents = (recipe) => {
        let components = [];
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe"){
                let component = this.getItemData(recipe[i]);
                if (component === null) {
                    console.log("null item! id: " + recipe[i]);
                }
                components.push(component);
            }
        }
        return components.concat(this.generateRandomItems(recipe));
    }

    createQuiz = () => {
        let recipe = this.state.itemsToQuiz[this.state.current].components;
        let components = this.getQuizComponents(recipe);
        console.log(components);
        this.setState({
            currentRecipe : recipe, 
            currentQuiz : components
        });
    }

    createQuizComponents = () => {
        let quizItems = []
        for (let i = 0; i < this.state.currentQuiz.length; i++) {
                quizItems.push(<Item key={i} locked={this.state.frozen} id={this.state.currentQuiz[i].id} index={i}></Item>);
        }
        return quizItems;
    }

    createMysteryIcons = () => {
        let numIcons = this.state.itemsToQuiz[this.state.current].components.length;
        let icons = [];
        for (let i = 0; i < numIcons; i++) {
            icons.push(
                <div key={i}>
                    <img src="http://cdn.dota2.com/apps/dota2/images/quiz/item-slot-unknown.png" alt=""></img>
                </div>
            );
        }
        return icons;
    }

    nextQuiz = () => {
        let i = this.state.current + 1;
        if (i < this.state.itemsToQuiz.length) {
            let recipe = this.state.itemsToQuiz[i].components;
            let components = this.getQuizComponents(recipe);
            this.setState({
                current: i,
                currentRecipe : recipe,
                currentQuiz : components
            })
        } else {
            //TODO: Add proper win screen
            console.log("You Win!");
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.selected);
        if (!this.state.frozen) {
            let recipe = this.state.currentRecipe.slice();
            let selected = [];
            for (let i = 0; i < this.props.selected.length - 1; i++) {
                if (this.props.selected[i] === 1) {
                    selected.push(this.state.currentQuiz[i].id);
                }
            }
            if (this.props.selected[8] === 1) {
                selected.push("recipe");
            }
            if (recipe.length === selected.length) {
                recipe.sort();
                selected.sort();
                let correct = true;
                for (let i = 0; i < recipe.length; i++) {
                    if(recipe[i] !== selected[i]) {
                        correct = false;
                        break;
                    }
                }
                const wrapper = this.wrapperRef.current;
                wrapper.classList.add('is-test-open');
                if (correct) {
                    this.props.dispatch(reset());
                    this.setState({frozen : true});
                    setTimeout(() => {
                        wrapper.classList.remove('is-test-open');
                        console.log("Correct!");
                        this.nextQuiz();
                        this.setState({frozen : false});
                    }, 1000)
                } else {
                    console.log("Incorrect!");
                    this.props.dispatch(reset());
                }
                
            }
        }
    }

    /*getStreak = () => {
        return (
            <span>
                TEST
            </span>
        );
    }*/

    render() {
        return(
            <div className="game">
                <div className="gameQuizItem">
                    <Item id={this.state.itemsToQuiz[this.state.current].id} locked={this.state.frozen}></Item>
                </div>
                <div className="gameMysteryRow">
                    {this.createMysteryIcons()}
                </div>
                <div className="gameComponentRow">
                    {this.createQuizComponents()}
                    <Item id="recipe" locked={this.state.frozen} index={8}></Item>
                </div>
                <Wrapper ref={this.wrapperRef}>
                    <div className="test">
                        <div className="test__body">
                            TEST
                        </div>
                    </div>
                </Wrapper>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        selected : state.selected
    };
}

export default connect(mapStateToProps)(Game);