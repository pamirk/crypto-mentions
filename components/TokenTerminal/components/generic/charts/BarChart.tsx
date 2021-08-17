import React, {useMemo, useState} from "react"
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts"
import {getLabelForChart} from "../../../helpers/numerals"
import {ChartToggle, NoDataDiv} from "./ChartComponents"
import CustomTooltip from "./tooltip/CustomTooltip"
import _, {debounce} from "lodash"
import {useTheme} from "../../../context/ThemeContext"
import {isMobile} from "../../../helpers/generic"
import {chartMargin} from "./ChartUtils"
import CustomLabel from "./label/CustomLabel";
import styled from "styled-components";


const BarChartGraph = (props: {
    chartData: any[]
    label?: string
    xAxisDataKey: string
    barDataKey: string
}) => {
    const {chartData, label, xAxisDataKey, barDataKey} = props
    const [activeIndex, setActiveIndex] = useState(-1)
    const [filtered, setFiltered] = useState<string[]>([])
    const [isLog, setIsLog] = useState<boolean>(false)
    const top30ChartData = useMemo(() => _.takeRight(chartData, 30), [chartData])

    const {mode} = useTheme()

    const labelColor = mode === "light" ? "#000" : "#FFF"
    // const watermark =
    //   mode === "light" ? BarChartWatermarkGray : BarChartWatermarkWhite

    const handleMouseEnter = useMemo(
        () => debounce((_, index) => setActiveIndex(index), 20),
        []
    )

    const filteredData = useMemo(
        () => top30ChartData.filter((entry) => !filtered.includes(entry.project)),
        [top30ChartData, filtered]
    )


    const handleBarClick = (name: string) => {
        const newFiltered = [...filtered, name]
        setFiltered(newFiltered)
    }
    if (top30ChartData.length === 0) {
        return <NoDataDiv>{"Loading, wait for a moment."}</NoDataDiv>
    }

    return (
        <>
            {/*<ChartToggle label="Show as logarithmic scale" onChange={setIsLog}/>*/}
            <ResponsiveContainer height={isMobile ? 250 : 500}>
                <BarChart
                    data={filteredData}
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
                           scale={isLog ? "log" : "auto"}
                           tickFormatter={(tick) => getLabelForChart(tick, barDataKey)}
                    />
                    <Tooltip cursor={isMobile} content={<CustomTooltip/>}/>
                    <Bar
                        dataKey={barDataKey}
                        fill="#6FECCE"
                        onMouseEnter={handleMouseEnter}
                        label={!isMobile ? (props) => <CustomLabel datakey={barDataKey} {...props} /> : undefined}
                    >
                        {filteredData.map((entry, index) => (
                            <Cell
                                cursor="pointer"
                                onClick={() => handleBarClick(entry.project)}
                                fill={index === activeIndex ? "#b8d9ce" : "#6FECCE"}
                                key={`cell-${index}`}
                            />
                        ))}
                    </Bar>
                    {/*{watermark}*/}
                </BarChart>
            </ResponsiveContainer>
            {filtered.length > 0 && (
                <Refresh onClick={() => setFiltered([])}>
                    <RefreshIcon fill={mode === "light" ? "#2A2A2A" : "white"}/>
                    <Text>{"Refresh"}</Text>
                </Refresh>
            )}
        </>
    )
}
const RefreshIcon = ({fill}: { fill: string }) => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10.2364 1.7625C9.14822 0.675 7.65478 0 5.99625 0C2.67917 0 0 2.685 0 6C0 9.315 2.67917 12 5.99625 12C8.7955 12 11.1295 10.0875 11.7974 7.5H10.2364C9.62101 9.2475 7.95497 10.5 5.99625 10.5C3.51219 10.5 1.49343 8.4825 1.49343 6C1.49343 3.5175 3.51219 1.5 5.99625 1.5C7.24203 1.5 8.35272 2.0175 9.16323 2.835L6.74672 5.25H12V0L10.2364 1.7625Z"
            fill={fill}
        />
    </svg>
)

export default BarChartGraph

const Refresh = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`


const Text = styled.div`
  margin-left: 5px;
  font-size: 14px;
`

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
