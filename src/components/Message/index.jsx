import React from "react"
import { Avatar } from "../Avatar"

import "./index.scss"

export function Message({ userName, message, type = "user" }) {
  return (
    <div className="message">
      {type === "user" ? (
        <>
          <Avatar letter={userName[0]} />
          <div className="message__info">
            <p className="message__info__user-name">{userName}</p>
            <p className="message__info__content">{message}</p>
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
