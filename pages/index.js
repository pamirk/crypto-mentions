import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import {Divider} from "antd";
import ReferenceCharts from "../components/ReferenceCharts";
import CoinMarketCap from "../components/CoinmarketCap";
import RedditTracking from "../components/RedditTracking";
import GithubTracking from "../components/GithubTracking";
import PS from "./../components/TokenTerminal/metrics/ps/PS";

/*import dynamic from "next/dynamic";

const PS = dynamic(() => import('./../components/TokenTerminal/metrics/ps/PS'), {
    ssr: false
})*/

function Home() {
    return (
        <>
            <PS/>
            <Divider/>
            <div className={styles.container}>
                <main className={styles.main}>

                    <RedditTracking/>
                    <Divider/>
                    {/*  <GithubTracking/>
                    <Divider/>*/}
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