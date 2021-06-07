import React, {useRef} from 'react';
import {TinyLine} from '@ant-design/charts';

const GitTinyLine = ({data}) => {
    let config = {
        height: 40,
        width: 200,
        autoFit: false,
        data: data,
        smooth: true,
    };
    return (<TinyLine {...config}/>);
};
export default GitTinyLine;
