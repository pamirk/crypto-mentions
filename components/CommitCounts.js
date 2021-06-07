import React, {useEffect, useState} from "react";
import IntroDiv from "./IntroDiv";
import {Button, Dropdown, Menu} from "antd";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import LastUpdatedTime from "./LastUpdatedTime";
import coins from "../coins";
import moment from "moment";
import {useQuery} from "react-query";
import axios from "axios";
import CommitTable from "./CommitTable";

function difference(a, b) {
    const diff = 100 * (a - b) / ((a + b) / 2);
    return diff ? parseFloat(diff.toString()).toFixed(2) : 0
}

const dropDownText = {
    1: {text: '24 hours commits', isDisabled: false},
    2: {text: '7 Days commits', isDisabled: true},
    3: {text: '1 month commits', isDisabled: true}
}

function CommitCounts() {
    const [tableData, setTableData] = useState(null)
    const [dropDownValue, setDropDownValue] = useState(dropDownText[1].text)
    const [coinNames, setCoinNames] = useState([])
    const [lastUpdated, setLastUpdated] = useState(null)

    const {data: mentionsData, isSuccess, isFetching, isLoading} = useQuery('get_mentions', () => {
        return axios.get("/api/get_github_tracker").then(res => res.data)
    }, {
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    })

    const formatDataForTable = (symbolNames, lastRow, secondLastRow) => {
        let data = []
        let commits = 0
        let coin = null
        Object.keys(lastRow).map((value, i) => {
            coin = coins.filter(v => v.github &&  v.github.toLowerCase() === value.toLowerCase())[0]
            commits = lastRow[value]
            data.push({
                key: i,
                // name: mentionsData.headerValues[i + 1],
                name: coin ? coin.name : value,
                commits: commits,
                change: difference(commits, secondLastRow[value]),
                contributors: 1,
                imgUrl: coin && coin.thumb,
                symbol: coin && coin.symbol,
                graphData: mentionsData.rows.map(v => v.values[value])
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
        setDropDownValue(dropDownText[key].text)
        if (key === "1") {
            initialDataSetup()
        }

    }
    const menu = (<Menu onClick={onClick}>
        {
            Object.keys(dropDownText).map((i, v) => <Menu.Item disabled={dropDownText[v + 1].isDisabled} key={v + 1}>{dropDownText[v + 1].text}</Menu.Item>)
        }
    </Menu>);

    return (
        <>
            <IntroDiv text="GitHub Activity Monitor"/>
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
            <CommitTable loading={isLoading} data={tableData}/>
        </>
    );
}

export default CommitCounts;

