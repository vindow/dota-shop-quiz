import React from 'react';
import { connect } from 'react-redux';
import items from '../../data/items.json';
import './itemHover.css';

class ItemHover extends React.Component {

    /*constructor(props) {
        super(props);
    }*/
    renderUpgrade = () => {
        if ("upgrade" in items[this.props.index]) {
            return ( 
                <div className="itemAbility">
                    <div className="itemAbilityHeader">
                        <span className="itemAbilityHeaderTitle">Upgrade: {items[this.props.index].upgrade[0].name}</span>
                        {items[this.props.index].cd !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                                {items[this.props.index].cd}
                            </span>
                        }
                        {items[this.props.index].mc !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                                {items[this.props.index].mc}
                            </span>
                        }
                    </div>
                    <div className="itemAbilityText">{items[this.props.index].upgrade[0].desc}</div>
                </div>
            );
        }
        return;
    }

    renderToggle = () => {
        if ("toggle" in items[this.props.index]) {
            return (
                <div className="itemAbility">
                    <div className="itemAbilityHeader">
                        <span className="itemAbilityHeaderTitle">Toggle: {items[this.props.index].toggle[0].name}</span>
                        {items[this.props.index].cd !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                                {items[this.props.index].cd}
                            </span>
                        }
                        {items[this.props.index].mc !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                                {items[this.props.index].mc}
                            </span>
                        }
                    </div>
                    <div className="itemAbilityText">{items[this.props.index].toggle[0].desc}</div>
                </div>
            );
        }
        return;
    }

    renderActive = () => {
        if ("active" in items[this.props.index]) {
            return (
                <div className="itemAbility">
                    <div className="itemAbilityHeader">
                        <span className="itemAbilityHeaderTitle">Active: {items[this.props.index].active[0].name}</span>
                        {items[this.props.index].cd !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                                {items[this.props.index].cd}
                            </span>
                        }
                        {items[this.props.index].mc !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                                {items[this.props.index].mc}
                            </span>
                        }
                    </div>
                    <div className="itemAbilityText">{items[this.props.index].active[0].desc}</div>
                </div>
            );
        }
        return;
    }

    renderPassive = () => {
        let passive = [];
        if ("passive" in items[this.props.index]) {
            for (let i = 0; i < items[this.props.index].passive.length; i++) {
                passive.push(
                    <div key={i} className="itemAbility">
                        <div className="itemAbilityHeader">
                            <span className="itemAbilityHeaderTitle">Passive: {items[this.props.index].passive[i].name}</span>
                        </div>
                        <div className="itemAbilityText">{items[this.props.index].passive[i].desc}</div>
                    </div>
                );
            }
        }
        return passive;
    }

    renderUse = () => {
        if ("use" in items[this.props.index]) {
            return (
                <div className="itemAbility">
                    <div className="itemAbilityHeader">
                        <span className="itemAbilityHeaderTitle">Use: {items[this.props.index].use[0].name}</span>
                        {items[this.props.index].cd !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/cooldown.png" />
                                {items[this.props.index].cd}
                            </span>
                        }
                        {items[this.props.index].mc !== false && 
                            <span className="itemAbilityHeaderStat">
                                <img className="itemSymbol" alt="" src="http://cdn.dota2.com/apps/dota2/images/tooltips/mana.png" />
                                {items[this.props.index].mc}
                            </span>
                        }
                    </div>
                    <div className="itemAbilityText">{items[this.props.index].use[0].desc}</div>
                </div>
            );
        }
        return;
    }

    renderAttributes = () => {
        let attrib = [];
        for (let i = 0; i < items[this.props.index].attrib.length; i++) {
            attrib.push(
                <span key={i} className="itemAttribText">
                    {items[this.props.index].attrib[i].header}
                    <span className="itemAttribNum">
                        {items[this.props.index].attrib[i].value + " "}
                    </span>
                    {items[this.props.index].attrib[i].footer}
                </span>
            )
        }
        return attrib;
    }

    render() {
        if (this.props.index === -1) {
            return (
                <div className="item">
                    <div className="itemHeader">
                        <div>
                            <img alt="" src="http://cdn.dota2.com/apps/dota2/images/items/recipe_lg.png" />
                        </div>
                        <div className="itemHeaderText">
                            <span className="itemName">Recipe</span>
                        </div>
                    </div>
                </div>
            );
        } else {
            if (this.props.easy) {
                return (
                    <div className="item">
                        <div className="itemHeader">
                            <div>
                                <img alt="" src={"http://cdn.dota2.com/apps/dota2/images/items/" + items[this.props.index].id + "_lg.png"} />
                            </div>
                            <div className="itemHeaderText">
                                <span className="itemName">{items[this.props.index].dname}</span>
                                <span className="itemPrice">
                                    <img className="itemSymbol" alt="" src={"http://cdn.dota2.com/apps/dota2/images/tooltips/gold.png"} />
                                    {items[this.props.index].cost}
                                </span>
                            </div>
                        </div>
                        <div className="itemAttrib">
                            {this.renderAttributes()}
                        </div>
                        {this.renderUpgrade()}
                        {this.renderToggle()}
                        {this.renderActive()}
                        {this.renderPassive()}
                        {this.renderUse()}
                        <div className="itemLore">
                            {items[this.props.index].lore}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="item">
                        <div className="itemHeader">
                            <div>
                                <img alt="" src={"http://cdn.dota2.com/apps/dota2/images/items/" + items[this.props.index].id + "_lg.png"} />
                            </div>
                            <div className="itemHeaderText">
                                <span className="itemName">{items[this.props.index].dname}</span>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        easy: state.easy
    };
}

export default connect(mapStateToProps)(ItemHover);