import {Table, Input, Button, Space, Progress} from 'antd';
import React, {useEffect, useRef, useState} from "react";
import CoinText from "./CoinText";
import ChangeText from "./ChangeText";
import {useQuery} from "react-query";
import axios from "axios";
import IntroDiv from "./IntroDiv";
import moment from "moment";
import LastUpdatedTime from "./LastUpdatedTime";
import styles from "../styles/Home.module.css";
import Last7daysComponent from "./Last7daysComponent";
import useColumnSearch from "./ColumnSearch";
import numeral from "numeral";


function numberWithCommas(x) {
    return x
    // return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function CoinMarketCap() {
    const [tableData, setTableData] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)
    const [nameSearchHook] = useColumnSearch()
    const {data: coinData, isSuccess, isFetching, isLoading} = useQuery('coinmarketcap', () => {
        return axios.get("/api/get_coinmarket").then(res => res.data)
    }, {
        refetchOnWindowFocus: true,
        staleTime: 10 * 1000,
    });

    const formatDataForTable = (d) => {
        let data = []
        d.map((v, i) => {
            data.push({
                key: v.id,
                name: v.name,
                symbol: v.symbol,
                slug: v.slug,
                price: numeral(v.quotes[0].price).format("($ 0.00 a)"),
                percentChange1h: v.quotes[0].percentChange1h,
                percentChange24h: v.quotes[0].percentChange24h,
                percentChange7d: v.quotes[0].percentChange7d,
                marketCap: numeral(v.quotes[0].marketCap).format("($ 0.00 a)") ,
                volume24h: numeral(v.quotes[0].volume24h).format("($ 0.00 a)"),
                circulatingSupply: v.circulatingSupply,
                maxSupply: v.maxSupply,
            })
        })

        return data
    }


    useEffect(() => {
        if (isSuccess) {
            setLastUpdated(moment(coinData.status.timestamp).fromNow())
        }
    }, [coinData])
    useEffect(() => {
        if (isSuccess) {
            initialDataSetup()
        }
    }, [coinData])

    function initialDataSetup() {
        setTableData(formatDataForTable(coinData.data.cryptoCurrencyList))
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            ...nameSearchHook('name', null),
            render: (text, record) => (
                <CoinText name={text} webLink={record.slug} symbol={record.symbol}
                          imgUrl={`https://s2.coinmarketcap.com/static/img/coins/64x64/${record.key}.png`}/>
            ),
        }
        ,
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            // render: text => <>{'$ ' + numberWithCommas(parseFloat(text).toFixed(2))}</>,

        },
        /*{
            title: '1h %',
            dataIndex: 'percentChange1h',
            key: 'percentChange1h',
            sorter: (a, b) => a.percentChange1h - b.percentChange1h,
            render: (text) => <ChangeText value={parseFloat(text).toFixed(2)}/>,
        },*/
        {
            title: '24h %',
            dataIndex: 'percentChange24h',
            key: 'percentChange24h',

            sorter: (a, b) => a.percentChange24h - b.percentChange24h,
            render: (text) => <ChangeText value={parseFloat(text).toFixed(2)}/>,
        },
        {
            title: '7d %',
            dataIndex: 'percentChange7d',
            key: 'percentChange7d',
            sorter: (a, b) => a.percentChange7d - b.percentChange7d,
            render: (text) => <ChangeText value={parseFloat(text).toFixed(2)}/>,
        },
        {
            title: 'Market Cap',
            dataIndex: 'marketCap',
            key: 'marketCap',

            sorter: (a, b) => a.marketCap - b.marketCap,
            // render: text => <>$ {numberWithCommas(parseFloat(text).toFixed(2))}</>,
        },
        {
            title: 'Volume(24h)',
            dataIndex: 'volume24h',
            key: 'volume24h',

            sorter: (a, b) => a.volume24h - b.volume24h,
            // render: text => <>$ {numberWithCommas(parseFloat(text).toFixed(2))}</>,
        },
        {
            title: 'Circulating Supply',
            dataIndex: 'circulatingSupply',
            key: 'circulatingSupply',

            sorter: (a, b) => a.circulatingSupply - b.circulatingSupply,
            render: (text, record) => <div>
                {numeral(text).format("($ 0.00 a)")}
                {record.maxSupply && <Progress size="small"
                                               percent={parseFloat(100 * record.circulatingSupply / record.maxSupply).toFixed(0)}
                />}
            </div>,
        },
        {
            title: 'Last 7 Days',
            dataIndex: 'Last7Days',
            key: 'Last7Days',
            render: (text, record) => record.percentChange7d >= 0
                ? <img
                    style={{filter: 'hue-rotate( 85deg ) saturate(80%) brightness(0.85)'}}
                    src={`https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/${record.key}.png`}/>
                : <img
                    style={{filter: 'hue-rotate(300deg) saturate(210%) brightness(0.7) contrast(170%)'}}
                    src={`https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/${record.key}.png`}/>

        }
    ];


    return (
        <div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <IntroDiv text="Today's Cryptocurrency Prices by Market Cap"/>
                {(isLoading)
                    ? <div>...</div> :
                    <LastUpdatedTime value={lastUpdated}/>}


            </div>
            <Table loading={isLoading}
                   scroll={{x: 'calc(700px + 60%)'}}
                   size={'small'}
                   style={{width: '100vw'}}
                   columns={columns} dataSource={tableData}/>
        </div>
    );
}

export default CoinMarketCap;

