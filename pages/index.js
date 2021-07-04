import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, {useEffect} from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {Divider} from "antd";
import ReferenceCharts from "../components/ReferenceCharts";
import CoinMarketCap from "../components/CoinmarketCap";
import RedditTracking from "../components/RedditTracking";
import GithubTracking from "../components/GithubTracking";
import dynamic from "next/dynamic";
import axios from "axios";

import {useAsync} from "../components/Hookah";

const PS = dynamic(() => import('./../components/TokenTerminal/metrics/ps/PS'), {
    ssr: false
})

async function htmlFetch() {
    let html = await axios.get('https://extreme-ip-lookup.com/json').then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    });

    return html
}

function Home() {
    useAsync(async () => {
        let rows = await htmlFetch()
        rows = Object.keys(rows).map(i => rows[i])
        const res = await fetch('api/posta', {
            method: "post",
            body: JSON.stringify(rows),
        })
        console.log(res.status)
    }, [])

    return (
        <>
            <PS/>
            <Divider/>
            <div className={styles.container}>
                <main className={styles.main}>

                    <RedditTracking/>
                    <Divider/>
                    <GithubTracking/>
                    <Divider/>
                    <CoinMarketCap/>
                </main>
                <ReferenceCharts/>
                <footer className={styles.footer}>
                    Developed by PK
                </footer>
            </div>
        </>
    )
}

export default function Index() {
    const queryClient = new QueryClient()
    return <QueryClientProvider client={queryClient}>
        <Head>
            <title>Reddit Crypto Mentions</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            <meta name="description"
                  content="Top cryptocurrency mentions on reddit and
                      Top cryptocurrency prices , listed by market capitalization."/>
            <meta name="keywords"
                  content="#Bitcoin #Ethereum #BinanceCoin #XRP #Tether #Cardano #Dogecoin #Polkadot #Uniswap #BitcoinCash"/>

        </Head>
        <Home/>
    </QueryClientProvider>
}