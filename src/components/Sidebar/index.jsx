import React from "react"
import { Power } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { Avatar } from "../Avatar"
import { Badge } from "../Badge"
import { Input } from "../Input"
import { Profile } from "../Profile"

import "./index.scss"

export function Sidebar({ usersConnected, handleLogout }) {
  const { user } = useAuth()

  return (
    <section className="chat__sidebar">
      <header className="chat__sidebar__header">
        <Profile />
        <div className="chat__users__separator" />
      </header>
      <Input
        placeholder="Pesquisar usuários"
        backgroundColor="#f9fbfc"
        leftIcon="Search"
      />
      <div className="chat__users">
        <div className="chat__users__title">
          <h4>Usuários online</h4>
          <Badge count={usersConnected.length - 1} />
        </div>
        {usersConnected.map((userConnected) => {
          if (userConnected === user.username) return null

          return (
            <div key={userConnected} className="chat__users__user">
              <Avatar
                userName={userConnected}
                letter={userConnected[0].toUpperCase()}
              />
              <span>{userConnected}</span>
            </div>
          )
        })}
      </div>
      <footer className="chat__sidebar__footer">
        <div className="chat__users__separator" />
        <button className="chat__users__logout" onClick={handleLogout}>
          <Power />
          <span>Logout</span>
        </button>
      </footer>
    </section>
  )
}
