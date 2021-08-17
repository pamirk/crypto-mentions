import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"
// import ArrowUp from "../../../utils/arrowUp.svg"
// import ArrowDown from "utils/arrowDown.svg"
import {
    ButtonBar,
    ChartContents,
    ChartInfo,
    ChartLengthSection,
    CumulativeToggle,
    Container,
    ExpandChartModal,
    Hide,
    Img,
    InfoString,
    NoDataDiv, PercentageToggle,
    RightAlignedButtons,
    Title,
    TitleWrapper,
    UpgradeModal,
    WhiteButton, ChartToggle,
} from "./ChartComponents"
import {scrollToTargetAdjusted} from "../../../helpers/scroll"
import {copyToClipboard} from "../../../helpers/copyToClipboard"
import {downloadCSVFromJson} from "../../../helpers/download/download"
import {OptionType} from "../../../types/Types"
import CustomButtonDropdown from "../button/custom/CustomButtonDropdown"
import {ProjectType} from "../../../types/ApiTypes"
import Tooltip from "../tooltip/Tooltip"
import {
    defaultButtonColor,
    defaultButtonTextColor,
    selectedButtonColor,
    selectedButtonTextColor,
} from "../../../context/theme"
import {useAuth} from "../../../context/AuthContext"
import {getLastUpdated, getPercent, keysToNotInclude} from "./ChartUtils"
import {useRouter} from 'next/router'
import {DownOutlined, UpOutlined} from "@ant-design/icons/lib";
import {useData} from "../../../context/DataContext";

// import {useParams} from "react-router-dom"

const LinkIcon = "utils/link.svg"
const DownloadIcon = "utils/download.svg"
const ExpandIcon = "utils/expand.svg"

interface RouteParams {
    section: string
}

export type ButtonType = {
    default?: string
    title: string
    name: string
    selected: boolean
    options?: OptionType[]
    disabled?: boolean
    projectId?: string
    tooltipId?: string
    callbackFn?: (value: string) => void
}

type Props = {
    title?: string
    tooltipId?: string
    chartData: any
    chartKeys: string[]
    children: React.ReactNode
    buttons?: ButtonType[]
    name?: string
    selectedLength: number
    max: boolean
    latest: boolean
    project?: ProjectType
    infoString: string
    url: string
    onSelectButton: (button: any) => void
    onChartLengthChange: (length: number) => void
    onSelectChartType?: (value: string) => void
    onSelectPercentageMode?: (value: boolean) => void

}
const ChartContainer = (props: Props) => {
    const {
        title,
        chartData,
        children,
        tooltipId,
        buttons,
        name,
        selectedLength,
        max,
        latest,
        project,
        infoString,
        chartKeys,
        url,
        onSelectButton,
        onChartLengthChange,
        onSelectChartType,
        onSelectPercentageMode,

    } = props

    const [isOpen, setIsOpen] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [copyText, setCopyText] = useState("Copy link")
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false)
    const [chartMode, setChartMode] = useState("historical")

    const [showAsPercentage, setShowAsPercentage] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    // const {section} = useParams<RouteParams>()
    const router = useRouter()
    // @ts-ignore
    // const section = router.query.section.toString()
    const section = ''

    const {user} = useAuth()
    const {isMobile} = useData()

    useEffect(() => {
        if (!!section && name?.includes(section) && containerRef.current) {
            scrollToTargetAdjusted(containerRef.current)
        }
    }, [name, section])

    const handleCopyLink = () => {
        copyToClipboard(url)
        setCopyText("Copied")
        setTimeout(() => setCopyText("Copy link"), 3000)
    }

    const handleDownload = () => {

        if (!user.paid) return setIsUpgradeModalVisible(true)
        let selectedKeys = [...chartKeys]
        if (Object.keys(chartData[0]).includes("datetime")) {
            selectedKeys = ["datetime", ...chartKeys]
        }
        const filteredChartData = chartData.map((entry: any) =>
            selectedKeys.reduce((obj: any, key) => {
                obj[key] = entry[key]
                return obj
            }, {})
        )

        if (showAsPercentage) {
            const asPercentage = filteredChartData.map((entry: any) => {
                const keys = Object.keys(entry).filter(
                    (key) => !keysToNotInclude.includes(key)
                )
                const total = keys.reduce(
                    (result, key: any) => (!!entry[key] ? result + entry[key] : result),
                    0
                )

                const formatted = keys.reduce(
                    (obj, key) => ({
                        ...obj,
                        [key]: getPercent(entry[key], total),
                    }),
                    {}
                )
                return {datetime: entry.datetime, ...formatted}
            })

            return downloadCSVFromJson(infoString, asPercentage, true)
        }

        downloadCSVFromJson(infoString, filteredChartData)
    }

    return (
        <Container ref={containerRef}>
            {title && (
                <TitleWrapper>
                    <Title>
                        <Tooltip id={tooltipId}>{title}</Tooltip>
                    </Title>
                    {/*window.location.pathname.includes("/terminal")*/}
                    <Hide onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? "Hide chart: " : "Show chart: "} {' '}
                        {isOpen ? <UpOutlined/> : <DownOutlined/>}
                    </Hide>
                </TitleWrapper>
            )}

            {isOpen && (
                <ChartContents hasArrowButtons={window.location.pathname === "/" && !isMobile}>
                    <div
                        style={{
                            display: "inline-flex",
                            flexWrap: "wrap",
                            width: "100%",
                            alignItems: "center",
                        }}
                    >
                        <ButtonBar>
                            {buttons &&
                            buttons.map((button) => (
                                    <Tooltip
                                        key={button.name}
                                        id={button.tooltipId}
                                        projectId={button.projectId || project?.project_id}
                                    >
                                        <Button
                                            key={button.name}
                                            disabled={button.disabled}
                                            isSelected={button.selected}
                                            onClick={() => onSelectButton(button.name)}
                                        >
                                            {button.title}
                                        </Button>
                                    </Tooltip>
                                )
                            )}
                        </ButtonBar>
                        <ChartLengthSection
                            max={max}
                            latest={latest}
                            selectedLength={selectedLength}
                            onChartLengthChange={onChartLengthChange}
                        />
                    </div>
                    <ChartInfo>
                        {infoString !== "" && <InfoString>{infoString}</InfoString>}
                        {/* LAST UPDATED FEATURE DISABLED FOR NOW */}
                        {chartData.length > 0 && (
                            <InfoString>{getLastUpdated(chartData)}</InfoString>
                        )}
                        <div>
                            {onSelectChartType && (
                                <CumulativeToggle
                                    chartMode={chartMode}
                                    onChange={(value) => {
                                        onSelectChartType(value)
                                        setChartMode(value)
                                    }}
                                />
                            )}
                            {onSelectPercentageMode && (
                                <ChartToggle
                                    label="Show as % share"
                                    onChange={(val: boolean) => {
                                        onSelectPercentageMode(val)
                                        setShowAsPercentage(val)
                                    }}
                                />
                            )}
                        </div>
                    </ChartInfo>
                    {buttons?.some((btn) => btn.selected) ? (
                        <>
                            {children}
                            {showModal && (
                                <ExpandChartModal
                                    project={project}
                                    infoString={infoString}
                                    closeModal={() => setShowModal(false)}
                                >
                                    {children}
                                </ExpandChartModal>

                            )}
                        </>
                    ) : (
                        <NoDataDiv>{"Select a metric to render a chart."}</NoDataDiv>
                    )}
                    <RightAlignedButtons>
                        {/* <WhiteButton
                            name="Expand"
                            icon={undefined}
                            tooltipId="chart-expand"
                            onClick={() => setShowModal(true)}
                        />*/}
                        {/*    <WhiteButton
                            name={copyText}
                            icon={null}
                            tooltipId="chart-copy-link"
                            onClick={handleCopyLink}
                        />*/}
                        <WhiteButton
                            name="Download"
                            tooltipId={"chart-download-allowed"}
                            icon={undefined}
                            onClick={handleDownload}
                        />
                    </RightAlignedButtons>
                </ChartContents>
            )}
            {/* {isUpgradeModalVisible && (
                <UpgradeModal onClose={() => setIsUpgradeModalVisible(false)}/>
            )}*/}
        </Container>
    )
}

ChartContainer.defaultProps = {
    onSelectButton: () => {
    },
    max: true,
    latest: false,
}

export default ChartContainer

const Button = styled.div<{ isSelected: boolean; disabled?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  height: 28px;
  padding: 8px;
  margin: 0px 4px 4px 0px;
  min-width: 80px;

  background: ${(props) =>
    props.isSelected ? selectedButtonColor : defaultButtonColor};
  color: ${(props) =>
    props.isSelected ? selectedButtonTextColor : defaultButtonTextColor};

  border: 1px solid ${defaultButtonTextColor};
  box-sizing: border-box;

  opacity: ${(props) => (props.disabled ? "0.5" : "1")};

  font-family: FKGrotesk-SemiMono;
  font-size: 11px;
  line-height: 100%;

  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "default")};

  &:hover {
    opacity: 0.7;
  }
`