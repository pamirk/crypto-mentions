import React from "react";
import styled from "styled-components";

function LastUpdatedTime({value}) {
    return <CenterHorizontally>
        <CenterVertically>
            <Text>Last Updated:</Text>
            <Time>{value}</Time>
        </CenterVertically>
    </CenterHorizontally>;
}

export default LastUpdatedTime;

const Text = styled.p`
    line-height: 16px;
    margin: 0px 0px 0px 12px;
    color: rgb(128, 138, 157);
    font-size: 12px;
`
const Time = styled.p`
    line-height: 16px;
    margin: 0 0 0 12px;
    color: rgb(34, 37, 49);
    font-weight: 600;
    font-size: 14px;
`
const CenterVertically = styled.div`
    box-sizing: border-box;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    
`
const CenterHorizontally = styled.div`
    box-sizing: border-box;
    margin: 0;
    flex: 1 1 0;
    @media screen and (min-width: 768px) {
    margin-right: 0;
    }
`