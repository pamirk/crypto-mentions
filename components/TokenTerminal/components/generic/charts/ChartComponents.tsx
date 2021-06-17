import {
    borderColor,
    defaultButtonColor,
    defaultButtonTextColor,
    textColor,
    titleWrapperColor,
} from "../../../context/theme"
import React, {useState} from "react"
import styled from "styled-components"
import {ProjectType} from "../../../types/ApiTypes"
import Button from "../button/Button"
import Modal from "../modal/Modal"
import {ModalButton} from "../modal/ModalComponents"
import {isMobile} from "../../../helpers/generic"
import Tooltip from "../tooltip/Tooltip"
import Toggle from "../../generic/toggle/Toggle"
import Link from "next/link";
// import LogoGray from "../../../utils/logo/logo-gray.svg"
// import LogoWhite from "../../../utils/logo/logo-white.svg"
// import {Redirect} from "react-router-dom"
export const LegendDiv = styled.div`
  text-align: center;
  margin-left: 16px;
  justify-content: center;
  padding-bottom: 4px;
  cursor: default;
  display: flex;
  flex-wrap: wrap;

  font-family: FKGrotesk-SemiMono;
  font-size: 11px;

  @media (max-width: 720px) {
    font-size: 9px;
  }
`

export const LegendText = styled.span`
  margin-right: 16px;
  margin-left: 8px;

  @media (max-width: 720px) {
    margin-right: 10px;
    margin-left: 4px;
  }
`

export const LegendContainer = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 4px 0px;
  cursor: pointer;
`

export const NoDataDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  height: 500px;
  align-items: center;

  @media (max-width: 720px) {
    height: 250px;
  }
`

export const RightAlignedButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-left: auto;
  margin-top: 8px;

  @media (max-width: 720px) {
    justify-content: center;
    margin-left: unset;
    justify-content: start;
  }
`
export const ChartLengthOption = styled.div<{ isSelected: boolean }>`
  font-family: FKGrotesk-SemiMono;
  font-style: normal;
  font-weight: bold;
  font-size: 11px;
  line-height: 24px;

  text-align: right;

  opacity: ${(props) => (props.isSelected ? 1 : 0.3)};
  margin-left: 19px;
  cursor: pointer;

  @media (max-width: 720px) {
    margin-right: 19px;
    margin-left: 0px;
  }
`
export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const Title = styled.span`
font-family: FKGrotesk-SemiMono,serif;
font-style: normal;
font-weight: normal;
font-size: 19px;
line-height: 100%;

display: flex;
align-items: center;


`

export const ButtonBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  @media (max-width: 720px) {
    padding-bottom: 8px;
  }
`

export const SelectedProjects = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const Selected = styled.div`
  display: flex;
  font-weight: 600;
  font-size: 10px;
  color: #00cf9d;
  margin-right: 8px;
  margin-bottom: 8px;
  min-width: 48px;
  padding: 0px 7px;
  text-align: center;
  cursor: pointer;
  line-height: 24px;
  background-color: transparent;
  border: 1px solid #00cf9d;
  justify-content: center;
`

export const Hide = styled.div`
  font-family: FKGrotesk-SemiMono;
  font-size: 14px;
  line-height: 100%;

  display: flex;
  align-items: center;
  text-align: right;

  opacity: 0.3;

  float: right;
  display: flex;
  cursor: pointer;
`

export const Img = styled.img`
  width: 9px;
  margin-left: 9px;
`

export const TitleWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 16px 32px;
  align-items: center;
  border: 1px solid ${borderColor};
  border-left: unset;

  background-color: ${titleWrapperColor};
  color: ${textColor};

  @media (max-width: 720px) {
    padding: 16px;
  }
`

export const WhiteButton = styled(Button)<{ disabled?: boolean }>`
  border: 1px solid;
  box-sizing: border-box;
  border-radius: 2px;
  line-height: 20px;
  padding: 0px 8px;
  font-size: 11px;
  height: unset;
  margin: 0px 8px 8px 0px;

  cursor: ${(props) => (props.disabled ? "no-drop" : "pointer")};

  color: ${defaultButtonTextColor};
  background: ${defaultButtonColor};

  opacity: 0.6;

  &:hover {
    opacity: 1;
  }

  &:last-of-type {
    margin: 0px;
    height: fit-content;
  }
`

export const ModalProject = styled.div`
  display: flex;
  align-items: center;
  margin: 16px;
`

export const ModalImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 30px;
`

export const ModalName = styled.div`
  font-size: 32px;
  font-weight: bold;
  margin-left: 8px;
`

export const ModalSymbol = styled.div`
  font-size: 24px;
  margin-left: 8px;
  margin-top: 2px;
`

export const InfoString = styled.div`
  font-size: 11px;
  margin: 4px 0px 8px;
  font-family: FKGrotesk-SemiMono;
`

export const ChartInfo = styled.div`
  display: flex;
  justify-content: space-between;
`
export const getGMVText = (tags: string) => {
    if (tags.includes("Lending")) {
        return "Borrowing vol."
    } else if (tags.includes("Exchange") || tags.includes("Prediction Market")) {
        return "Trading vol."
    } else if (tags.includes("Asset Management")) {
        return "Capital depl."
    }
    return "Transaction vol."
}

export const ChartContents = styled.div`
  padding: 16px px;
  @media (max-width: 720px) {
    padding: 16px;
  }
`

export const ChartWatermarkWhite = (
    <image
        href={"../../../utils/logo/logo-white.svg"}
        x={isMobile ? "35%" : "42%"}
        y={isMobile ? "42.5%" : "43.5%"}
        height={isMobile ? "15" : "40"}
        width={isMobile ? "100" : "260"}
    />
)
export const ChartWatermarkGray = (
    <image
        href={"../../../utils/logo/logo-gray.svg"}
        x={isMobile ? "35%" : "42%"}
        y={isMobile ? "42.5%" : "43.5%"}
        height={isMobile ? "15" : "40"}
        width={isMobile ? "100" : "260"}
    />
)

export const ExpandChartModal = (props: {
    project?: ProjectType
    infoString: string
    closeModal: () => void
    children: React.ReactNode
}) => {
    const {children, project, infoString, closeModal} = props

    return (
        <Modal show onClose={closeModal}>
            {project && (
                <ModalProject>
                    <ModalImg
                        src={"https://d2kyooqkgm9ipp.cloudfront.net/" + project.logo}
                        alt="Logo"
                    />
                    <ModalName>{project.name}</ModalName>
                    <ModalSymbol>{"(" + project.symbol + ")"}</ModalSymbol>
                </ModalProject>
            )}
            {infoString !== "" && (
                <InfoString style={{marginLeft: "20px"}}>{infoString}</InfoString>
            )}
            {children}
        </Modal>
    )
}

export const UpgradeModal = (props: { onClose: () => void }) => {
    const {onClose} = props
    const [redirect, setRedirect] = useState(false)

    if (redirect) {
        return <Link href="/signup"/>
    }

    return (
        <Modal show onClose={onClose} title="Upgrade to Token Terminal Pro">
            <UpgradeModalContents>
                <Text>
                    {"This feature is only available for Token Terminal Pro users."}{" "}
                </Text>
                <Text>
                    {
                        "After creating your account you can choose to upgrade to the pro version of Token Terminal."
                    }
                </Text>
                <ButtonRow>
                    <GrayButton
                        url="mailto:aleksis@tokenterminal.xyz"
                        name="Contact sales"
                    />
                    <ModalButton
                        onClick={() => setRedirect(true)}
                        name="Create account"
                    />
                </ButtonRow>
            </UpgradeModalContents>
        </Modal>
    )
}

const Text = styled.div`
  margin: 10px 0px;
`

const UpgradeModalContents = styled.div`
  margin: 10px 0px;
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`

const GrayButton = styled(ModalButton)`
  border-color: #858585;
  color: #858585;

  @media (max-width: 720px) {
    width: max-content;
  }
`

export const ChartLengthSection = ({
                                       latest,
                                       max,
                                       selectedLength,
                                       onChartLengthChange,
                                   }: {
    latest: boolean
    max: boolean
    selectedLength: number
    onChartLengthChange: (val: number) => void
}) => (
    <RightAlignedButtons>
        {latest && (
            <ChartLengthOption
                isSelected={selectedLength === 1}
                onClick={() => onChartLengthChange(1)}
            >
                <Tooltip id="chart-latest">{"LATEST"}</Tooltip>
            </ChartLengthOption>
        )}
        <ChartLengthOption
            isSelected={selectedLength === 7}
            onClick={() => onChartLengthChange(7)}
        >
            <Tooltip id="chart-7d">{"7D"}</Tooltip>
        </ChartLengthOption>
        <ChartLengthOption
            isSelected={selectedLength === 30}
            onClick={() => onChartLengthChange(30)}
        >
            <Tooltip id="chart-30d">{"30D"}</Tooltip>
        </ChartLengthOption>
        <ChartLengthOption
            isSelected={selectedLength === 90}
            onClick={() => onChartLengthChange(90)}
        >
            <Tooltip id="chart-90d">{"90D"}</Tooltip>
        </ChartLengthOption>
        <ChartLengthOption
            isSelected={selectedLength === 180}
            onClick={() => onChartLengthChange(180)}
        >
            <Tooltip id="chart-180d">{"180D"}</Tooltip>
        </ChartLengthOption>
        <ChartLengthOption
            isSelected={selectedLength === 365}
            onClick={() => onChartLengthChange(365)}
        >
            <Tooltip id="chart-max">{"365D"}</Tooltip>
        </ChartLengthOption>
        {max && (
            <ChartLengthOption
                isSelected={selectedLength === Number.MAX_SAFE_INTEGER}
                onClick={() => onChartLengthChange(Number.MAX_SAFE_INTEGER)}
            >
                <Tooltip id="chart-max">{"MAX"}</Tooltip>
            </ChartLengthOption>
        )}
    </RightAlignedButtons>
)

type ChartTypeToggleProps = {
    chartMode: string
    onChange: (val: string) => void
}
export const ChartTypeToggle = (props: ChartTypeToggleProps) => {
    const {chartMode, onChange} = props

    const handleChange = () => {
        const newMode = chartMode === "historical" ? "cumulative" : "historical"
        onChange(newMode)
    }
    return (
        <div
            style={{display: "inline-flex", alignItems: "center", textAlign: "end"}}
            title="Toggle chart type"
        >
      <span
          style={{
              marginRight: "10px",
              fontFamily: "FKGrotesk-SemiMono",
              fontSize: "12px",
          }}
      >
        {"Show as cumulative"}
      </span>
            <Toggle onClick={handleChange} checked={chartMode === "cumulative"}/>
        </div>
    )
}
