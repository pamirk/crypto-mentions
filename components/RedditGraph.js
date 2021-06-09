import React, {useEffect} from 'react';
import {TinyArea} from '@ant-design/charts';

const RedditGraph = ({data}) => {

    let config = {
        height: 40,
        width: 200,
        autoFit: false,
        data: data,
        smooth: true,
        areaStyle: {fill: '#d6e3fd'},

    };
    return (<TinyArea {...config}/>);
    return "";
};
export default RedditGraph;
