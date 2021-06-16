import React, {useEffect, useState} from "react"
import {ProjectsType, PSMetricsState, PSMetricsType,} from "../../types/ApiTypes"
import styled from "styled-components"
import {fetchPSMetrics} from "../../api/ApiCalls"
import {NoDataDiv} from "../../components/generic/charts/ChartComponents"
import TotalPS from "./TotalPS";
import {LoadingOutlined} from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;


const PS = (props: { projects: ProjectsType }) => {
    const [metrics, setMetrics] = useState<PSMetricsState>({
        daily: undefined,
        monthly: undefined,
    })

    const updateMetrics = (interval: string, data: PSMetricsType) => {
        setMetrics({...metrics, [interval]: data})
    }

    useEffect(() => {
        let isCanceled = false
        // window.scrollTo(0, 0)
        fetchPSMetrics("daily").then(
            (data) => !isCanceled && updateMetrics("daily", data)
        )
        return () => {
            isCanceled = true
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <Container>
            {!metrics.daily && <NoDataDiv>Loading Data, please wait</NoDataDiv>}
            {metrics.daily && (
                <>
                    <TotalPS data={metrics} updateMetrics={updateMetrics}/>
                </>
            )}
        </Container>
    )
}

export default PS

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 120px;
  padding: 5rem 0 0;


`

