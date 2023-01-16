import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/Button"
import { Input } from "../../components/Input"
import { useAuth } from "../../contexts/AuthContext"
import { ReactComponent as Text } from "../../assets/text.svg"

import "./index.scss"

export function Login() {
  const { isLoading: isLoadingUser, handleLogin } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorSubmit, setErrorSubmit] = useState("")
  const navigate = useNavigate()

  async function handleOnLogin(event) {
    event.preventDefault()
    setIsLoading(true)
    const { error } = await handleLogin(email, password)
    setErrorSubmit(error)
    setIsLoading(false)
    if (!error) {
      navigate("/chat")
    }
  }

  return (
    <div className="login">
      <div className="login__form-container">
        <form className="login__form" onSubmit={handleOnLogin}>
          <h1>Login</h1>
          <div>
            <Input
              type="email"
              value={email}
              required
              placeholder="E-mail"
              onChange={(value) => setEmail(value)}
              onFocus={() => setErrorSubmit("")}
            />
            <Input
              type="password"
              value={password}
              required
              placeholder="Senha"
              onChange={(value) => setPassword(value)}
              onFocus={() => setErrorSubmit("")}
            />
            {errorSubmit && <p>{errorSubmit}</p>}
            <Button
              type="submit"
              text="Entrar"
              isLoading={isLoading || isLoadingUser}
            />
            {!isLoadingUser && (
              <button
                type="button"
                className="login__link"
                onClick={() => navigate("/register")}
              >
                Ainda não tem conta? Cadastre-se
              </button>
            )}
          </div>
        </form>
        <div className="login-image">
          <Text />
        </div>
      </div>
    </div>
  )
}
