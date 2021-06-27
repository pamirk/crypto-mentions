import React, {useMemo, useState} from "react"
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts"
import {getLabelForChart} from "../../../helpers/numerals"
import {NoDataDiv} from "./ChartComponents"
import CustomTooltip from "./tooltip/CustomTooltip"
import {debounce} from "lodash"
import {useTheme} from "../../../context/ThemeContext"
import {isMobile} from "../../../helpers/generic"
import {chartMargin} from "./ChartUtils"
import CustomLabel from "./label/CustomLabel";


const BarChartGraph = (props: {
    chartData: any[]
    label?: string
    xAxisDataKey: string
    barDataKey: string
}) => {
    const {chartData, label, xAxisDataKey, barDataKey} = props
    const [activeIndex, setActiveIndex] = useState(-1)

    const {mode} = useTheme()

    const labelColor = mode === "light" ? "#000" : "#FFF"
    // const watermark =
    //   mode === "light" ? BarChartWatermarkGray : BarChartWatermarkWhite

    const handleMouseEnter = useMemo(
        () => debounce((_, index) => setActiveIndex(index), 20),
        []
    )

    if (chartData.length === 0) {
        return <NoDataDiv>{"No chart data available at the moment."}</NoDataDiv>
    }

    return (
        <ResponsiveContainer  height={isMobile ? 250 : 500}>
            <BarChart
                data={chartData}
                margin={{
                    ...chartMargin,
                    bottom: isMobile ? 40 : 70,
                    left: isMobile ? -15 : 35,
                }}

                onMouseLeave={() => setActiveIndex(-1)}
            >
                <CartesianGrid
                    vertical={false}
                    strokeDasharray="2 0"
                    stroke={mode === "light" ? "#eee" : "#666"}
                />
                <XAxis
                    tick={{
                        fontSize: isMobile ? 9 : 12,
                        fill: mode === "light" ? "#000" : "#FFF",
                    }}
                    dataKey={xAxisDataKey}
                    allowDataOverflow={true}
                    angle={isMobile ? -90 : -45}
                    interval={0}
                    textAnchor="end"
                />
                <YAxis allowDecimals={false}
                       label={
                           !isMobile
                               ? {
                                   angle: -90,
                                   value: label,
                                   position: "insideLeft",
                                   offset: -30,
                                   style: {
                                       fontSize: isMobile ? 9 : 12,
                                       fill: labelColor,
                                       textAnchor: "middle",
                                   },
                               }
                               : undefined
                       }
                       tick={{
                           fontSize: isMobile ? 9 : 12,
                           fill: mode === "light" ? "unset" : "#FFF",
                       }}
                       axisLine={false}
                       tickFormatter={(tick) => getLabelForChart(tick, barDataKey)}
                />
                <Tooltip cursor={isMobile} content={<CustomTooltip/>}/>
                <Bar
                    dataKey={barDataKey}
                    fill="#6FECCE"
                    onMouseEnter={handleMouseEnter}
                    label={!isMobile ? (props) =>  <CustomLabel datakey={barDataKey} {...props} /> : undefined}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            fill={index === activeIndex ? "#b8d9ce" : "#6FECCE"}
                            key={`cell-${index}`}
                        />
                    ))}
                </Bar>
                {/*{watermark}*/}
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarChartGraph

// const BarChartWatermarkWhite = (
//   <image
//     href={LogoWhite}
//     x={isMobile ? "35%" : "42%"}
//     y={isMobile ? "36.5%" : "37.5%"}
//     height={isMobile ? "15" : "40"}
//     width={isMobile ? "100" : "260"}
//   />
// )
// const BarChartWatermarkGray = (
//   <image
//     href={LogoGray}
//     x={isMobile ? "35%" : "42%"}
//     y={isMobile ? "36.5%" : "37.5%"}
//     height={isMobile ? "15" : "40"}
//     width={isMobile ? "100" : "260"}
//   />
// )
