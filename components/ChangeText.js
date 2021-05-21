import React from "react";
import CaretUpOutlined from "@ant-design/icons/lib/icons/CaretUpOutlined";
import CaretDownOutlined from "@ant-design/icons/lib/icons/CaretDownOutlined";
import MinusOutlined from "@ant-design/icons/lib/icons/MinusOutlined";

function Index({value}) {
    return (value === 0) ? <MinusOutlined/> : (value > 0
            ? <div style={{display: 'flex', alignItems: 'center'}}>
                <CaretUpOutlined style={{fontSize: '24px', color: 'green'}}/>{' '} {Math.abs(value)}%
            </div>
            : <div style={{display: 'flex', alignItems: 'center'}}><CaretDownOutlined
                style={{fontSize: '24px', color: 'red'}}/>{' '} {Math.abs(value)}% </div>
    );
}

export default Index;

