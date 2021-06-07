import React from "react";
import styled from 'styled-components';

const CenterHorizontally = styled.div`
    box-sizing: border-box;
    margin: 0;
    display: flex;
    align-items: center;
`
const CenterVertically = styled.div`
    box-sizing: border-box;
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    @media screen and (min-width: 768px) {
        flex-direction: row;
        align-items: center;
    }
`
const Name = styled.p`
    line-height: 16px;
    margin: 0 0 0 12px;
    color: rgb(34, 37, 49);
    font-weight: 600;
    font-size: 14px;
`
const SymbolContainter = styled.div`
    display: flex;
    flex-direction: row; 
    align-items: center;
`
const SymbolText = styled.p`
    line-height: 16px;
    margin: 0px 0px 0px 12px;
    color: rgb(128, 138, 157);
    font-size: 12px;
`
const CoinLogo = styled.img`
    height: 24px;
    width: 24px;
    border-radius: 12px;
`


function GitSymbolText({name, github, symbol, imgUrl}) {
    return (
        <CenterHorizontally>

            <CoinLogo src={imgUrl}/>
            <CenterVertically>
                {github ? <a href={`https://github.com/${github}`} target='_blank' rel="noreferrer">
                    <Name>{name}</Name>
                </a> : <Name>{name}</Name>}

                <SymbolContainter>
                    <SymbolText> {symbol}</SymbolText>
                </SymbolContainter>
            </CenterVertically>
        </CenterHorizontally>
    );
}

export default GitSymbolText;

