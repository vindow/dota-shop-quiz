import React from 'react';
import { connect } from 'react-redux';
import { reset } from '../../actions.js';
import Item from '../item/item';
import MysteryIcon from '../mysteryIcon/mysteryIcon';
import Settings from '../settings/settings.js';
import ProgressBar from '../progressBar/progressBar.js';
import Dialog from '../dialog/dialog.js';
import items from '../../data/items.json';
import styled, { keyframes } from 'styled-components';
import breakpoint from 'styled-components-breakpoint';

const Page = styled.div`
    text-align: center;
`;

const GameMain = styled.div`
    ${ breakpoint('xs') `width: 100%;`}
    ${ breakpoint('md') `width: 90%;`}
    ${ breakpoint('lg') `width: 85%;`}
    ${ breakpoint('xl') `width: 70%;`}
    position: relative;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    border: 2px rgb(49, 49, 49) solid;
    padding: 1em 0em 1em 0em;
`;

const QuizItem = styled.div`
    display: flex;
    justify-content: center;
`;

const Row = styled.div`
    display: flex;
    justify-content: center;
`;

const PopUpTextKeyFrames = keyframes`
    0% {
        opacity: 1;
        top: -5em;
        z-index: 1;
    }
    100% {
        opacity 0;
        top: -7em;
        z-index: 1;
    }
`;
const PopUpText = styled.div`
    ${ breakpoint('xs') `font-size: 1.5em;`}
    ${ breakpoint('md') `font-size: 3em;`}
    opacity: 0;
    position: relative;
    color : #CC1400;
    font-weight: bold;
    margin : auto;
    top: -2.5em;
    text-align: center;
    z-index: -1;
    &.play-animation {
        animation: ${PopUpTextKeyFrames} 1s ease-in-out 0s 1;
    }
`;

const StatText = styled.div`
    ${ breakpoint('xs') `font-size: 1em;`}
    ${ breakpoint('md') `font-size: 1.5em;`}
`;

const OptionButton = styled.button.attrs(props => ({
    url : props.url
}))`
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: inherit;
    border: none;
    text-align: center;
    width: 30px;
    height: 30px;
    color: #aaaaaa;
    font-size: 1em;
    background-image: url(${props => props.url});
    background-size: 30px 30px;
    padding: 0;
`;

const initialTimeEasy = 10000;
const initialTimeHard = 6500;

const streakNames = ["Wrong Answer", "Correct!", "Double Answer!", "Answering Spree!", "Dominating!", "Mega Answer!", "Unstoppable!", "Wicked Sick!", "Monster Answer!", "Godlike!", "Beyond Godlike!"];
const timeSlow = ["Close Call!", "Close One!", "Barely!"];
const timeNormal = ["Nice!", "Correct!", "Well Done!", "Great!"];
const timeFast = ["Speedy!", "With Alacrity!", "So Fast!", "Swift!"];
class Game extends React.Component {

    constructor(props) {
        super(props);

        this.popupRef = React.createRef();
        
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
        let time = initialTimeHard;
        if (this.props.easy) {
            time = initialTimeEasy
        }
        this.state = {
            itemsToQuiz: itemsWithRecipe,
            current: 0,
            materials: materialIDs,
            frozen: false,
            streak : 0,
            score : 0,
            tries : 3,
            timeLeft: time,
            win : false,
            settings: false,
            timer: null
        }
    }

    componentDidMount() {
        this.nextQuiz();
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
        let curr = this.state.current;
        // Get only items that are components (items that build into other items), exclude items included in recipe
        let filtered = items.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (recipe[i] === item.id || this.state.itemsToQuiz[curr].id === item.id) {
                    return false;
                }
            }
            if (this.state.materials.includes(item.id)) {
                return true;
            }
            return false;
        });

        // Add exception for power treads (remove band of elvenskin and robe of magi)
        if (this.state.itemsToQuiz[curr].id === "power_treads") {
            for (let i = 0; i < filtered.length; i++) {
                if (filtered[i].id === "robe" || filtered[i].id === "boots_of_elves") {
                    filtered.splice(i, 1);
                    i--;
                }
            }
        }

        // Add a special clause for broadswords and claymores (because everyone gets them confused!)
        let isBroadsword;
        let isClaymore;
        // Get the costs of all items in the current recipe (including recipe cost)
        let componentCosts = [];
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe") {
                let itemdata = this.getItemData(recipe[i])
                componentCosts.push(itemdata.cost);
                if (itemdata.id === "broadsword") {
                    isBroadsword = true;
                }
                if (itemdata.id === "claymore") {
                    isClaymore = true;
                }
            }
        }
        let recipeCost = this.state.itemsToQuiz[curr].RecipeCost;
        if (recipeCost !== 0) {
            componentCosts.push(recipeCost);
        }

        // Get items only within +/-200 of any item in the recipe
        let costFiltered = filtered.filter((item) => {
            for (let i = 0; i < recipe.length; i++) {
                if (item.cost <= (componentCosts[i] + 200) && item.cost >= (componentCosts[i] - 200)) {
                    return true;
                }
            }
            return false;
        });

        // Populate randItems with items close in cost to recipe items
        let randItems = [];
        let numRand = 8;
        if (recipe.includes("recipe")) {
            numRand -= recipe.length - 1;
        } else {
            numRand -= recipe.length;
        }
        //Add exception to battlefury because it contains broadsword and claymore
        if (isBroadsword && this.state.itemsToQuiz[curr].id !== "bfury") {
            numRand -= 1;
            randItems.push(this.getItemData("claymore"));
        }
        if (isClaymore && this.state.itemsToQuiz[curr].id !== "bfury") {
            numRand -= 1;
            randItems.push(this.getItemData("broadsword"));
        }
        
        if (costFiltered.length <= numRand) {
            // Okay to add repeats if not enough valid items
            randItems = randItems.concat(costFiltered);
            for (let i = 0; i < numRand - randItems.length; i++) {
                let rand = Math.floor(Math.random() * costFiltered.length);
                randItems.push(costFiltered[rand]);
            }
        } else {
            // Try not to add repeats if enough valid items
            let alreadyPicked = [];
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

    // Loads the next item to quiz, or the win state if there is no more items
    nextQuiz = () => {
        if (this.state.current < this.state.itemsToQuiz.length) {
            let recipe = this.state.itemsToQuiz[this.state.current].components;
            let components = this.getQuizComponents(recipe);
            // Shuffle the components
            for (let i = components.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let tmp = components[i];
                components[i] = components[j];
                components[j] = tmp;
            }
            this.setState({
                currentRecipe : recipe,
                currentQuiz : components
            });
            if (!this.props.classic) {
                this.startTimer();
            }
        } else {
            this.setState({win : true});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.classic !== this.props.classic || prevProps.easy !== this.props.easy) {
            this.reset();
        } else if (!this.state.frozen) {
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
                // Check for correctness
                recipe.sort();
                selected.sort();
                let correct = true;
                for (let i = 0; i < recipe.length; i++) {
                    if(recipe[i] !== selected[i]) {
                        correct = false;
                        break;
                    }
                }

                // Play the popup animation
                const popup = this.popupRef.current;
                popup.classList.add('play-animation');

                if (correct) {
                    let currentStreak = this.state.streak;
                    let currentScore = this.state.score;
                    if (!this.props.classic) {
                        clearInterval(this.state.timer);
                        currentScore += Math.max(this.state.timeLeft / 20);
                    } else {
                        currentScore += currentStreak * 30 + 200;
                    }
                    currentStreak += 1;
                    this.setState({
                        frozen : true, 
                        streak : currentStreak,
                        score : currentScore
                    });
                    // Wait for pop up text animation to end before loading next quiz
                    setTimeout(() => {
                        popup.classList.remove('play-animation');
                        this.props.dispatch(reset());
                        if (this.state.current + 1 < this.state.itemsToQuiz.length) {
                            this.setState({
                                frozen : false,
                                current : this.state.current + 1
                            });
                            this.nextQuiz();
                        } else {
                            this.setState({
                                frozen: false,
                                win: true
                            });
                        }
                    }, 1000);
                } else {
                    let currentTries = this.state.tries;
                    if (this.props.classic) {
                        currentTries -= 1;
                        if (currentTries === 0) {
                            this.setState({
                                streak : 0,
                                frozen : true
                            });
    
                            // Wait for pop up text animation to end before loading game over screen
                            setTimeout(() => {
                                popup.classList.remove('play-animation');
                                this.setState({
                                    tries : currentTries
                                });
                            }, 1000);
                        } else {
                            this.setState({
                                frozen : true, 
                                streak : 0,
                                tries : currentTries
                            });
    
                            // Wait for pop up text animation to end before loading next quiz
                            setTimeout(() => {
                                popup.classList.remove('play-animation');
                                this.props.dispatch(reset());
                                this.setState({frozen : false});
                            }, 1000)
                        }
                    } else {
                        this.setState({
                            frozen : true, 
                            streak : 0,
                            tries : currentTries
                        });

                        // Wait for pop up text animation to end before loading next quiz
                        setTimeout(() => {
                            if (this.state.timeLeft > 0) {
                                popup.classList.remove('play-animation');
                                this.props.dispatch(reset());
                                this.setState({frozen : false});
                            } else {
                                popup.classList.remove('play-animation');
                            }
                        }, 1000)
                    }
                }
            }
        } else {

        }
    }

    // Gets the current streak text
    getScorePopup = () => {
        let text;
        let amount;
        if (this.props.classic) {
            amount = (this.state.streak > 0) ? this.state.streak * 30 + 170 : 0;
            // Just play the very last streak name for any streaks higher than it
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
        } else {
            amount = Math.max(this.state.timeLeft / 20);
            if (this.state.streak === 0) {
                text = "Wrong Answer!";
            } else {
                let maxTime = initialTimeHard;
                if (this.props.easy) {
                    maxTime = initialTimeEasy;
                }
                if (this.state.timeLeft / maxTime <= 0.3) {
                    text = timeSlow[Math.floor(Math.random() * timeSlow.length)];
                } else if (this.state.timeLeft / maxTime > 0.3 && this.state.timeLeft / maxTime < 0.8) {
                    text = timeNormal[Math.floor(Math.random() * timeNormal.length)];
                } else {
                    text = timeFast[Math.floor(Math.random() * timeFast.length)];
                }
            }
            return (
                <div>
                    <div>
                        {text}
                    </div>
                    <div>
                        {this.state.streak !== 0 ? "+" + amount : " "}
                    </div>
                </div>
            );
        }
        
    }

    // Resets the game stat back to the start and also reshuffles the item quiz order
    reset = () => {
        let quiz = this.state.itemsToQuiz.slice();
        // Reshuffling the quiz order
        for (let i = quiz.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = quiz[i];
            quiz[i] = quiz[j];
            quiz[j] = tmp;
        }

        let recipe = quiz[0].components;
        this.setState({current : 0});
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
            currentRecipe : recipe,
            currentQuiz : components,
            streak : 0,
            score : 0,
            tries : 3,
            win : false,
            frozen: false
        });
        if (!this.props.classic) {
            this.startTimer();
        }
    }

    openSettings = () => {
        this.setState({settings : true});
        if (!this.props.classic) {
            clearInterval(this.state.timer);
        }
    }

    handleSettings = (apply) => {
        this.setState({settings : false});
        if (!apply && !this.props.classic) {
            let time = setInterval(() => {
                let newTime = this.state.timeLeft - 100;
                if (newTime <= 0) {
                    clearInterval(this.state.timer);
                    this.setState({frozen : true});
                }
                this.setState({timeLeft : newTime});
            }, 100);
            this.setState({timer : time});
        }
    }

    startTimer = () => {
        if (this.props.easy) {
            this.setState({timeLeft : initialTimeEasy});
        } else {
            this.setState({timeLeft : initialTimeHard});
        }
        let time = setInterval(() => {
            let newTime = this.state.timeLeft - 100;
            if (newTime <= 0) {
                clearInterval(this.state.timer);
                this.setState({frozen : true});
            }
            this.setState({timeLeft : newTime});
        }, 100);
        this.setState({timer: time});
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
            icons.push(<MysteryIcon key={i} id={selected[i]} index={indicies[i]}></MysteryIcon>);
        }
        for (let i = 0; i < numIcons - selected.length; i++) {
            icons.push(<MysteryIcon key={i + selected.length} id={"unknown"} index={-1}></MysteryIcon>);
        }
        return icons;
    }

    // Generates the JSX for the quiz components
    createQuizComponents = () => {
        let quizItems = []
        for (let i = 0; i < this.state.currentQuiz.length; i++) {
            quizItems.push(<Item key={i} locked={this.state.frozen} id={this.state.currentQuiz[i].id} index={i} clickable={true}></Item>);
        }
        return quizItems;
    }

    getAnswer = () => {
        let components = [];
        let recipe = this.state.itemsToQuiz[this.state.current].components;
        console.log(recipe);
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe"){
                components.push(<Item key={i} locked={true} clickable={false} id={recipe[i]}></Item>);
            } else {
                components.push(<Item id="recipe" locked={true} clickable={false}></Item>);
            }
        }
        return components;
    }

    render() {
        let game = <div></div>
        let footer = <div></div>
        let maxTime = initialTimeHard;
        if (this.props.easy) {
            maxTime = initialTimeEasy;
        }
        
        if (this.props.classic) {
            footer = <div>
                <StatText>
                    Guesses Left: {this.state.tries}
                </StatText>
                <StatText>
                    Score: {this.state.score}
                </StatText>
            </div>
            
        } else {
            footer = <div>
                <StatText>
                    Score: {this.state.score}
                </StatText>
            </div>
        }
        if (this.state.settings) {
            game = 
            <GameMain>
                <Settings onClose={this.handleSettings}></Settings>
            </GameMain>
        } else if ((this.state.tries <= 0 && this.props.classic) || (this.state.timeLeft <= 0 && !this.props.classic)) {
            game = 
            <GameMain>
                <Dialog 
                    onClose={this.reset}
                    item={this.state.itemsToQuiz[this.state.current]} 
                    streak={this.state.current} 
                    score={this.state.score}
                    win={false}>
                </Dialog>
            </GameMain>
        } else if (this.state.win) {
            game = 
            <GameMain>
                <Dialog onClose={this.reset} score={this.state.score} win={true} />
            </GameMain>
        } else {
            game = 
            <GameMain>
                <ProgressBar percentage={100 * this.state.timeLeft / maxTime}></ProgressBar>
                <QuizItem>
                    <Item id={this.state.itemsToQuiz[this.state.current].id} locked={this.state.frozen} clickable={false}></Item>
                </QuizItem>
                <Row>
                    {this.createMysteryIcons()}
                </Row>
                <Row>
                    {(this.state.currentQuiz) ? this.createQuizComponents() : ""}
                    <Item id="recipe" locked={this.state.frozen} index={8} clickable={true}></Item>
                </Row>
                {footer}
                <OptionButton url={process.env.PUBLIC_URL + '/images/settings.png'} onClick={this.openSettings} disabled={this.state.options}></OptionButton>
            </GameMain>
        }
        return(
            <Page>
                <h1>Shopkeeper's Quiz</h1>
                {game}
                <h4>Current Dota 2 Version: 7.29c</h4>
                <PopUpText ref={this.popupRef}>
                    {this.getScorePopup()}
                </PopUpText>
            </Page>
        );
    }
}

function mapStateToProps(state) {
    return {
        selected : state.selected,
        easy : state.easy,
        classic : state.classic
    };
}

export default connect(mapStateToProps)(Game);