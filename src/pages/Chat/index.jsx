import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import socketIO from "socket.io-client"
import { AlignJustify } from "react-feather"

import { useRefreshToken } from "../../hooks/useRefreshToken"
import { useAuth } from "../../contexts/AuthContext"
import { messagesPredefine } from "../../utils/messagesPredefine"

import { Sidebar } from "../../components/Sidebar"
import { Input } from "../../components/Input"
import { Message } from "../../components/Message"
import { Avatar } from "../../components/Avatar"

import audioSrc from "../../assets/nothing.mp3"
import francisAvatar from "../../assets/francis.jpeg"
import nadineAvatar from "../../assets/nadine.jpeg"

import "./index.scss"

export function Chat() {
  const { refresh } = useRefreshToken()
  const { user, accessToken, setAccessToken, handleLogout } = useAuth()

  const [message, setMessage] = useState("")
  const [socket, setSocket] = useState(null)
  const [usersConnected, setUsersConnected] = useState([])
  const [messages, setMessages] = useState([])
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
  const [previousScrollHeight, setPreviousScrollHeight] = useState(0)
  const [messagesRendered, setMessagesRendered] = useState(0)
  const [isFinish, setIsFinish] = useState(false)
  const [loadingMyMessage, setLoadingMyMessage] = useState(false)
  const [loadingOtherMessage, setLoadingOtherMessage] = useState(false)

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
    const interval = setInterval(() => {
      setMessagesRendered((prev) => prev + 1)
    }, 2000)

    if (isFinish) {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setLoadingMyMessage(false)
    setLoadingOtherMessage(false)
    if (messagesRendered >= 1 && messagesRendered <= messagesPredefine.length) {
      setMessages((prevMessages) => [
        ...prevMessages,
        messagesPredefine[messagesRendered - 1],
      ])
      if (messagesRendered < messagesPredefine.length) {
        const nextMessageUser = messagesPredefine[messagesRendered].user
        if (nextMessageUser === user.username) {
          setLoadingMyMessage(true)
        } else {
          setLoadingOtherMessage(true)
        }
      }
    }

    if (messagesRendered > messagesPredefine.length) {
      setIsFinish(true)
    }
  }, [messagesRendered])

  useEffect(() => {
    const newSocket = socketIO.connect("http://localhost:2000", {
      reconnection: false,
      auth: {
        token: `Bearer ${accessToken}`,
      },
    })

    newSocket.on("connect_error", async (err) => {
      if (err.message === "Auth Error") {
        const { data } = await refresh()
        if (data) {
          setAccessToken(data.accessToken)
        }
      }
      console.log("Error", err.message)
    })
    setSocket(newSocket)

    /*
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "", content: "Conexão estabelecida", type: "system" },
    ])

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
    /*

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

  const usersConnectedFake1 = ["francisco"]
  const usersConnectedFake2 = ["nadine"]

  return (
    <div className="chat">
      <audio
        autoplay
        controls="controls"
        style={{ position: "absolute", right: 10, top: 5 }}
      >
        <source src={audioSrc} type="audio/mp3" />
      </audio>
      <Sidebar
        usersConnected={
          user.username === "nadine" ? usersConnectedFake1 : usersConnectedFake2
        }
        isOpen={sidebarIsOpen}
        handleLogout={handleLogout}
        handleClose={() => setSidebarIsOpen(false)}
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
        <div className="chat__messages__area" ref={chatAreaRef}>
          <div className="chat__messages__area__header">
            <p>Aqui foi onde tudo começou...</p>
            <div />
          </div>
          {messages.map((message, index) => (
            <Message
              key={index}
              userName={message.user}
              message={message.content}
              src={message.user === "nadine" ? nadineAvatar : francisAvatar}
              type={message.type ?? null}
              origin={defineMessageOrigin(message)}
            />
          ))}
          {loadingMyMessage && (
            <p className="my-message__loading">
              {user.username} está digitando...
            </p>
          )}
          {loadingOtherMessage && (
            <p className="other-message__loading">
              {user.username === "nadine" ? "francisco" : "nadine"} está
              digitando...
            </p>
          )}
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
        />
      </section>
    </div>
  )
}
