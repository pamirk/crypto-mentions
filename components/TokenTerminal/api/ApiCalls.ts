import {
  AuthType,
  BulkMetrics,
  MarketMetricsType,
  MarketsType,
  ProjectMetricsType,
  ProjectsType,
  ProjectTop10Metrics,
  PSInfoType,
  PSMetricsType,
  RevenueInfoType,
  RevenueMetricsType,
  RevenueProtocolInfoType,
  TVLInfoType,
  TVLMetricsType,
  UserDataType,
} from "../types/ApiTypes"

export const defaultApiToken = "c0e5035a-64f6-4d2c-b5f6-ac1d1cb3da2f"
export const setApiToken = (token: string | undefined) => (apiToken = token)

let apiToken: string | undefined = undefined
let d = new Date();
// let seconds = Math.floor(d.getTime() / 1000);
//1623060669 1623773241 1623938133
//1623912926 1624037083 1624267053 1624626356 1624957850 1625224820 1626048500 1626796790 1629106110 1629231065 1629389640 1630046285 1630880610 1631191925 1632415965 1633943000 1635700002 1638919260
const dataHash = 1638919260
const postFix = `data_hash=${dataHash}`
const prefix = "https://api.tokenterminal.com"

const isDataApi = (path: string): boolean => {
  return (
    path.startsWith(`/v1/projects`) ||
    path.startsWith(`/v1/metrics`) ||
    path.startsWith(`/v1/markets`)
  )
}

async function apiGet<T>(path: string): Promise<T> {
  const token = isDataApi(path) ? apiToken || defaultApiToken : apiToken

  const response = await fetch(prefix + path, {
    method: "get",
    headers: {
      Authorization: "Bearer " + token,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

async function apiPatch<T>(path: string, body: any): Promise<T> {
  const token = isDataApi(path) ? apiToken || defaultApiToken : apiToken
  const response = await fetch(prefix + path, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

async function apiPost<T>(path: string, body: any): Promise<T> {
  const token = isDataApi(path) ? apiToken || defaultApiToken : apiToken

  let headers: {
    Accept: string
    Authorization?: string
    "Content-Type": string
  } = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  }

  // @ts-ignore
  const response = await fetch(prefix + path, {
    method: "post",
    headers,
    body: JSON.stringify(body),
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

const getDateXDaysAgo = (x: number) => {
  const d = new Date()
  d.setDate(d.getDate() - x)
  return d.toISOString().split("T")[0]
}

export const fetchProjects = () =>
  apiGet<ProjectsType>(`/v1/projects?${postFix}`)

export const fetchDailyProjectMetrics = (project: string) =>
  apiGet<ProjectMetricsType>(
    `/v1/projects/${project}/metrics?interval=daily&business_granularity=total&data_granularity=project&since=${getDateXDaysAgo(
      365
    )}&${postFix}`
  )

export const fetchMonthlyProjectMetrics = (project: string) =>
  apiGet<ProjectMetricsType>(
    `/v1/projects/${project}/metrics?interval=monthly&business_granularity=total&data_granularity=project&${postFix}`
  )

export const fetchDailyProjectTop10 = (project: string) =>
  apiGet<ProjectTop10Metrics>(
    `/v1/projects/${project}/metrics?interval=daily&business_granularity=total&data_granularity=top10&since=${getDateXDaysAgo(
      365
    )}&${postFix}`
  )
export const fetchMonthlyProjectTop10 = (project: string) =>
  apiGet<ProjectTop10Metrics>(
    `/v1/projects/${project}/metrics?interval=monthly&business_granularity=total&data_granularity=top10&${postFix}`
  )

export const fetchDailyBulkMetrics = (projects: string[]) =>
  apiGet<BulkMetrics>(
    `/v1/projects/bulk/metrics?interval=daily&business_granularity=total&data_granularity=project&projects=[${projects.toString()}]&since=${getDateXDaysAgo(
      365
    )}&${postFix}`
  )

export const fetchMonthlyBulkMetrics = (projects: string[]) =>
  apiGet<BulkMetrics>(
    `/v1/projects/bulk/metrics?interval=monthly&business_granularity=total&data_granularity=project&projects=[${projects.toString()}]&${postFix}`
  )

export const fetchRevenueInfo = () =>
  apiGet<RevenueInfoType>(`/v1/metrics/revenue?${postFix}`)

export const fetchRevenueMetrics = (interval: string) =>
  apiGet<RevenueMetricsType>(
    `/v1/metrics/revenue/projects?interval=${interval}&project_granularity=all&since=${getDateXDaysAgo(
      365
    )}&${postFix}`
  )

export const fetchPSInfo = () => apiGet<PSInfoType>(`/v1/metrics/ps?${postFix}`)

export const fetchPSMetrics = (interval: string) =>
  apiGet<PSMetricsType>(
    `/v1/metrics/ps/projects?interval=${interval}&project_granularity=all&since=${getDateXDaysAgo(
      365
    )}&${postFix}`
  )

export const fetchMarkets = () => apiGet<MarketsType>(`/v1/markets?${postFix}`)

export const fetchMarketMetrics = (marketId: string, interval: string) =>
  apiGet<MarketMetricsType>(
    `/v1/markets/${marketId}/metrics?interval=${interval}&project_granularity=all&${postFix}`
  )

export const fetchProtocolRevenueInfo = () =>
  apiGet<RevenueProtocolInfoType>(`/v1/metrics/revenue_protocol?${postFix}`)

export const fetchProtocolRevenueMetrics = (interval: string) =>
  apiGet<RevenueMetricsType>(
    `/v1/metrics/revenue_protocol/projects?interval=${interval}&project_granularity=all&since=${getDateXDaysAgo(
      365
    )}&${postFix}`
  )

export const loginPost = (email: string, password: string) =>
  apiPost<AuthType>(`/v1/login?${postFix}`, {
    email,
    password,
  })

export const signup = (username: string, email: string, password: string) =>
  apiPost<AuthType>(`/v1/users?${postFix}`, {
    username,
    email,
    password,
  })

export const fetchUserData = () =>
  apiGet<UserDataType>(`/v1/users/me?${postFix}`)

export const logoutGet = () => apiGet<null>(`/v1/logout?${postFix}`)

export const changePassword = (oldPassword: string, newPassword: string) =>
  apiPatch<null>(`/v1/users/password/change?${postFix}`, {
    oldPassword,
    newPassword,
  })

export const resetPassword = (
  data: { email: string } | { password: string } | { token: string }
) => apiPost<null>(`/v1/users/password/reset?${postFix}`, data)

export const buyNow = (priceId: string) =>
  apiPost<any>(`/v1/checkout?${postFix}`, { priceId })

export const postUnsubscribe = (userId?: string | undefined) =>
  apiPost<any>(`/v1/users/${userId}/subscription/cancel?${postFix}`, {})

export const fetchTVLInfo = () =>
  apiGet<TVLInfoType>(`/v1/metrics/tvl?${postFix}`)

export const fetchTVLMetrics = (interval: string) =>
  apiGet<TVLMetricsType>(
    `/v1/metrics/tvl/projects?interval=${interval}&project_granularity=all&since=${getDateXDaysAgo(
      365
    )}&${postFix}`
  )
