import React from "react"
import * as FeatherIcon from "react-feather"

import "./index.scss"

export function Input({
  type,
  value,
  required = false,
  placeholder,
  backgroundColor = "#fff",
  withShadow = false,
  leftIcon = null,
  rightIcon = null,
  iconBackground = null,
  sizeIcon = 24,
  onChange,
  onPressEnter,
  onFocus,
  handleClick,
}) {
  function handleKeyDown(target, key) {
    if (key === "Enter") {
      onPressEnter(target.value)
    }
  }

  function returnClassName() {
    let className = "wrapper-input"

    if (withShadow) className += " wrapper-input--shadow"

    return className
  }

  const CustomIcon = ({ sizeIcon, icon }) => {
    const Icon = FeatherIcon[icon]
    if (iconBackground) {
      return (
        <div
          className="wrapper-input__icon-container"
          style={{ backgroundColor: iconBackground }}
          onClick={handleClick}
        >
          <Icon size={sizeIcon} style={{ cursor: "pointer" }} />
        </div>
      )
    }
    return <Icon size={sizeIcon} />
  }

  return (
    <div style={{ backgroundColor }} className={returnClassName()}>
      {leftIcon && <CustomIcon sizeIcon={sizeIcon} icon={leftIcon} />}
      <input
        className="input"
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        style={{ backgroundColor }}
        onChange={({ target }) => onChange(target.value)}
        onFocus={onFocus}
        onKeyDown={
          onPressEnter
            ? ({ target, key }) => handleKeyDown(target, key)
            : undefined
        }
      />
      {rightIcon && <CustomIcon sizeIcon={sizeIcon} icon={rightIcon} />}
    </div>
  )
}
