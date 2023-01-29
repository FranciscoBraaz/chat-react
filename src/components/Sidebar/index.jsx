import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Power, X } from "react-feather"
import { useAuth } from "../../contexts/AuthContext"
import { Avatar } from "../Avatar"
import { Badge } from "../Badge"
import { Input } from "../Input"
import { Profile } from "../Profile"

import "./index.scss"

export function Sidebar({
  usersConnected,
  isOpen = true,
  handleLogout,
  handleClose,
  handleSearch,
}) {
  const { user } = useAuth()
  const [keyword, setKeyword] = useState("")

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(keyword)
    }, 300)

    return () => {
      clearTimeout(timeout)
    }

    /* eslint-disable-next-line */
  }, [keyword])

  function returnClassName() {
    let className = "chat__sidebar"

    if (isOpen) className += " chat__sidebar--open fade-in"
    else className += " fade-out"

    return className
  }

  return (
    <section className={returnClassName()}>
      <header className="chat__sidebar__header">
        <button onClick={handleClose}>
          <X />
        </button>
        <Profile />
        <div className="chat__users__separator" />
      </header>
      <Input
        placeholder="Pesquisar usuários"
        backgroundColor="#f9fbfc"
        leftIcon="Search"
        onChange={(value) => setKeyword(value)}
      />
      <div className="chat__users">
        <div className="chat__users__title">
          <h4>Usuários online</h4>
          {usersConnected.length === 0 ? (
            <Badge count={0} />
          ) : (
            <Badge count={usersConnected.length - 1} />
          )}
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
