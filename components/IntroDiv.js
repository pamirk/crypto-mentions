import React from "react";
import styled from 'styled-components';

const CenterHorizontally = styled.div`
    box-sizing: border-box;
    margin: 0;
    flex: 1 1 0;
    @media screen and (min-width: 768px) {
    margin-right: 0;
    }
`
const Text = styled.h1`
    font-weight: 700;
    font-size: 14px;
    line-height: 28px;
    color: rgb(34, 37, 49);
    text-align: center;
    @media screen and (min-width: 768px)  {
    font-size: 24px;
    line-height: 34px;
    }
`

function Index({text}) {
    return (
        <CenterHorizontally>
            <Text>{text}</Text>
        </CenterHorizontally>
    );
}

export default Index;

