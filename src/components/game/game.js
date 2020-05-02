import React from 'react';
import { connect } from 'react-redux';
import { reset, setDifficulty } from '../../actions.js';
import Item from '../item/item';
import MysteryIcon from '../mysteryIcon/mysteryIcon';
import items from '../../data/items.json';
import styled, { keyframes } from 'styled-components';
import './game.css';

const Page = styled.div`
    text-align: center;
`;

const wrapperKeyFrame = keyframes`
    0% {
        opacity: 1;
        top: -200px
    }
    100% {
        opacity 0;
        top: -300px;
    }
`;
const Wrapper = styled.div`
    opacity: 0;
    position: relative;
    color : #CC1400;
    font-size : 3em;
    font-weight: bold;
    margin : auto;
    top: 0px;
    text-align: center;
    &.is-test-open {
        animation: ${wrapperKeyFrame} 1s ease-in-out 0s 1;
    }
    
`;

const StatText = styled.div`
    font-size: 1.5em;
`;

const endDialogKeyFrame = keyframes`
    0% {
        opacity: 0;
        top: 100px;
    }
    100% {
        opacity: 1;
        top: 200px;
    }
`;

const EndDialog = styled.div`
    width: 30%;
    position: absolute;
    display: block;
    text-align: center;
    margin: 0 auto;
    top: 200px;
    left: 0;
    right: 0;
    padding: 2em;
    background-color: #222222;
    border: 2px rgb(49, 49, 49) groove;
    animation: ${endDialogKeyFrame} 0.5s ease-in-out 0s 1;
`;

const LargeText = styled.div`
    font-size: 2em;
    margin-bottom: 0.75em;
`;

const RestartButton = styled.button`
    background-color: #333333;
    border: 1px solid #444444;
    text-align: center;
    padding: 6px 22px;
    color: #dddddd;
    font-size: 1.5em;
    margin-bottom: 0.25em;
`;

const DifficultyButton = styled.button`
    background-color: #333333;
    border: 1px solid #444444;
    text-align: center;
    padding: 6px 22px;
    color: #dddddd;
    font-size: 1.5em;
    margin: 0em 1em 1em 1em;
    &:disabled {
        background-color: #222222;
        color: #aaaaaa;
        border: 1px solid #1a1a1a;
    }
`;

const streakNames = ["Wrong Answer", "Correct!", "Double Answer!", "Answering Spree!", "Dominating!", "Mega Answer!", "Unstoppable!", "Wicked Sick!", "Monster Answer!", "Godlike!", "Beyond Godlike!"]
class Game extends React.Component {

    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();
        
        // First time initialization
        //Get list of items to quiz
        let itemsWithRecipe = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].components !== null) {
                itemsWithRecipe.push(items[i]);
            }
        }
        // Shuffle items
        for (let i = itemsWithRecipe.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = itemsWithRecipe[i];
            itemsWithRecipe[i] = itemsWithRecipe[j];
            itemsWithRecipe[j] = tmp;
        }

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

        //Add exception for Power Treads
        if (itemsWithRecipe[0].id === "power_treads") {
            for (let i = 0; i < filtered.length; i++) {
                if (filtered[i].id === "robe" || filtered[i].id === "boots_of_elves") {
                    filtered.splice(i, 1);
                    i--;
                }
            }
        }

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
        let numRand = 8;
        if (recipe.includes("recipe")) {
            numRand -= recipe.length - 1;
        } else {
            numRand -= recipe.length;
        }
        if (costFiltered.length <= numRand) {
            // Okay to add repeats if not enough valid items
            randItems = costFiltered;
            for (let i = 0; i < numRand - randItems.length; i++) {
                let rand = Math.floor(Math.random() * costFiltered.length);
                randItems.push(costFiltered[rand]);
            }
        } else {
            let alreadyPicked = []
            for (let i = 0; i < numRand; i++) {
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
        // Shuffle the components
        for (let i = components.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = components[i];
            components[i] = components[j];
            components[j] = tmp;
        }
        this.state = {
            itemsToQuiz: itemsWithRecipe,
            current: 0,
            currentRecipe : recipe,
            currentQuiz : components,
            materials: materialIDs,
            frozen: false,
            streak : 0,
            score : 0,
            tries : 3,
            win : false
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
        // Get only items that are components (items that build into other items), exclude items included in recipe
        let filtered = items.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (recipe[i] === item.id || this.state.itemsToQuiz[this.state.current + 1].id === item.id) {
                    return;
                }
            }
            if (this.state.materials.includes(item.id)) {
                return item;
            }
        });

        // Add exception for power treads (remove band of elvenskin and robe of magi)
        if (this.state.itemsToQuiz[this.state.current + 1].id === "power_treads") {
            for (let i = 0; i < filtered.length; i++) {
                if (filtered[i].id === "robe" || filtered[i].id === "boots_of_elves") {
                    filtered.splice(i, 1);
                    i--;
                }
            }
        }

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
        let numRand = 8;
        if (recipe.includes("recipe")) {
            numRand -= recipe.length - 1;
        } else {
            numRand -= recipe.length;
        }
        if (costFiltered.length <= numRand) {
            // Okay to add repeats if not enough valid items
            randItems = costFiltered;
            for (let i = 0; i < numRand - randItems.length; i++) {
                let rand = Math.floor(Math.random() * costFiltered.length);
                randItems.push(costFiltered[rand]);
            }
        } else {
            // Try not to add repeats if enough valid items
            let alreadyPicked = []
            for (let i = 0; i < numRand; i++) {
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
            quizItems.push(<Item key={i} locked={this.state.frozen} id={this.state.currentQuiz[i].id} index={i} clickable={true} easy={this.state.easy}></Item>);
        }
        return quizItems;
    }

    // Generates the components for the row of mystery icon symbols that will update as items are selected
    createMysteryIcons = () => {
        let selected = [];
        let indicies = [];
        for (let i = 0; i < this.props.selected.length; i++) {
            if (this.props.selected[i] === 8) {
                selected.push("recipe");
            } else {
                selected.push(this.state.currentQuiz[this.props.selected[i]].id);
                indicies.push(this.props.selected[i]);
            }
        }
        let numIcons = this.state.itemsToQuiz[this.state.current].components.length;
        let icons = [];
        for (let i = 0; i < selected.length; i++) {
            icons.push(<MysteryIcon key={i} id={selected[i]} index={indicies[i]} easy={this.state.easy}></MysteryIcon>);
        }
        for (let i = 0; i < numIcons - selected.length; i++) {
            icons.push(<MysteryIcon key={i + selected.length} id={"unknown"} index={-1} easy={this.state.easy}></MysteryIcon>);
        }
        return icons;
    }

    // Loads the next item to quiz, or the win state if there is no more items
    nextQuiz = () => {
        let i = this.state.current + 1;
        if (i < this.state.itemsToQuiz.length) {
            let recipe = this.state.itemsToQuiz[i].components;
            let components = this.getQuizComponents(recipe);
            // Shuffle the components
            for (let j = components.length - 1; j > 0; j--) {
                let k = Math.floor(Math.random() * (j + 1));
                let tmp = components[j];
                components[j] = components[k];
                components[k] = tmp;
            }
            this.setState({
                current: i,
                currentRecipe : recipe,
                currentQuiz : components
            })
        } else {
            this.setState({win : true});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.state.frozen) {
            // Check which items are selected
            let recipe = this.state.currentRecipe.slice();
            let selected = [];
            for (let i = 0; i < this.props.selected.length; i++) {
                if (this.props.selected[i] === 8) {
                    selected.push("recipe");
                } else {
                    selected.push(this.state.currentQuiz[this.props.selected[i]].id);
                }
                
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
                        this.props.dispatch(reset());
                        this.nextQuiz();
                        this.setState({frozen : false});
                    }, 1000)
                } else {
                    let currentTries = this.state.tries;
                    currentTries -= 1;
                    if (currentTries === 0) {
                        this.setState({
                            streak : 0,
                            frozen : true
                        });
                        setTimeout(() => {
                            wrapper.classList.remove('is-test-open');
                            this.setState({
                                tries : currentTries
                            });
                        }, 1000)
                    } else {
                        this.setState({
                            frozen : true, 
                            streak : 0,
                            tries : currentTries
                        });
                        setTimeout(() => {
                            wrapper.classList.remove('is-test-open');
                            this.props.dispatch(reset());
                            this.setState({frozen : false});
                        }, 1000)
                    }
                }
            }
        }
    }

    // Gets the current streak text
    getStreak = () => {
        let text;
        let amount = (this.state.streak > 0) ? this.state.streak * 30 + 170 : 0;
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
                    {this.state.streak > 0 ? "+" + amount : " "}
                </div>
            </div>
        );
    }

    reset = () => {
        let quiz = this.state.itemsToQuiz.slice();
        for (let i = quiz.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = quiz[i];
            quiz[i] = quiz[j];
            quiz[j] = tmp;
        }
        let recipe = quiz[0].components;
        let components = this.getQuizComponents(recipe);
        // Shuffle the components
        for (let i = components.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = components[i];
            components[i] = components[j];
            components[j] = tmp;
        }
        this.props.dispatch(reset());
        this.setState({
            itemsToQuiz: quiz,
            current: 0,
            currentRecipe : recipe,
            currentQuiz : components,
            streak : 0,
            score : 0,
            tries : 3,
            win : false,
            frozen: false
        });
    }

    setEasy = () => {
        this.props.dispatch(setDifficulty(true));
        this.reset();
    }

    setHard = () => {
        this.props.dispatch(setDifficulty(false));
        this.reset();
    }

    // For testing
    /*incQuiz = () => {
        this.props.dispatch(reset());
        this.nextQuiz();
    }*/

    render() {
        let gg = <div></div>
        if (this.state.tries <= 0) {
            gg = <EndDialog>
                <LargeText>Game Over</LargeText>
                <LargeText>Final Score: {this.state.score}</LargeText>
                <RestartButton onClick={this.reset}>Restart</RestartButton>
            </EndDialog>
        }
        if (this.state.win) {
            gg = <EndDialog>
                <LargeText>Game Complete!</LargeText>
                <LargeText>Final Score: {this.state.score}</LargeText>
                <RestartButton onClick={this.reset}>Replay?</RestartButton>
            </EndDialog>
        }
        return(
            <Page>
                <h1>Shopkeeper's Quiz</h1>
                <div>
                    <DifficultyButton onClick={this.setEasy} disabled={this.props.easy}>Easy</DifficultyButton>
                    <DifficultyButton onClick={this.setHard} disabled={!this.props.easy}>Hard</DifficultyButton>
                </div>
                <div className="game">
                    <div className="gameQuizItem">
                        <Item id={this.state.itemsToQuiz[this.state.current].id} locked={this.state.frozen} clickable={false} easy={this.state.easy}></Item>
                    </div>
                    <div className="gameMysteryRow">
                        {this.createMysteryIcons()}
                    </div>
                    <div className="gameMysteryRow">
                        <div className="gameComponentRow">
                            {this.createQuizComponents()}
                        </div>
                        <Item id="recipe" locked={this.state.frozen} index={8} clickable={true} easy={this.state.easy}></Item>
                    </div>
                    <StatText>
                        Guesses Left: {this.state.tries}
                    </StatText>
                    <StatText>
                        Score: {this.state.score}
                    </StatText>
                </div>
                <Wrapper ref={this.wrapperRef}>
                    {this.getStreak()}
                </Wrapper>
                {gg}
            </Page>
            
        );
    }
}

function mapStateToProps(state) {
    return {
        selected : state.selected,
        easy : state.easy
    };
}

export default connect(mapStateToProps)(Game);