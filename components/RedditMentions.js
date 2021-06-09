import React, {useEffect, useState} from "react";
import IntroDiv from "./IntroDiv";
import {Button, Dropdown, Menu} from "antd";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import LastUpdatedTime from "./LastUpdatedTime";
import RedditTable from "./RedditTable";
import coins from "../coins";
import moment from "moment";
import {useQuery} from "react-query";
import axios from "axios";
import _ from 'lodash';

function difference(a, b) {
    const diff = 100 * (a - b) / ((a + b) / 2);
    return diff ? parseFloat(diff.toString()).toFixed(2) : 0
}

function RedditMentions() {
    const [tableData, setTableData] = useState(null)
    const [dropDownValue, setDropDownValue] = useState('1 hour Mentions')
    const [coinNames, setCoinNames] = useState([])
    const [lastUpdated, setLastUpdated] = useState(null)

    const {data: mentionsData, isSuccess, isFetching, isLoading} = useQuery('get_mentions', () => {
        return axios.get("/api/get_mentions").then(res => res.data)
    }, {
        refetchOnWindowFocus: true,
        staleTime: 2 * 60 * 1000,
    })

    const List = React.useMemo(() => {
            console.time("reddit")
            let obj = {}
            let key = ''
            if (!isLoading) {
                mentionsData.rows.map(i => {
                    key = i.time.split('T')[0]
                    if (obj.hasOwnProperty(key)) {
                        obj[key] = _.unzipWith([_.map(obj[key], _.ary(parseInt, 1)),
                                _.map(i.values, _.ary(parseInt, 1))],
                            _.add)
                    } else {
                        obj[key] = i.values
                    }

                })
                console.timeEnd("reddit")

                return Object.keys(obj).map((value, index) => obj[value])
            }

        }, [mentionsData]
    )


    const formatDataForTable = (symbolNames, lastRow, secondLastRow) => {
        let data = []
        lastRow.map((v, i) => {
            data.push({
                key: i,
                name: mentionsData.headerValues[i + 1],
                mentions: v,
                imgUrl: coins[i].thumb,
                symbol: coins[i].symbol,
                change: difference(v, secondLastRow[i]),
                graphData: List.map(singleArray => singleArray[i])
            })
        })

        return data
    }
    useEffect(() => {
        if (!isLoading) {
            initialDataSetup()
        }
    }, [mentionsData])

    useEffect(() => {
        if (!isLoading) {
            setLastUpdated(moment(mentionsData.rows[mentionsData.rows.length - 1].time).fromNow())
        }
    }, [mentionsData])

    function initialDataSetup() {
        setCoinNames(mentionsData.headerValues)
        setTableData(formatDataForTable(coinNames, mentionsData.rows[mentionsData.rows.length - 1].values,
            mentionsData.rows[mentionsData.rows.length - 2].values))
    }

    const onClick = ({key}) => {
        if (key === "1") {
            setDropDownValue('1 hour Mentions')
            initialDataSetup()
        }
        if (key === "2") {
            setDropDownValue('24 hour Mentions')
            twoFourHoursData(1, 24)
        }
        if (key === "3") {
            setDropDownValue('7 days Mentions')
            lastSevenDaysMentions()
        }
        if (key === "4") {
            setDropDownValue('1 month Mentions')
            //    TODO
        }
        if (key === "5") {
            setDropDownValue('Most Mentions')
            mostMentions()
        }
        if (key === "6") {
            setDropDownValue('Newly Mentions')
            //    TODO
        }
    }
    const menu = (<Menu onClick={onClick}>
        <Menu.Item key="1">1 hour Mentions</Menu.Item>
        <Menu.Item key="2">24 hours Mentions</Menu.Item>
        <Menu.Item key="3">7 days Mentions</Menu.Item>
        <Menu.Item key="4" disabled>1 month Mentions</Menu.Item>
        <Menu.Item key="5">Most Mentions</Menu.Item>
        <Menu.Item key="6" disabled>Newly Mentions</Menu.Item>
    </Menu>);
    const lastSevenDaysMentions = () => {
        if (!isLoading) {
            const lastRows = populateRow(mentionsData.rows, 1, 168)
            setTableData(formatDataForTable(coinNames, lastRows, lastRows))
        }
    }
    const mostMentions = () => {
        if (!isLoading) {
            const lastRows = populateRow(mentionsData.rows, 1, mentionsData.rows.length)
            setTableData(formatDataForTable(coinNames, lastRows, lastRows))
        }
    }
    const twoFourHoursData = (startIndex, endIndex) => {
        if (!isLoading) {
            const lastRows = populateRow(mentionsData.rows, 1, 24)
            const secondLastRows = populateRow(mentionsData.rows, 25, 48)

            setTableData(formatDataForTable(coinNames, lastRows, secondLastRows))
        }
    }

    function populateRow(rows, startIndex, endIndex) {
        let data = []
        for (let i = startIndex; i <= endIndex; i++) {
            data = sumArrays(data, rows[rows.length - i].values)
        }
        return data
    }

    function sumArrays(...arrays) {
        const n = arrays.reduce((max, xs) => Math.max(max, xs.length), 0);
        const result = Array.from({length: n});
        return result.map((_, i) => arrays.map(xs => xs[i] || 0).reduce((sum, x) => sum + Number(x), 0));
    }

    return (
        <>
            <IntroDiv text="Reddit Crypto Mentions"/>
            {(isLoading)
                ? <div>...</div> :
                <LastUpdatedTime value={lastUpdated}/>}
            <div style={{width: '100%', textAlign: 'end', padding: '10px'}}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <Button className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {dropDownValue} <DownOutlined/>
                    </Button>
                </Dropdown>
            </div>
            <RedditTable loading={isLoading} data={tableData}/>
        </>
    );
}

export default RedditMentions;

