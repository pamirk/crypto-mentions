import React, {useState} from "react";
import {Button} from "antd";

function Index({loading, data}) {
    const [buttonLoading, setButtonLoading] = useState(false)
    return (
        <Button type="primary" loading={buttonLoading} onClick={getHourData}>
            Get latest hourly data
        </Button>
    );
}

export default Index;

