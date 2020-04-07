import React from 'react';
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
        this.state = {
            itemsToQuiz: itemsWithRecipe,
            current: 1
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

    createQuizItems = () => {
        let components = [];
        let recipe = this.state.itemsToQuiz[this.state.current].components;
        for (let i = 0; i < recipe.length; i++) {
            if (recipe[i] !== "recipe"){
                let component = this.getItemData(recipe[i]);
                if (component === null) {
                    console.log("null item! id: " + recipe[i]);
                }
                components.push(component);
            }
        }
        let possibleComponents = components.concat(this.generateRandomItems(recipe));
        console.log(possibleComponents);
        let quizItems = []
        for (let i = 0; i < possibleComponents.length; i++) {
            quizItems.push(<Item key={i} id={possibleComponents[i].id}></Item>);
        }
        return quizItems;
    }

    render() {
        return(
            <div>
                <Item id={this.state.itemsToQuiz[this.state.current].id}></Item>
                <div>
                    {this.createQuizItems()}
                </div>
            </div>
        );
    }
}

export default Game;