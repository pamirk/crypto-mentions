import {
  BulkMetricsStore,
  MarketMetricsState,
  ProjectMetricsStore,
  PSMetricsState,
  RevenueMetricsState, RevenueMetricsType,
  TVLMetricsState,
} from "../types/ApiTypes"
import {
  groupBy,
  toArray,
  sumBy,
  omitBy,
  isNil,
  flattenDeep,
  sortBy,
  pickBy,
} from "lodash"

export const months = [
  { short: "Jan", full: "January" },
  { short: "Feb", full: "February" },
  { short: "Mar", full: "March" },
  { short: "Apr", full: "April" },
  { short: "May", full: "May" },
  { short: "Jun", full: "June" },
  { short: "Jul", full: "July" },
  { short: "Aug", full: "August" },
  { short: "Sep", full: "September" },
  { short: "Oct", full: "October" },
  { short: "Nov", full: "November" },
  { short: "Dec", full: "December" },
]

export type RevenueChartEntry = {
  label: string
}

export const hasData = (key?: string | string[], dataset?: any[]) => {
  if (!key || !dataset) return false

  if (Array.isArray(key)) {
    const results = key.map((k) =>
      dataset.some((item) => !!item[k] && item[k] > 0)
    )
    return results.some((value) => value === true)
  }
  return dataset.some((item) => !!item[key] && item[key] > 0)
}

const daysAgo = (prevDate: Date) => {
  const msPerDay = 8.64e7

  const today = new Date()
  return Math.round((today.getTime() - prevDate.getTime()) / msPerDay)
}

export const labelProjectDefaultData = (
  data: ProjectMetricsStore,
  selectedLength: number,
  chartType: string,
  isExchange?: boolean
) => {
  const isDaily = selectedLength <= 365
  let labeled = []
  if (isDaily) {
    if (!data.project.daily) return []

    const filtered = data.project.daily.filter(
      (entry: any) => daysAgo(new Date(entry.datetime)) <= selectedLength + 1
    )

    labeled = filtered.map((entry: any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCDate(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCDate() +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  } else {
    if (!data.project.monthly) return []

    labeled = data.project.monthly.map((entry: any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  }

  const groupedArr = toArray(groupBy(labeled, "label"))
  const result = groupedArr.map((entry) => ({
    label: entry[0].label,
    datetime: entry[0].datetime,
    tooltipLabel: entry[0].tooltipLabel,
    revenue: sumBy(entry, "revenue"),
    market_cap: sumBy(entry, "market_cap"),
    market_cap_circulating: sumBy(entry, "market_cap_circulating"),
    market_cap_fully_diluted: sumBy(entry, "market_cap_fully_diluted"),
    price: sumBy(entry, "price"),
    volume: sumBy(entry, "volume"),
    vol_mc: sumBy(entry, "vol_mc"),
    ps: sumBy(entry, "ps"),
    gmv: sumBy(entry, "gmv"),
    tvl: sumBy(entry, "tvl"),
    revenueSupplySide: sumBy(entry, "revenue_supply_side"),
    revenueProtocol: sumBy(entry, "revenue_protocol"),
  }))

  if (chartType === "cumulative") {
    const cumulativeResult = [...result].reverse()
    const cumulative = {
      revenue: 0,
      revenueSupplySide: 0,
      revenueProtocol: 0,
      gmv: 0,
      volume: 0,
    }
    cumulativeResult.forEach((entry, i) =>
      Object.keys(entry).forEach((key) => {
        switch (key) {
          case "revenue":
          case "revenueProtocol":
          case "revenueSupplySide":
          case "volume":
            cumulative[key] += entry[key]
            cumulativeResult[i][key] = cumulative[key]
            break
          case "gmv":
            if (isExchange) {
              cumulative[key] += entry[key]
              cumulativeResult[i][key] = cumulative[key]
            }
        }
      })
    )

    return cumulativeResult
  }

  return result.reverse()
}

export const labelCompetitiveChart = (
  data: BulkMetricsStore,
  selectedLength: number,
  chartMetric: string,
  isExchange: boolean,
  chartType?: string
) => {
  const isDaily = selectedLength <= 365
  if (isDaily) {
    if (!data || !data.daily) return []

    const projectNames = Object.keys(data.daily).filter(
      (name) => name !== "success"
    )

    const result: any[] = projectNames.map((name) =>
      !!data.daily
        ? data.daily[name].map((entry: any) => {
            const value: number = (entry as any)[chartMetric]
            return {
              [entry.project]: value,
              datetime: new Date(entry.datetime),
              label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCDate(),
              tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCDate() +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            }
          })
        : []
    )

    const flattened = flattenDeep(result)

    const groupedArr = toArray(groupBy(flattened, "datetime"))

    const results = groupedArr
      .map((day) =>
        day.reduce(function (result, current) {
          return Object.assign(result, current)
        }, {})
      )
      .filter((entry) => daysAgo(entry.datetime) <= selectedLength + 1)

    const sortedResults = sortBy(results, "datetime")

    if (
      chartType === "cumulative" &&
      allowedCumulativeMetrics
        .filter((metric) => metric !== "gmv")
        .includes(chartMetric)
    ) {
      return toCumulative([...sortedResults], isExchange)
    }

    return sortedResults
  } else {
    if (!data || !data.monthly) return []

    const projectNames = Object.keys(data.monthly).filter(
      (name) => name !== "success"
    )

    const result: any[] = projectNames.map((name) =>
      !!data.monthly
        ? data.monthly[name].map((entry: any) => {
            const value: number = (entry as any)[chartMetric]
            return {
              [entry.project]: value,
              datetime: entry.datetime,
              label:
                months[new Date(entry.datetime).getUTCMonth()].short +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
              tooltipLabel:
                months[new Date(entry.datetime).getUTCMonth()].full +
                " " +
                new Date(entry.datetime).getUTCFullYear(),
            }
          })
        : []
    )
    const flattened = flattenDeep(result)
    const groupedArr = toArray(groupBy(flattened, "datetime"))
    const results = groupedArr.map((day) =>
      day.reduce(function (result, current) {
        return Object.assign(result, current)
      }, {})
    )

    const sortedResults = sortBy(results, "datetime")

    if (
      chartType === "cumulative" &&
      allowedCumulativeMetrics.includes(chartMetric)
    ) {
      return toCumulative([...sortedResults], isExchange)
    }

    return sortedResults
  }
}

export const labelProjectTop10 = (
  data: ProjectMetricsStore,
  selectedLength: number,
  chartType: string,
  isExchange: boolean,
  metric?: string
) => {
  const isDaily = selectedLength <= 365
  let labeled = []
  if (!metric) return []

  if (isDaily) {
    if (!data.top10.daily) return []
    const filtered = data.top10.daily.filter(
      (entry: any) => daysAgo(new Date(entry.datetime)) <= selectedLength + 1
    )

    labeled = filtered.map((entry: any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCDate(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCDate() +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  } else {
    if (!data.top10.monthly) return []

    labeled = data.top10.monthly.map((entry: any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  }

  const groupedArr = toArray(groupBy(labeled, "label"))

  const groupedComponents = groupedArr.map((entry) =>
    toArray(groupBy(entry, "component"))
  )

  const result = groupedComponents.map((entry) =>
    entry.map((component) => ({
      label: component[0].label,
      datetime: component[0].datetime,
      tooltipLabel: component[0].tooltipLabel,
      [component[0].component]: sumBy(component, metric),
    }))
  )

  const results = result.map((day) =>
    day.reduce(function (result, current) {
      return Object.assign(result, current)
    }, {})
  )
  if (!(!isExchange && metric === "gmv")) {
    if (
      chartType === "cumulative" &&
      allowedCumulativeMetrics.includes(metric)
    ) {
      const cumulativeResult: any = toCumulative(
        [...results].reverse(),
        isExchange
      )

      return cumulativeResult
    }
  }

  // filter out values of undefined, null and 0, if day has no entries with positive value, filter that day out
  const final = results
    .filter((entry) => Object.keys(pickBy(entry)).length > 3)
    .map((entry) => omitBy(entry, isNil))
    .reverse()

  return final
}

export const labelRevenueMetrics = (
  data: RevenueMetricsState,
  selectedLength: number,
  category: string[],
  chartType: string,
  metric: string
) => {
  const isDaily = selectedLength <= 365
  let labeled = []

  const currentData = isDaily ? data.daily : data.monthly
  if (!currentData) return []

  const filtered = currentData.filter(
    (entry: any) =>
      category.includes(entry.category) &&
      daysAgo(new Date(entry.datetime)) <= selectedLength
  )

  if (isDaily) {
    labeled = filtered.map((entry: any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCDate(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCDate() +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  } else {
    labeled = filtered.map((entry: any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  }

  const groupedArr = toArray(groupBy(labeled, "label"))
  const result = groupedArr.map((daily) =>
    daily.map((entry) => {
      const value: number = (entry as any)[metric]

      return {
        label: entry.label,
        datetime: entry.datetime,
        tooltipLabel: entry.tooltipLabel,
        [entry.project]: value,
        category: entry.category,
      }
    })
  )

  const results = result.map((day) =>
    day.reduce(function (result, current) {
      return Object.assign(result, current)
    }, {})
  )

  if (chartType === "cumulative") {
    return toCumulative([...results].reverse(), true)
  }

  // remove entries with null or zero value
  const final = results
    .map((day) => omitBy(day, (val) => isNil(val) || val === 0))
    .filter((day) => Object.keys(day).length > 4)

  return final.reverse()
}

export const labelCumulativeRevenueMetrics = (
  data: RevenueMetricsState,
  selectedLength: number,
  category: string[],
  chartType: string
) => {
  let labeled = []

  const currentData = selectedLength <= 365 ? data.daily : data.monthly
  if (!currentData) return []

  const filtered = currentData.filter(
    (entry: RevenueMetricsType) =>
      daysAgo(new Date(entry.datetime)) <= selectedLength &&
      category.includes(entry.category)
  )

  labeled = filtered.map((entry: any) => ({
    ...entry,
    label:
      months[new Date(entry.datetime).getUTCMonth()].short +
      " " +
      new Date(entry.datetime).getUTCDate(),
  }))

  const groupedArr = toArray(groupBy(labeled, "project"))

  const result = groupedArr.map((entry) => ({
    project: entry[0].project,
    label: entry[0].label,
    category: entry[0].category,
    [chartType]: sumBy(entry, chartType),
  }))

  const sorted = sortBy(result, chartType)

  const final = sorted.filter((day: any) => day[chartType] > 0)

  return final
}

export const labelMarketMetrics = (
  data: MarketMetricsState,
  selectedLength: number,
  metric: string,
  chartType: string,
  isExchange: boolean,
  keys?: string[]
) => {
  const isDaily = selectedLength <= 365
  const currentData = isDaily ? data.daily : data.monthly
  if (!currentData) return []

  let labeled = []

  const filtered = currentData.filter((entry) => {
    if (keys) {
      return (
        daysAgo(new Date(entry.datetime)) <= selectedLength &&
        keys.includes(entry.project) &&
        metric === entry.metric
      )
    }
    return (
      daysAgo(new Date(entry.datetime)) <= selectedLength &&
      metric === entry.metric
    )
  })

  if (isDaily) {
    labeled = filtered.map((entry) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCDate(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCDate() +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  } else {
    labeled = filtered.map((entry) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        +new Date(entry.datetime).getUTCFullYear(),
    }))
  }

  const groupedArr = toArray(groupBy(labeled, "label"))

  const result = groupedArr.map((daily) =>
    daily.map((entry: any) => ({
      label: entry.label,
      datetime: entry.datetime,
      tooltipLabel: entry.tooltipLabel,
      [entry.project]: entry.value,
    }))
  )

  const results = result.map((day) =>
    day.reduce(function (result, current) {
      return Object.assign(result, current)
    }, {})
  )

  if (chartType === "cumulative" && allowedCumulativeMetrics.includes(metric)) {
    return toCumulative([...results].reverse(), isExchange)
  }

  // remove entries with null/undefined/0 value
  const final = results.map((day) =>
    omitBy(day, (val) => isNil(val) || val === 0)
  )

  return final.reverse()
}

export const labelPSData = (
  data: PSMetricsState,
  selectedLength: number,
  category: string[]
) => {
  const currentData = selectedLength <= 365 ? data.daily : data.monthly
  if (!currentData) return []

  let result

  if (selectedLength === 1) {
    let projects = new Set()
    currentData.forEach(
      (entry) =>
        category.includes(entry.category) && projects.add(entry.project)
    )

    result = Array.from(projects).map((project) =>
      currentData.find((entry) => entry.project === project)
    )
  } else {
    const filtered = currentData.filter(
      (entry) =>
        daysAgo(new Date(entry.datetime)) <= selectedLength &&
        category.includes(entry.category)
    )

    const labeled = filtered.map((entry) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCDate(),
    }))

    const groupedArr = toArray(groupBy(labeled, "project"))

    result = groupedArr.map((entry) => ({
      project: entry[0].project,
      label: entry[0].label,
      category: entry[0].category,
      ps: sumBy(entry, "ps") / entry.length,
    }))
  }

  let sorted = sortBy(result, "ps")
  sorted  = sorted.filter((i:any) => !(i.project.toLowerCase() === "futureswap"))
  // console.log(sorted.reverse())
  return sorted.reverse()
}

export const labelTotalTVLData = (
  data: TVLMetricsState,
  selectedLength: number,
  category: string
) => {
  const currentData = selectedLength <= 365 ? data.daily : data.monthly
  if (!currentData) return []

  let result

  if (selectedLength === 1) {
    let projects = new Set()
    currentData.forEach(
      (entry:any) =>
        category.includes(entry.category) && projects.add(entry.project)
    )

    result = Array.from(projects).map((project) =>
      currentData.find((entry:any) => entry.project === project)
    )
  } else {
    const filtered = currentData.filter(
      (entry:any) =>
        daysAgo(new Date(entry.datetime)) <= selectedLength &&
        category === entry.category
    )

    const labeled = filtered.map((entry:any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCDate(),
    }))

    const groupedArr = toArray(groupBy(labeled, "project"))

    result = groupedArr.map((entry) => ({
      project: entry[0].project,
      label: entry[0].label,
      category: entry[0].category,
      tvl: sumBy(entry, "tvl") / entry.length,
    }))
  }
  const sorted = sortBy(result, "tvl")

  return sorted.slice(-20)
}

export const labelTVLMetrics = (
  data: TVLMetricsState,
  selectedLength: number,
  category: string[]
) => {
  const isDaily = selectedLength <= 365
  let labeled = []

  const currentData = isDaily ? data.daily : data.monthly
  if (!currentData) return []

  const filtered = currentData.filter(
    (entry:any) =>
      category.includes(entry.category) &&
      daysAgo(new Date(entry.datetime)) <= selectedLength
  )

  if (isDaily) {
    labeled = filtered.map((entry:any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCDate(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCDate() +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  } else {
    labeled = filtered.map((entry:any) => ({
      ...entry,
      label:
        months[new Date(entry.datetime).getUTCMonth()].short +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
      tooltipLabel:
        months[new Date(entry.datetime).getUTCMonth()].full +
        " " +
        new Date(entry.datetime).getUTCFullYear(),
    }))
  }

  const groupedArr = toArray(groupBy(labeled, "label"))

  const result = groupedArr.map((daily) =>
    daily.map((entry) => {
      const value: number = (entry as any)["tvl"]

      return {
        label: entry.label,
        datetime: entry.datetime,
        tooltipLabel: entry.tooltipLabel,
        [entry.project]: value,
        category: entry.category,
      }
    })
  )

  const results = result.map((day) =>
    day.reduce(function (result, current) {
      return Object.assign(result, current)
    }, {})
  )

  // remove entries with null or zero value
  const final = results
    .map((day) => omitBy(day, (val) => isNil(val) || val === 0))
    .filter((day) => Object.keys(day).length > 4)

  return final.reverse()
}

export const allowedCumulativeMetrics = [
  "revenue",
  "revenue_supply_side",
  "revenueSupplySide",
  "revenue_protocol",
  "revenueProtocol",
  "gmv",
  "volume",
]

const toCumulative = (data: any, isExchange: boolean) => {
  const cumulativeResult: any = data
  const cumulative: any = {}
  cumulativeResult.forEach((entry: any, i: number) =>
    Object.keys(entry).forEach((key) => {
      switch (key) {
        case "label":
        case "datetime":
        case "tooltipLabel":
          return
        default:
          if (!isExchange && key === "gmv") return

          cumulative[key] = cumulative[key]
            ? cumulative[key] + entry[key]
            : entry[key] || 0
          cumulativeResult[i][key] = cumulative[key]
      }
    })
  )

  return cumulativeResult
}
