import React, { useEffect, useRef, useState } from "react"
import socketIO from "socket.io-client"
import { AlignJustify } from "react-feather"

import { useRefreshToken } from "../../hooks/useRefreshToken"
import { useAuth } from "../../contexts/AuthContext"

import { Sidebar } from "../../components/Sidebar"
import { Input } from "../../components/Input"
import { Message } from "../../components/Message"
import { Avatar } from "../../components/Avatar"

import "./index.scss"

export function Chat() {
  const { refresh } = useRefreshToken()
  const {
    user,
    accessToken,
    setAccessToken,
    setUser,
    setIsAuthenticated,
    handleLogout,
  } = useAuth()

  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [usersConnected, setUsersConnected] = useState([])
  const [messages, setMessages] = useState([])
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0)
  const [connectionLost, setConnectionLost] = useState(false)
  const [usersSearched, setUsersSearched] = useState([])
  const [searchIsEmpty, setSearchIsEmpty] = useState(true)

  const chatAreaRef = useRef()

  useEffect(() => {
    if (chatAreaRef.current) {
      const chatArea = chatAreaRef.current
      const scrollHeight = chatArea.scrollHeight
      const chatAreaHeight = chatArea.getBoundingClientRect().height

      if (previousScrollHeight - chatAreaHeight === chatArea.scrollTop) {
        chatArea.scrollTop = scrollHeight
      }
      setPreviousScrollHeight(scrollHeight)
    }

    /* eslint-disable-next-line */
  }, [messages])

  useEffect(() => {
    const newSocket = socketIO.connect("http://localhost:2000", {
      reconnectionAttempts: 10,
      auth: {
        token: `Bearer ${accessToken}`,
      },
    })

    newSocket.on("connect_error", async (err) => {
      if (err.message === "Auth Error") {
        const { data } = await refresh()
        if (data) {
          setAccessToken(data.accessToken)
        } else {
          setAccessToken("")
          setUser(null)
          setIsAuthenticated(false)
        }
      }
    })

    newSocket.on("disconnect", () => {
      setConnectionLost(true)
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "", content: "Você foi desconectado", type: "system" },
      ])
    })

    newSocket.on("user-list", (userList) => {
      if (userList?.length > 0) {
        setUsersConnected(userList)
      }
    })

    newSocket.on("list-update", (data) => {
      if (data?.userList?.length > 0) {
        setUsersConnected(data.userList)
      }

      if (data?.joined) {
        const newMessage = `entrou no chat`
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: data.joined, content: newMessage, type: "system" },
        ])
      }

      if (data?.left) {
        const newMessage = `saiu do chat`
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: data.left, content: newMessage, type: "system" },
        ])
      }
    })

    newSocket.on("show-message", (msg) => {
      if (msg.user !== user.username) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...msg, type: "user" },
        ])
      }
    })

    newSocket.on("connect", () => {
      setConnectionLost(false)
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: "", content: "Conexão estabelecida", type: "system" },
      ])
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
      setMessages([])
    }

    /* eslint-disable-next-line*/
  }, [])

  function handleSendMessage() {
    const content = message.trim()
    if (content) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: user.username, content: content, type: "user" },
      ])
      socket.emit("send-message", content)
      setMessage("")
    }
  }

  function handleSearch(keyword) {
    if (!keyword) {
      setUsersSearched([])
      setSearchIsEmpty(true)
      return
    }

    const searchedUsers = usersConnected.filter((userConnected) =>
      userConnected.includes(keyword),
    )

    setUsersSearched(searchedUsers)
    setSearchIsEmpty(false)
  }

  function defineMessageOrigin(message) {
    let origin = ""

    if (message.type === "system") return

    if (message.user === user.username) {
      origin = "self"
    } else {
      origin = "other"
    }

    return origin
  }

  return (
    <div className="chat">
      <Sidebar
        usersConnected={searchIsEmpty ? usersConnected : usersSearched}
        isOpen={sidebarIsOpen}
        handleLogout={handleLogout}
        handleClose={() => setSidebarIsOpen(false)}
        handleSearch={handleSearch}
      />
      <header className="chat__header">
        <button onClick={() => setSidebarIsOpen(true)}>
          <AlignJustify size={28} />
        </button>
        <Avatar
          userName={user.username}
          letter={user.username[0].toUpperCase()}
        />
      </header>
      <section className="chat__messages">
        <div className="chat__messages__area__header">
          <p>Divirta-se conversando com seus amigos</p>
          <div />
        </div>
        <div className="chat__messages__area" ref={chatAreaRef}>
          {messages.map((message, index) => (
            <Message
              key={index}
              userName={message.user}
              message={message.content}
              type={message.type ?? null}
              origin={defineMessageOrigin(message)}
            />
          ))}
        </div>
        <Input
          type="text"
          value={message}
          placeholder="Digite sua mensagem"
          withShadow
          onChange={(value) => setMessage(value)}
          onPressEnter={handleSendMessage}
          handleClick={handleSendMessage}
          rightIcon="Send"
          iconBackground="#157cff"
          sizeIcon={18}
          disabled={connectionLost}
        />
      </section>
    </div>
  )
}
