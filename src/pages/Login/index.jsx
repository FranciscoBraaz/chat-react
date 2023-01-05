import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { useAuth } from "../../contexts/AuthContext"

import "./index.scss"

export function Login() {
  const { handleLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleOnLogin(event) {
    event.preventDefault()
    const { error } = await handleLogin(email, password)
    if (!error) {
      navigate("/chat")
    }
  }

  return (
    <div className="login">
      <form className="login__form" onSubmit={handleOnLogin}>
        <Input
          type="email"
          value={email}
          required
          placeholder="E-mail"
          onChange={(value) => setEmail(value)}
        />
        <Input
          type="password"
          value={password}
          required
          placeholder="Senha"
          onChange={(value) => setPassword(value)}
        />
        <Button type="submit" text="Entrar" />
      </form>
    </div>
  )
}
