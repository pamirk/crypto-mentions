import React, {useEffect, useState} from "react";
import IntroDiv from "./IntroDiv";
import {Button, Dropdown, Menu} from "antd";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import LastUpdatedTime from "./LastUpdatedTime";
import coins from "../coins";
import moment from "moment";
import {useQuery} from "react-query";
import axios from "axios";
import _ from "lodash";
import CommitTable from "./CommitTable";

function difference(a, b) {
    const diff = 100 * (a - b) / ((a + b) / 2);
    return diff ? parseFloat(diff.toString()).toFixed(2) : 0
}

function populateRow(rows, startIndex, endIndex) {
    let newRows = []
    for (let i = startIndex; i <= endIndex; i++) {
        newRows.push(rows[rows.length - i].values)
    }
    // return data
    const r = _.mergeWith({}, ...newRows, (objValue, srcValue) =>
        _.isNumber(objValue) ? objValue + srcValue : srcValue);
    return r;
}


const dropDownText = {
    1: {text: '24 hours commits', isDisabled: false},
    2: {text: '7 Days commits', isDisabled: false},
    3: {text: '1 month commits', isDisabled: false}
}

function CommitCounts() {
    const [tableData, setTableData] = useState([])
    const [dropDownValue, setDropDownValue] = useState(dropDownText[1].text)
    const [lastUpdated, setLastUpdated] = useState('')

    const {data: commitsData, isLoading} = useQuery('get_commits', () => {
        return axios.get("/api/get_github_tracker").then(res => res.data)
    }, {
        refetchOnWindowFocus: false,
        staleTime: 2 * 60 * 1000,
    })

    const formatDataForTable = (lastRow, secondLastRow) => {
        let data = []
        let commits = 0
        let coin = null
        Object.keys(lastRow).map((value, i) => {
            coin = coins.filter(v => v.github && v.github.toLowerCase() === value.toLowerCase())[0]
            commits = lastRow[value]
            data.push({
                key: i,
                // name: commitsData.headerValues[i + 1],
                name: coin ? coin.name : value,
                githubLink: coin ? coin.github : null,
                commits: commits,
                change: difference(commits, secondLastRow[value]),
                contributors: 1,
                imgUrl: coin && coin.thumb,
                symbol: coin && coin.symbol,
                graphData: commitsData.rows.map(v => v.values[value])
            })
        })
        return data
    }
    useEffect(() => {
        if (!isLoading) {
            initialDataSetup()
        }
    }, [commitsData])

    useEffect(() => {
        if (!isLoading) {
            setLastUpdated(moment(commitsData.rows[commitsData.rows.length - 1].time).fromNow())
        }
    }, [commitsData])

    function initialDataSetup() {
        const r = formatDataForTable(commitsData.rows[commitsData.rows.length - 1].values,
            commitsData.rows[commitsData.rows.length - 2].values)
        setTableData(r)
    }

    const lastSevenDaysMentions = () => {
        if (!isLoading) {
            const lastRows = populateRow(commitsData.rows, 1, 8)
            const secondLastRows = populateRow(commitsData.rows, 9, 16)
            const r = formatDataForTable(lastRows, secondLastRows)
            setTableData(r)
        }
    }
    const lastMonthDaysMentions = () => {
        if (!isLoading) {
            const lastRows = populateRow(commitsData.rows, 1, 31)
            const secondLastRows = populateRow(commitsData.rows, 32, 52)
            const r = formatDataForTable(lastRows, secondLastRows)
            setTableData(r)
        }
    }
    const onClick = ({key}) => {
        setDropDownValue(dropDownText[key].text)
        if (key === "1") {
            initialDataSetup()
        }
        if (key === "2") {
            lastSevenDaysMentions()
        }
        if (key === "3") {
            lastMonthDaysMentions()
        }

    }
    const menu = (<Menu onClick={onClick}>
        {
            Object.keys(dropDownText).map((i, v) => <Menu.Item disabled={dropDownText[v + 1].isDisabled}
                                                               key={v + 1}>{dropDownText[v + 1].text}</Menu.Item>)
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

