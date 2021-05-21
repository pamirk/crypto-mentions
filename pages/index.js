import React, {useEffect, useState} from "react";
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css'
import axios from "axios";

function Home() {
    const [tableData, setTableData] = useState(null)

    useEffect(() => {
        axios.get("https://api.alternative.me/fng/?limit=31").then(res => {
            console.log(res.data.data)
            setTableData(res.data.data)
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