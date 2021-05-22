import React, {useEffect, useState} from "react";
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css'

function Home() {
    const [tableData, setTableData] = useState(null)

    useEffect(() => {
        fetch("https://official-joke-api.appspot.com/random_joke").then(res => res.json()).then(res => {
            console.log(res)
            setTableData(res)
        })
    }, [])
    return (
        <div className={styles.container}>
            {tableData && tableData.setup}
            <footer className={styles.footer}>
                Developed by PK
            </footer>
        </div>
    )
}

export default function Index() {
    return (
        <Home/>
    )
}