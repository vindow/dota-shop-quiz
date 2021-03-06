import React from 'react';
import { connect } from 'react-redux';
import items from '../../data/items.json';
import styled from 'styled-components';

const imgPath = process.env.PUBLIC_URL + '/images/';

const MainBody = styled.div`
    border: 2px rgb(70, 70, 70) groove;
    background-color: #333333;
    color: #cccccc;
    width: 310px;
    text-align: left;
`;

const ItemImage = styled.div.attrs(props => ({
    url: props.url,
}))`
    background-size: cover;
    width: 63.75px;
    height 48px;
    background-image: url(${props => props.url});
`;

const Header = styled.div`
    display: flex;
    padding: 5px;
`;

const HeaderText = styled.div`
    display: flex;
    margin-left: 10px;
    flex-direction: column;
`;

const Name = styled.div`
    color: white;
    font-size: 14pt;
    font-weight: bold;
`;

const Price = styled.div`
    color: gold;
    font-weight: bold;
    display: flex;
`;

const Symbol = styled.img`
    margin: auto 5px auto 0px;
    max-height: 1em;
`;

const Ability = styled.div`
    background-color:#212b3d;
    margin-top: 1em;
`;

const AbilityHeader = styled.div`
    background-color:rgb(64, 76, 99);
    display: flex;
    justify-content: space-between;
    padding: 5px;
    font-weight: bold;
`;

const AbilityHeaderCosts = styled.span`
    display: flex;
`;

const AbilityHeaderStat = styled.span`
    display: flex;
    justify-content: space-between;
    margin: auto 0;
    margin-left: 10px;
`;

const AbilityText = styled.div`
    padding: 5px;
    white-space: pre-wrap;
`;

const Attributes = styled.div`
    display: flex;
    flex-direction: column;
    padding: 5px;
    margin-bottom: -0.5em;
`;

const AttributeNumber = styled.span`
    color:#efefef
`;

const Lore = styled.div`
    padding: 5px;
    font-style: italic;
    color: #aaaaaa
`;
class ItemHover extends React.Component {

    renderUpgrade = () => {
        if ("upgrade" in items[this.props.index]) {
            return ( 
                <Ability>
                    <AbilityHeader>
                        Upgrade: {items[this.props.index].upgrade[0].name}
                        <AbilityHeaderCosts>
                            {items[this.props.index].cd !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "cooldown.png"} />
                                    {items[this.props.index].cd}
                                </AbilityHeaderStat>
                            }
                            {items[this.props.index].mc !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "mana.png"} />
                                    {items[this.props.index].mc}
                                </AbilityHeaderStat>
                            }
                        </AbilityHeaderCosts>
                    </AbilityHeader>
                    <AbilityText>{items[this.props.index].upgrade[0].desc}</AbilityText>
                </Ability>
            );
        }
        return;
    }

    renderToggle = () => {
        if ("toggle" in items[this.props.index]) {
            return (
                <Ability>
                    <AbilityHeader>
                        Toggle: {items[this.props.index].toggle[0].name}
                        <AbilityHeaderCosts>
                            {items[this.props.index].cd !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "cooldown.png"} />
                                    {items[this.props.index].cd}
                                </AbilityHeaderStat>
                            }
                            {items[this.props.index].mc !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "mana.png"} />
                                    {items[this.props.index].mc}
                                </AbilityHeaderStat>
                            }
                        </AbilityHeaderCosts>
                        
                    </AbilityHeader>
                    <AbilityText>{items[this.props.index].toggle[0].desc}</AbilityText>
                </Ability>
            );
        }
        return;
    }

    renderActive = () => {
        if ("active" in items[this.props.index]) {
            return (
                <Ability>
                    <AbilityHeader>
                        Active: {items[this.props.index].active[0].name}
                        <AbilityHeaderCosts>
                            {items[this.props.index].cd !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "cooldown.png"} />
                                    {items[this.props.index].cd}
                                </AbilityHeaderStat>
                            }
                            {items[this.props.index].mc !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "mana.png"} />
                                    {items[this.props.index].mc}
                                </AbilityHeaderStat>
                            }
                        </AbilityHeaderCosts>
                    </AbilityHeader>
                    <AbilityText>{items[this.props.index].active[0].desc}</AbilityText>
                </Ability>
            );
        }
        return;
    }

    renderPassive = () => {
        let passive = [];
        if ("passive" in items[this.props.index]) {
            for (let i = 0; i < items[this.props.index].passive.length; i++) {
                passive.push(
                    <Ability key={i}>
                        <AbilityHeader>
                            Passive: {items[this.props.index].passive[i].name}
                        </AbilityHeader>
                        <AbilityText>{items[this.props.index].passive[i].desc}</AbilityText>
                    </Ability>
                );
            }
        }
        return passive;
    }

    renderUse = () => {
        if ("use" in items[this.props.index]) {
            return (
                <Ability>
                    <AbilityHeader>
                        Use: {items[this.props.index].use[0].name}
                        <AbilityHeaderCosts>
                            {items[this.props.index].cd !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "cooldown.png"} />
                                    {items[this.props.index].cd}
                                </AbilityHeaderStat>
                            }
                            {items[this.props.index].mc !== false && 
                                <AbilityHeaderStat>
                                    <Symbol alt="" src={imgPath + "mana.png"} />
                                    {items[this.props.index].mc}
                                </AbilityHeaderStat>
                            }
                        </AbilityHeaderCosts>
                    </AbilityHeader>
                    <AbilityText>{items[this.props.index].use[0].desc}</AbilityText>
                </Ability>
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
                    <AttributeNumber>
                        {items[this.props.index].attrib[i].value + " "}
                    </AttributeNumber>
                    {items[this.props.index].attrib[i].footer}
                </span>
            )
        }
        return attrib;
    }

    render() {
        if (this.props.index === -1) {
            return (
                <MainBody>
                    <Header>
                        <ItemImage url={imgPath + 'recipe_lg.png'} />
                        <HeaderText>
                            <Name>Recipe</Name>
                        </HeaderText>
                    </Header>
                </MainBody>
            );
        } else {
            if (this.props.easy) {
                return (
                    <MainBody>
                        <Header>
                            <ItemImage url={imgPath + items[this.props.index].id + "_lg.png"} />
                            <HeaderText>
                                <Name>{items[this.props.index].dname}</Name>
                                <Price>
                                    <Symbol alt="" src={imgPath + "gold.png"} />
                                    {items[this.props.index].cost}
                                </Price>
                            </HeaderText>
                        </Header>
                        <Attributes>
                            {this.renderAttributes()}
                        </Attributes>
                        {this.renderUpgrade()}
                        {this.renderToggle()}
                        {this.renderActive()}
                        {this.renderPassive()}
                        {this.renderUse()}
                        <Lore>
                            {items[this.props.index].lore}
                        </Lore>
                    </MainBody>
                );
            } else {
                return (
                    <MainBody>
                        <Header>
                            <ItemImage url={imgPath + items[this.props.index].id + "_lg.png"} />
                            <HeaderText>
                                <Name>{items[this.props.index].dname}</Name>
                            </HeaderText>
                        </Header>
                    </MainBody>
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