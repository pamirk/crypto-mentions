import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {QueryClient, QueryClientProvider} from "react-query";
import React from "react";
import GithubTracking from "../components/GithubTracking";

function Home() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <GithubTracking />
            </main>
                <footer className={styles.footer}>Developed by PK</footer>
        </div>
)
}

export default function Index() {
    const queryClient = new QueryClient()
    return <QueryClientProvider client={queryClient}>
    <Head>
    <title>Github tracking</title>
    </Head>
    <Home/>
    </QueryClientProvider>
}