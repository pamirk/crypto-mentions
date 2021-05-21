import React from "react";
import {QueryClient, QueryClientProvider} from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'

import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css'
import ReferenceCharts from "../components/ReferenceCharts";
function Home() {
    return (
        <div className={styles.container}>
            <ReferenceCharts/>
            <footer className={styles.footer}>
                Developed by PK
            </footer>
        </div>
    )
}

export default function Index() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <Home/>
            <ReactQueryDevtools initialIsOpen={true}/>
        </QueryClientProvider>
    )
}