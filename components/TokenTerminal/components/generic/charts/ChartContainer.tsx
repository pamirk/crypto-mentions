import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"
// import ArrowUp from "../../../utils/arrowUp.svg"
// import ArrowDown from "utils/arrowDown.svg"
import {
    ButtonBar,
    ChartContents,
    ChartInfo,
    ChartLengthSection,
    ChartTypeToggle,
    Container,
    ExpandChartModal,
    Hide,
    Img,
    InfoString,
    NoDataDiv,
    RightAlignedButtons,
    Title,
    TitleWrapper,
    UpgradeModal,
    WhiteButton,
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
import {getLastUpdated} from "./ChartUtils"
import { useRouter } from 'next/router'

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
    } = props

    const [isOpen, setIsOpen] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [copyText, setCopyText] = useState("Copy link")
    const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false)
    const [chartMode, setChartMode] = useState("historical")

    const containerRef = useRef<HTMLDivElement>(null)
    // const {section} = useParams<RouteParams>()
    const router = useRouter()
    // @ts-ignore
    // const section = router.query.section.toString()
    const section = ''

    const {user} = useAuth()
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
        // if (!user.paid) return setIsUpgradeModalVisible(true)
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

        downloadCSVFromJson(infoString, filteredChartData)
    }

    return (
        <Container ref={containerRef}>
            {title && (
                <TitleWrapper>
                    <Title>
                        <Tooltip id={tooltipId}>{title}</Tooltip>
                    </Title>

                    {window.location.pathname.includes("/terminal") && (
                        <Hide onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? "Hide chart" : "Show chart"}
                            <Img src={isOpen ? "../../../utils/arrowUp.svg" : "utils/arrowDown.svg"}
                                 alt="Toggle visibility"/>
                        </Hide>
                    )}
                </TitleWrapper>
            )}

            {isOpen && (
                <ChartContents>
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
                            buttons.map((button) =>
                                button.options ? (
                                    <CustomButtonDropdown
                                        key={button.name}
                                        placeholder={button.title}
                                        isSelected={button.selected}
                                        disabled={button.disabled}
                                        onClick={() => onSelectButton(button.name)}
                                        onOptionSelect={button.callbackFn}
                                        options={button.options}
                                        tooltipId={button.tooltipId}
                                        projectId={button.projectId || project?.project_id}
                                    />
                                ) : (
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
                        {true && chartData.length > 0 && (
                            <InfoString>{getLastUpdated(chartData)}</InfoString>
                        )}
                        {onSelectChartType && (
                            <ChartTypeToggle
                                chartMode={chartMode}
                                onChange={(value) => {
                                    onSelectChartType(value)
                                    setChartMode(value)
                                }}
                            />
                        )}
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
                        <WhiteButton
                            name="Expand"
                            icon={undefined}
                            tooltipId="chart-expand"
                            onClick={() => setShowModal(true)}
                        />
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
            {isUpgradeModalVisible && (
                <UpgradeModal onClose={() => setIsUpgradeModalVisible(false)}/>
            )}
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
  min-width: 120px;
  margin: 0px 8px 8px 0px;

  background: ${(props) =>
    props.isSelected ? selectedButtonColor : defaultButtonColor};
  color: ${(props) =>
    props.isSelected ? selectedButtonTextColor : defaultButtonTextColor};

  border: 1px solid;
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