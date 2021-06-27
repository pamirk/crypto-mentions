import React from "react"
import {useTheme} from "../../../../context/ThemeContext"
import {getChartLabel} from "../../../../helpers/numerals"

type Props = {
  x: number
  y: number
  value: number
  datakey?: string
  width: number
}

const CustomLabel = (props: Props) => {
  const { mode } = useTheme()
  const { x, y, value, datakey, width } = props

  return (
    <text
      x={x + width / 2}
      y={y}
      dy={-4}
      textAnchor="middle"
      fontSize={10}
      fill={mode === "light" ? "#2A2A2A" : "#FFFFFF"}
    >
      {getChartLabel(value, datakey)}
    </text>
  )
}

export default CustomLabel