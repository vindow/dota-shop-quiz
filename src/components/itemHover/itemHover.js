import React from 'react';
// Eventually store the items data into redux, pass array index into items
import items from '../../data/items.json';
import './itemHover.css';

class ItemHover extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index : 134
        }
    }

    render() {
        console.log(items)
        let toggle = <div></div>;
        let active = <div></div>;
        let passive = [];
        let use = <div></div>;
        let attrib = []
        if ("toggle" in items[this.state.index]) {
            toggle = 
            <div className="itemAbility">
                <div className="itemAbilityHeader">
                    <span className="itemAbilityHeaderTitle">Toggle: {items[this.state.index].toggle[0].name}</span>
                    {items[this.state.index].cd !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                            {items[this.state.index].cd}
                        </span>
                    }
                    {items[this.state.index].mc !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                            {items[this.state.index].mc}
                        </span>
                    }
                </div>
                <div className="itemAbilityText">{items[this.state.index].toggle[0].desc}</div>
            </div>
        }
        if ("active" in items[this.state.index]) {
            active = 
            <div className="itemAbility">
                <div className="itemAbilityHeader">
                    <span className="itemAbilityHeaderTitle">Active: {items[this.state.index].active[0].name}</span>
                    {items[this.state.index].cd !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                            {items[this.state.index].cd}
                        </span>
                    }
                    {items[this.state.index].mc !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                            {items[this.state.index].mc}
                        </span>
                    }
                </div>
                <div className="itemAbilityText">{items[this.state.index].active[0].desc}</div>
            </div>
        }
        if ("passive" in items[this.state.index]) {
            for (let i = 0; i < items[this.state.index].passive.length; i++) {
                passive.push(
                    <div className="itemAbility">
                        <div className="itemAbilityHeader">
                            <span className="itemAbilityHeaderTitle">Passive: {items[this.state.index].passive[i].name}</span>
                        </div>
                        <div className="itemAbilityText">{items[this.state.index].passive[i].desc}</div>
                    </div>
                );
            }
        }
        if ("use" in items[this.state.index]) {
            use = 
            <div className="itemAbility">
                <div className="itemAbilityHeader">
                    <span className="itemAbilityHeaderTitle">Use: {items[this.state.index].use[0].name}</span>
                    {items[this.state.index].cd !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                            {items[this.state.index].cd}
                        </span>
                    }
                    {items[this.state.index].mc !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                            {items[this.state.index].mc}
                        </span>
                    }
                </div>
                <div className="itemAbilityText">{items[this.state.index].use[0].desc}</div>
            </div>
        }
        for (let i = 0; i < items[this.state.index].attrib.length; i++) {
            attrib.push(
                <span className="itemAttribText">
                    {items[this.state.index].attrib[i].header}
                    <span className="itemAttribNum">
                        {items[this.state.index].attrib[i].value + " "}
                    </span>
                    {items[this.state.index].attrib[i].footer}
                </span>
            )
        }
        return (
            <div className="item">
                <div className="itemHeader">
                    <img className="itemImage" src={"http://cdn.dota2.com/apps/dota2/images/items/" + items[this.state.index].id + "_lg.png"} />
                    <div className="itemHeaderText">
                        <span className="itemName">{items[this.state.index].dname}</span>
                        <span className="itemPrice">
                            <img className="itemSymbol" src={"http://cdn.dota2.com/apps/dota2/images/tooltips/gold.png"} />
                            {items[this.state.index].cost}
                        </span>
                    </div>
                </div>
                <div className="itemAttrib">
                    {attrib}
                </div>
                {toggle}
                {active}
                {passive}
                {use}
                <div className="itemLore">
                    {items[this.state.index].lore}
                </div>
            </div>
        );
    }
}

export default ItemHover;