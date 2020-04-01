import React from 'react';
// Eventually store the items data into redux, pass array index into items
import items from '../../data/items.json';
import './itemHover.css';

class ItemHover extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let upgrade = <div></div>;
        let toggle = <div></div>;
        let active = <div></div>;
        let passive = [];
        let use = <div></div>;
        let attrib = []
        if ("upgrade" in items[this.props.index]) {
            upgrade = 
            <div className="itemAbility">
                <div className="itemAbilityHeader">
                    <span className="itemAbilityHeaderTitle">Upgrade: {items[this.props.index].upgrade[0].name}</span>
                    {items[this.props.index].cd !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                            {items[this.props.index].cd}
                        </span>
                    }
                    {items[this.props.index].mc !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                            {items[this.props.index].mc}
                        </span>
                    }
                </div>
                <div className="itemAbilityText">{items[this.props.index].upgrade[0].desc}</div>
            </div>
        }
        if ("toggle" in items[this.props.index]) {
            toggle = 
            <div className="itemAbility">
                <div className="itemAbilityHeader">
                    <span className="itemAbilityHeaderTitle">Toggle: {items[this.props.index].toggle[0].name}</span>
                    {items[this.props.index].cd !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                            {items[this.props.index].cd}
                        </span>
                    }
                    {items[this.props.index].mc !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                            {items[this.props.index].mc}
                        </span>
                    }
                </div>
                <div className="itemAbilityText">{items[this.props.index].toggle[0].desc}</div>
            </div>
        }
        if ("active" in items[this.props.index]) {
            active = 
            <div className="itemAbility">
                <div className="itemAbilityHeader">
                    <span className="itemAbilityHeaderTitle">Active: {items[this.props.index].active[0].name}</span>
                    {items[this.props.index].cd !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                            {items[this.props.index].cd}
                        </span>
                    }
                    {items[this.props.index].mc !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                            {items[this.props.index].mc}
                        </span>
                    }
                </div>
                <div className="itemAbilityText">{items[this.props.index].active[0].desc}</div>
            </div>
        }
        if ("passive" in items[this.props.index]) {
            for (let i = 0; i < items[this.props.index].passive.length; i++) {
                passive.push(
                    <div className="itemAbility">
                        <div className="itemAbilityHeader">
                            <span className="itemAbilityHeaderTitle">Passive: {items[this.props.index].passive[i].name}</span>
                        </div>
                        <div className="itemAbilityText">{items[this.props.index].passive[i].desc}</div>
                    </div>
                );
            }
        }
        if ("use" in items[this.props.index]) {
            use = 
            <div className="itemAbility">
                <div className="itemAbilityHeader">
                    <span className="itemAbilityHeaderTitle">Use: {items[this.props.index].use[0].name}</span>
                    {items[this.props.index].cd !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                            {items[this.props.index].cd}
                        </span>
                    }
                    {items[this.props.index].mc !== false && 
                        <span className="itemAbilityHeaderStat">
                            <img className="itemSymbol" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                            {items[this.props.index].mc}
                        </span>
                    }
                </div>
                <div className="itemAbilityText">{items[this.props.index].use[0].desc}</div>
            </div>
        }
        for (let i = 0; i < items[this.props.index].attrib.length; i++) {
            attrib.push(
                <span className="itemAttribText">
                    {items[this.props.index].attrib[i].header}
                    <span className="itemAttribNum">
                        {items[this.props.index].attrib[i].value + " "}
                    </span>
                    {items[this.props.index].attrib[i].footer}
                </span>
            )
        }
        return (
            <div className="item">
                <div className="itemHeader">
                    <div>
                        <img src={"http://cdn.dota2.com/apps/dota2/images/items/" + items[this.props.index].id + "_lg.png"} />
                    </div>
                    <div className="itemHeaderText">
                        <span className="itemName">{items[this.props.index].dname}</span>
                        <span className="itemPrice">
                            <img className="itemSymbol" src={"http://cdn.dota2.com/apps/dota2/images/tooltips/gold.png"} />
                            {items[this.props.index].cost}
                        </span>
                    </div>
                </div>
                <div className="itemAttrib">
                    {attrib}
                </div>
                {upgrade}
                {toggle}
                {active}
                {passive}
                {use}
                <div className="itemLore">
                    {items[this.props.index].lore}
                </div>
            </div>
        );
    }
}

export default ItemHover;