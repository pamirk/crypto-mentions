import useOnClickOutside from "../../../../helpers/hooks/useOnClickOutside"
import React, {useEffect, useRef, useState} from "react"
import styled from "styled-components"
import Checkmark from "../../../generic/icons/Checkmark"
import Tooltip from "../../../generic/tooltip/Tooltip"
import {
    defaultButtonColor,
    defaultButtonTextColor,
    selectedButtonColor,
    selectedButtonTextColor,
} from "../../../../context/theme"
import {useTheme} from "../../../../context/ThemeContext"

const ArrowUp = "../../../../utils/arrowUp.svg"
const WhiteArrowDown = "../../../../utils/arrowDownWhite.svg"
const ArrowDown = "../../../../utils/arrowDown.svg"
const WhiteArrowUp = "../../../../utils/arrowUpWhite.svg"

type Props = {
    onOptionSelect?: (option: string) => void
    onClick?: () => void
    options: OptionType[]
    disabled?: boolean
    placeholder?: string
    isSelected: boolean
    tooltipId?: string
    projectId?: string
}

type OptionType = { name: string; label: string; disabled?: boolean }

const CustomButtonDropdown = (props: Props) => {
    const {
        onOptionSelect,
        onClick,
        options,
        placeholder,
        disabled,
        isSelected,
        tooltipId,
        projectId,
    } = props
    const {mode} = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)
    const [selected, setSelected] = useState(options[0].name)

    useEffect(() => {
        const enabledIndex = options.findIndex((val) => !val.disabled)

        if (enabledIndex >= 0) {
            setSelected(options[enabledIndex].name)
        }
    }, [options])

    const handleOptionClick = (option: OptionType) => {
        onOptionSelect && onOptionSelect(option.name)
        setSelected(option.name)
        setIsOpen(false)
    }

    const handleClickOutside = () => setIsOpen(false)

    useOnClickOutside(ref, handleClickOutside)

    const getArrow = () => {
        if (mode === "light") {
            return isOpen
                ? isSelected
                    ? WhiteArrowUp
                    : ArrowUp
                : isSelected
                    ? WhiteArrowDown
                    : ArrowDown
        }

        return isOpen
            ? isSelected
                ? ArrowUp
                : WhiteArrowDown
            : isSelected
                ? ArrowDown
                : WhiteArrowDown
    }

    return (
        <Tooltip id={tooltipId} projectId={projectId}>
            <Container
                onClick={() => !onClick && (disabled ? {} : setIsOpen(!isOpen))}
                disabled={disabled}
                isSelected={isSelected}
                isOpen={isOpen}
            >
                <div ref={ref}>
                    <Selected>
                        <div onClick={onClick}>{placeholder || "Select.."}</div>
                        <Arrow
                            onClick={() => (disabled ? {} : setIsOpen(!isOpen))}
                            src={getArrow()}
                            alt="Toggle visibility"
                        />
                    </Selected>
                    {isOpen && (
                        <OptionsList isSelected={isSelected}>
                            {options.map((option) => (
                                <Option
                                    disabled={option.disabled}
                                    key={option.label}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.label}
                                    {option.name === selected && <Checkmark/>}
                                </Option>
                            ))}
                        </OptionsList>
                    )}
                </div>
            </Container>
        </Tooltip>
    )
}

export default CustomButtonDropdown

const Selected = styled.div`
  display: flex;
  justify-content: space-around;
  cursor: pointer;
  height: 12px;
  &:hover {
    opacity: 0.8;
  }
`
const Arrow = styled.img`
  margin: 0px 4px;
  width: 12px;
  margin-left: 8px;
`

const Container = styled.div<{
    disabled?: boolean
    isSelected: boolean
    isOpen: boolean
}>`
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  display: block;
  height: 28px;
  padding: 8px;
  width: 120px;

  pointer-events: ${(props) => (props.disabled ? "none" : "")};
  background: ${(props) =>
    props.isSelected ? selectedButtonColor : defaultButtonColor};

  border: 1px solid;
  box-sizing: border-box;

  font-family: FKGrotesk-SemiMono;
  font-size: 11px;
  line-height: 100%;

  cursor: ${(props) => (props.disabled ? "default" : "pointer")};

  color: ${(props) =>
    props.isSelected ? selectedButtonTextColor : defaultButtonTextColor};

  margin: 0px 8px 8px 0px;
`

const OptionsList = styled.div<{ isSelected: boolean }>`
  display: flex;
  width: 118px;
  flex-direction: column;

  font-family: FKGrotesk-SemiMono;

  position: absolute;
  background: ${(props) =>
    props.isSelected ? selectedButtonColor : defaultButtonColor};
  color: ${(props) =>
    props.isSelected ? selectedButtonTextColor : defaultButtonTextColor};

  margin-top: 6px;
  margin-left: -9px;

  border: 1px solid;

  border-top: unset;
  z-index: 100;
  max-height: 240px;
  overflow: auto;
`

const Option = styled.div<{ disabled?: boolean; selected?: boolean }>`
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "default")};
  cursor: pointer;
  padding: 4px 8px;
  align-items: center;
  display: inline-flex;
  justify-content: space-between;

  &:hover {
    background-color: #cecece;
  }
`
