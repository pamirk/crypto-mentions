import React, {useEffect, useState} from "react";
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css'

function Home() {
    const [tableData, setTableData] = useState(null)

    useEffect(() => {
        fetch("https://api.alternative.me/fng/?limit=31").then(res => res.json()).then(res => {
            console.log(res.data)
            setTableData(res.data)
        })
    }, [])
    return (
        <div className={styles.container}>
            {tableData && tableData[0].value_classification}
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