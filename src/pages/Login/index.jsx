import React, { useState } from "react"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"

import "./index.scss"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="login">
      <form className="login__form">
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
