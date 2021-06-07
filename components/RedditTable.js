import {Table} from 'antd';

import React from "react";
import CoinText from "./CoinText";
import ChangeText from "./ChangeText";
import useColumnSearch from "./ColumnSearch";


function Index({loading, data}) {
    const [nameSearchHook] = useColumnSearch()
    const [mentionSearchHook] = useColumnSearch()

    const mentionsSearch = (value, record, dataIndex) => Number(record[dataIndex]) >= Number(value)


    const columns = [
        {
            title: 'Coin',
            dataIndex: 'name',
            key: 'name',
            ...nameSearchHook('name', null),
            render: (text, record) => (
                <CoinText name={text} symbol={record.symbol} imgUrl={record.imgUrl}/>
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
            title: 'Mentions',
            dataIndex: 'mentions',
            key: 'mentions',
            sorter: (a, b) => a.mentions - b.mentions,
            defaultSortOrder: 'descend',
            ...mentionSearchHook('mentions', mentionsSearch, 'number'),
            render: text => <a>{text} mentions</a>,
        }
    ];
    return (
        <Table loading={loading}
               style={{width: '100vw'}}
               columns={columns}
               dataSource={data}/>
    );
}

export default Index;

