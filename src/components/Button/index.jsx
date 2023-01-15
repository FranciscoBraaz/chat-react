import React from "react"
import SyncLoader from "react-spinners/SyncLoader"

import "./index.scss"

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#ff",
}

export function Button({
  type,
  text,
  width = "100%",
  isLoading = false,
  onClick,
}) {
  function returnClasseName() {
    let className = "button"

    if (isLoading) className += " button--disabled"

    return className
  }

  return (
    <button
      className={returnClasseName()}
      type={type}
      onClick={onClick}
      style={{ width }}
    >
      {isLoading ? (
        <SyncLoader
          color="#fff"
          loading={isLoading}
          cssOverride={override}
          size={8}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      ) : (
        text
      )}
    </button>
  )
}
