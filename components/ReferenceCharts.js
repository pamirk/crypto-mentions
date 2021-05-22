import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import {useQuery} from "react-query";
import axios from "axios";
import {Skeleton} from "antd";

const Columns = styled.div`
    margin-left: -.75rem;
    margin-right: -.75rem;
    margin-top: -.75rem;
    &:not(:last-child) {
      margin-bottom: .75rem;
    }
    @media print, screen and (min-width: 769px){
     &:not(.is-desktop) {
        display: flex;
        justify-content: center;

      }
    }
`
const Column = styled.div`
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1; 
    padding: .75rem;
    @media print, screen and (min-width: 769px) {
      flex: none;
      width: 33.3333%;
    }   
`
const Box = styled.div`
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%);
    color: #4a4a4a;
    display: block;
    padding: 1.25rem;
    width: 100%;
`
const Img = styled.img`
    border-radius: 6px;
    vertical-align: bottom;
    height: auto;
    max-width: 100%;
`
const Title = styled.h2`
    color: #363636;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.125;
`
const Value = styled.div`
    border-bottom: 1px solid #ccc;
    padding-bottom: 5px;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    
    &:last-child {
    border-bottom: 0;
    margin-bottom: 0;
    padding-bottom: 3px;
    }
`
const Status = styled.div`
    font-weight: 700;
    font-size: 18px;
    color: #9bbe44;
`
const Circle = styled.div`
    margin-top: 2px;
    padding: 13px 8px;
    border-radius: 26px;
    color: #fff;
    background-color: #9bbe44;
    font-size: 22px;
    line-height: 16px;
`
const initialValues = {
    nowStatus: '',
    nowValue: '',
    yesterdayStatus: '',
    yesterdayValue: '',
    lastWeekStatus: '',
    lastWeekValue: '',
    lastMonthStatus: '',
    lastMonthValue: '',
}

function Index() {
    const [tableData, setTableData] = useState(initialValues)
    const {data, isSuccess, isFetching} = useQuery('fear', () => {
        return axios.get("/api/get_fear_data").then(res => {
            return res.data.data
        })
    }, {
        refetchOnWindowFocus: false,
    })
    useEffect(() => {
        if (isSuccess) {
            setTableData({
                nowStatus: data[0].value_classification,
                nowValue: data[0].value,
                yesterdayStatus: data[1].value_classification,
                yesterdayValue: data[1].value,
                lastWeekStatus: data[7].value_classification,
                lastWeekValue: data[7].value,
                lastMonthStatus: data[30].value_classification,
                lastMonthValue: data[30].value,
            })
        }
    }, [data])

    return (
        <Columns>
            <Column>
                <Box>
                    <a href="https://alternative.me/crypto/fear-and-greed-index/" target='_blank'>
                        <Img src="https://alternative.me/crypto/fear-and-greed-index.png"/>
                    </a>
                </Box>
            </Column>

            <Column>
                {(isFetching)
                    ? "loading"
                    : <Box>
                        <Title>Historical Values</Title>
                        <div>
                            <Value>
                                <div>
                                    <div>Now</div>
                                    <Status>{tableData.nowStatus}</Status></div>
                                <div><Circle>{tableData.nowValue}</Circle></div>
                            </Value>
                            <Value>
                                <div>
                                    <div>Yesterday</div>
                                    <Status>{tableData.yesterdayStatus}</Status></div>
                                <div><Circle>{tableData.yesterdayValue}</Circle></div>
                            </Value>
                            <Value>
                                <div>
                                    <div>Last week</div>
                                    <Status>{tableData.lastWeekStatus}</Status></div>
                                <div><Circle>{tableData.lastWeekValue}</Circle></div>
                            </Value>
                            <Value>
                                <div>
                                    <div>Last month</div>
                                    <Status>{tableData.lastMonthStatus}</Status></div>
                                <div><Circle>{tableData.lastMonthValue}</Circle></div>
                            </Value>
                        </div>
                    </Box>
                }
            </Column>
        </Columns>
    );
}

export default Index;

