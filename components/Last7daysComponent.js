import React from "react";
import CaretUpOutlined from "@ant-design/icons/lib/icons/CaretUpOutlined";
import CaretDownOutlined from "@ant-design/icons/lib/icons/CaretDownOutlined";
import MinusOutlined from "@ant-design/icons/lib/icons/MinusOutlined";

function Last7daysComponent({key, value}) {
    return (value > 0
            ? <img
                style={{filter: 'hue-rotate( 85deg ) saturate(80%) brightness(0.85)'}}
                src={`https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/${key}.png`}/>
            : <img
                style={{filter: 'hue-rotate(300deg) saturate(210%) brightness(0.7) contrast(170%)'}}
                src={`https://s3.coinmarketcap.com/generated/sparklines/web/7d/usd/${key}.png`}/>
    );
}

export default Last7daysComponent;

