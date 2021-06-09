import {Table} from 'antd';

import React from "react";
import ChangeText from "./ChangeText";
import useColumnSearch from "./ColumnSearch";
import GitSymbolText from "./GitSymbolText";
import dynamic from 'next/dynamic'

const GitTinyLine = dynamic(() => import('./GitTinyLine'), {
    ssr: false
})

const mentionsSearch = (value, record, dataIndex) => Number(record[dataIndex]) >= Number(value)

function CommitTable({loading, data}) {
    const [nameSearchHook] = useColumnSearch()
    const [mentionSearchHook] = useColumnSearch()

    const columns = [
        {
            title: 'Coin',
            dataIndex: 'name',
            key: 'name',
            ...nameSearchHook('name', null),
            render: (text, record) => (
                <GitSymbolText github={record.githubLink} name={text} symbol={record.symbol} imgUrl={record.imgUrl}/>
            ),
        },
        {
            title: 'Change',
            dataIndex: 'change',
            key: 'change',
            sorter: (a, b) => a.change - b.change,
            render: (text, record) => <ChangeText value={text}/>,
        },
        {
            title: 'Commits',
            dataIndex: 'commits',
            key: 'commits',
            sorter: (a, b) => a.commits - b.commits,
            defaultSortOrder: 'descend',
            ...mentionSearchHook('commits', mentionsSearch, 'number'),
            render: text => <>{text} commits</>,
        },
        {
            title: 'Past 3 months activity',
            dataIndex: 'graphData',
            key: 'graphData',
            render: (text, record) => <GitTinyLine data={record.graphData}/>,
        },
    ];
    return (
        <Table loading={loading}
               scroll={{x: 'calc(200px + 60%)'}}
               style={{width: '100vw'}}
               columns={columns} dataSource={data}/>
    );
}

export default CommitTable;

