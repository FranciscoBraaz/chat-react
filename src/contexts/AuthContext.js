import { useState, useContext, createContext, useEffect, useRef } from "react"
import { useRefreshToken } from "../hooks/useRefreshToken"
import { api } from "../services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { refresh } = useRefreshToken()
  const firstRender = useRef(true)

  useEffect(() => {
    async function handleAutoLogin() {
      setIsLoading(true)
      try {
        const { data } = await refresh()
        if (data) {
          setAccessToken(data.accessToken)
          setIsAuthenticated(true)
          setUser(data.user)
        }
      } catch (error) {
        console.log("Error")
      } finally {
        setIsLoading(false)
      }
    }

    if (!firstRender.current) {
      handleAutoLogin()
    } else {
      firstRender.current = false
    }

    /* eslint-disable-next-line*/
  }, [])

  async function handleLogin(email, password) {
    let error = null
    let result = null

    try {
      const response = await api.post(
        "/login",
        { email, password },
        { withCredentials: true },
      )
      setUser(response.data.user)
      setAccessToken(response.data.accessToken)
      setIsAuthenticated(true)
      result = response
    } catch (err) {
      console.log(err.response)
      if (err?.response?.data?.message) {
        error = err?.response?.data?.message
      } else {
        error = "Erro no servidor"
      }

      console.log(err)
    }

    return { result, error }
  }

  async function handleLogout() {
    try {
      await api.get("/logout")
      setUser(null)
      setAccessToken(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        accessToken,
        isLoading,
        setAccessToken,
        setIsAuthenticated,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}
