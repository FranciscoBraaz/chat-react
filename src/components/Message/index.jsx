import React from "react"
import { Avatar } from "../Avatar"

import "./index.scss"

export function Message({ userName, message, type = "user", origin }) {
  function returnMessageClassName() {
    let className = "message"

    if (origin === "self") className += " message--self"
    if (origin === "other") className += " message--other"

    return className
  }

  function returnMessageContainerClassName() {
    let className = "message__container"

    if (origin === "self") className += " message__container--self"
    if (origin === "other") className += " message__container--other"

    return className
  }

  return (
    <div className={returnMessageClassName()}>
      {type === "user" ? (
        <>
          <Avatar userName={userName} letter={userName[0].toUpperCase()} />
          <div className={returnMessageContainerClassName()}>
            <div className="message__info">
              <p className="message__info__user-name">{userName}</p>
              <p className="message__info__content">{message}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="message__system">
          <span>{userName}</span> <span> {message}</span>
        </p>
      )}
    </div>
  )
}
