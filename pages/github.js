import Head from 'next/head'

import {QueryClient, QueryClientProvider} from "react-query";
import React from "react";
import dynamic from "next/dynamic";

const PS = dynamic(() => import('./../components/TokenTerminal/metrics/ps/PS'), {
    ssr: false
})

function Home() {
    return (
        <div>
            <PS/>
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