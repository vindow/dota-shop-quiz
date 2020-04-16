import React from 'react';
import { connect } from 'react-redux';
import { reset } from '../../actions.js';
import Item from '../item/item';
import items from '../../data/items.json';

class Game extends React.Component {

    constructor(props) {
        super(props);
        console.log(items);
        
        let itemsWithRecipe = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].components !== null) {
                itemsWithRecipe.push(items[i]);
            }
        }
        console.log(itemsWithRecipe);
        let recipe = itemsWithRecipe[0].components;
        let components = this.getQuizComponents(recipe);

        this.state = {
            itemsToQuiz: itemsWithRecipe,
            current: 0,
            currentRecipe : recipe,
            currentQuiz : components
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
        let components = recipe.filter((item) => {
            return item !== "recipe"
        });
        let filtered = items.filter((item) => {
            for (let i = 0; i < components.length; i++) {
                if (components[i] === item.id) {
                    return;
                }
            }
            return item;
        });
        let randItems = [];
        for (let i = 0; i < 8 - components.length; i++) {
            let rand = Math.floor(Math.random() * filtered.length);
            randItems.push(filtered[rand]);
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
            quizItems.push(<Item key={i} id={this.state.currentQuiz[i].id} index={i}></Item>);
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
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.selected);
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
            if (correct) {
                console.log("Correct!");
                this.props.dispatch(reset());
                this.nextQuiz();
            } else {
                console.log("Incorrect!");
                this.props.dispatch(reset());
            }
        }
    }

    render() {
        return(
            <div>
                <Item id={this.state.itemsToQuiz[this.state.current].id}></Item>
                <div>
                    {this.createMysteryIcons()}
                </div>
                <div>
                    {this.createQuizComponents()}
                    <Item id="recipe" index={8}></Item>
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