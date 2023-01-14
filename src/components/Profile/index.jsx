import React from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Avatar } from "../Avatar"

import "./index.scss"

export function Profile() {
  const { user } = useAuth()
  return (
    <div className="profile">
      <Avatar
        size={50}
        userName={user.username}
        letter={user.username[0].toUpperCase()}
      />
      <div className="profile__info">
        <p className="profile__info__name">{user.name}</p>
        <p className="profile__info__username">{user.username}</p>
        <div className="profile__status">
          <div className="profile__indicator-status" />
          <span>Online</span>
        </div>
      </div>
    </div>
  )
}
