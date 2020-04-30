import React from 'react';
import { connect } from 'react-redux';
import { reset } from '../../actions.js';
import Item from '../item/item';
import MysteryIcon from '../mysteryIcon/mysteryIcon';
import items from '../../data/items.json';
import styled, { keyframes } from 'styled-components';
import './game.css';

const wrapperKeyFrame = keyframes`
    0% {
        opacity: 1;
        top: -100px
    }
    100% {
        opacity 0;
        top: -200px;
    }
`;
const Wrapper = styled.div`
    opacity: 0;
    position: relative;
    color : red;
    text-shadow: -2px 0 black, 0 2px black, 2px 0 black, 0 -2px black;
    font-size : 3em;
    font-weight: bold;
    margin : auto;
    top: -100px;
    text-align: center;
    &.is-test-open {
        animation: ${wrapperKeyFrame} 1s ease-in-out 0s 1;
    }
    
`;

const streakNames = ["Try Again!", "Correct!", "Double Answer!", "Answering Spree!", "Dominating!", "Mega Answer!", "Unstoppable!", "Wicked Sick!", "Monster Answer!", "Godlike!", "Beyond Godlike!"]
class Game extends React.Component {

    constructor(props) {
        super(props);
        console.log(items);

        this.wrapperRef = React.createRef();
        
        // First time initialization
        
        let itemsWithRecipe = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].components !== null) {
                itemsWithRecipe.push(items[i]);
            }
        }
        console.log(itemsWithRecipe);

        // Initialize list of items that are components
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

        // First time initialization for the very first quiz item
        // Should refactor this out so it can just be called in respective functions eventually (probably never)

        let recipe = itemsWithRecipe[0].components;

        // First add the list of real components
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

        // Get items that are components (items that build into other items), exclude items included in recipe
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

        // Get the costs of all items in the current recipe (including recipe cost)
        let componentCosts = [];
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe") {
                componentCosts.push(this.getItemData(recipe[i]).cost);
            }
        }
        if (itemsWithRecipe[0].RecipeCost !== 0) {
            componentCosts.push(itemsWithRecipe[0].RecipeCost);
        }

        // Get items only within +/-200 of any item in the recipe
        let costFiltered = filtered.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (item.cost <= (componentCosts[i] + 200) && item.cost >= (componentCosts[i] - 200)) {
                    return item;
                }
            }
        });

        // Populate randItems with items close in cost to recipe items
        let randItems = [];
        if (costFiltered.length <= (8 - recipe.length)) {
            // Okay to add repeats if not enough valid items
            randItems = costFiltered;
            for (let i = 0; i < 8 - recipe.length - randItems.length; i++) {
                let rand = Math.floor(Math.random() * costFiltered.length);
                randItems.push(costFiltered[rand]);
            }
        } else {
            let alreadyPicked = []
            for (let i = 0; i < 8 - recipe.length; i++) {
                // Try not to add repeats if enough valid items
                let rand;
                do {
                    rand = Math.floor(Math.random() * costFiltered.length);
                }  while (alreadyPicked.includes(rand));
                randItems.push(costFiltered[rand]);
                alreadyPicked.push(rand);
            }
        }
        
        components = components.concat(randItems);
        this.state = {
            itemsToQuiz: itemsWithRecipe,
            current: 0,
            currentRecipe : recipe,
            currentQuiz : components,
            materials: materialIDs,
            frozen: false,
            streak : 0,
            score : 0,
            tries : 3
        }
    }

    // Gets the item's object for a given id
    getItemData = (itemID) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === itemID) {
                return items[i];
            }
        }
        return null;
    }

    // Generates the random items to fill the rest of the quiz items with wrong items
    // Tries to generate items that are close in price to the real components
    generateRandomItems = (recipe) => {
        //TODO: Add an exception to power treads (don't add band of elvenskin and robe of magi to pool)
        /*let components = recipe.filter((item) => {
            return item !== "recipe"
        });*/
        // Get only items that are components (items that build into other items), exclude items included in recipe
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
        // Get the costs of all items in the current recipe (including recipe cost)
        let componentCosts = [];
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe") {
                componentCosts.push(this.getItemData(recipe[i]).cost);
            }
        }
        let recipeCost = this.state.itemsToQuiz[this.state.current + 1].RecipeCost;
        if (recipeCost !== 0) {
            componentCosts.push(recipeCost);
        }

        // Get items only within +/-200 of any item in the recipe
        let costFiltered = filtered.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (item.cost <= (componentCosts[i] + 200) && item.cost >= (componentCosts[i] - 200)) {
                    return item;
                }
            }
        });

        // Populate randItems with items close in cost to recipe items
        let randItems = [];
        if (costFiltered.length <= (8 - recipe.length)) {
            // Okay to add repeats if not enough valid items
            randItems = costFiltered;
            for (let i = 0; i < 8 - recipe.length - randItems.length; i++) {
                let rand = Math.floor(Math.random() * costFiltered.length);
                randItems.push(costFiltered[rand]);
            }
        } else {
            // Try not to add repeats if enough valid items
            let alreadyPicked = []
            for (let i = 0; i < 8 - recipe.length; i++) {
                let rand;
                do {
                    rand = Math.floor(Math.random() * costFiltered.length);
                }  while (alreadyPicked.includes(rand));
                randItems.push(costFiltered[rand]);
                alreadyPicked.push(rand);
            }
        }
        
        return randItems;
        
    }

    // Generates all the item ID's for the current quiz (fake and real)
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

    // Generates the JSX for the quiz components
    createQuizComponents = () => {
        let quizItems = []
        for (let i = 0; i < this.state.currentQuiz.length; i++) {
                quizItems.push(<Item key={i} locked={this.state.frozen} id={this.state.currentQuiz[i].id} index={i}></Item>);
        }
        return quizItems;
    }

    // Generates the components for the row of mystery icon symbols that will update as items are selected
    createMysteryIcons = () => {
        let selected = [];
        let indicies = []
        for (let i = 0; i < this.props.selected.length - 1; i++) {
            if (this.props.selected[i] === 1) {
                selected.push(this.state.currentQuiz[i].id);
                indicies.push(i);
            }
        }
        if (this.props.selected[8] === 1) {
            selected.push("recipe");
        }
        let numIcons = this.state.itemsToQuiz[this.state.current].components.length;
        let icons = [];
        for (let i = 0; i < selected.length; i++) {
            icons.push(<MysteryIcon key={i} id={selected[i]} index={indicies[i]}></MysteryIcon>);
        }
        for (let i = 0; i < numIcons - selected.length; i++) {
            icons.push(<MysteryIcon key={i + selected.length} id={"unknown"} index={-1}></MysteryIcon>);
        }
        return icons;
    }

    // Loads the next item to quiz, or the win state if there is no more items
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
            // Check which items are selected
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

            // Only check for correctness if all slots are filled
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
                    let currentStreak = this.state.streak;
                    let currentScore = this.state.score;

                    currentScore += currentStreak * 30 + 200;
                    currentStreak += 1;

                    this.setState({
                        frozen : true, 
                        streak : currentStreak,
                        score : currentScore
                    });
                    setTimeout(() => {
                        wrapper.classList.remove('is-test-open');
                        console.log("Correct!");
                        this.props.dispatch(reset());
                        this.nextQuiz();
                        this.setState({frozen : false});
                    }, 1000)
                } else {
                    let currentTries = this.state.tries;
                    currentTries -= 1;
                    if (currentTries === 0) {
                        //TODO: Add proper game over state
                        console.log("Game Over");
                    }
                    this.setState({
                        frozen : true, 
                        streak : 0,
                        tries : currentTries
                    });
                    setTimeout(() => {
                        wrapper.classList.remove('is-test-open');
                        console.log("Incorrect!");
                        this.props.dispatch(reset());
                        this.setState({frozen : false});
                    }, 1000)
                }
                
            }
        }
    }

    // Gets the current streak text
    getStreak = () => {
        let text;
        let amount = this.state.streak * 30 + 200;
        if (this.state.streak < streakNames.length) {
            text = streakNames[this.state.streak];
        } else {
            text = streakNames[streakNames.length - 1];
        }
        return (
            <div>
                <div>
                    {text}
                </div>
                <div>
                    +{amount}
                </div>
            </div>
        );
    }

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
                    {this.getStreak()}
                </Wrapper>
                <div>
                    Guesses Left: {this.state.tries}
                </div>
                <div>
                    Score: {this.state.score}
                </div>
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