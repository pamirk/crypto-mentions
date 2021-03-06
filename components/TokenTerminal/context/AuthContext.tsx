import { fetchUserData, setApiToken } from "../api/ApiCalls"
import React, { useEffect, useState } from "react"
import { UserType } from "../types/Types"

type AuthContextType = {
  isLoggedIn: boolean
  user: UserType
  token?: string
  login: (token: string) => void
  logout: () => void
}

export const initialUserState = {
  username: undefined,
  email: undefined,
  id: undefined,
  createdAt: undefined,
  paid: false,
  subscription: {},
  subscriptionType: "trial",
  trial: {},
}

export const AuthContext = React.createContext<AuthContextType>({
  isLoggedIn: false,
  user: initialUserState,
  token: undefined,
  login: (token: string) => {},
  logout: () => {},
})

export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }: any) => {
  const [token, setToken] = useState<string | undefined>(undefined)
  const [user, setUser] = useState<UserType>(initialUserState)

  const login = (token: string) => {
    setToken(token)
    setApiToken(token)
    localStorage.setItem(
      "userData",
      JSON.stringify({
        token,
      })
    )
  }

  useEffect(() => {
    if (token) {
      fetchUserData().then((data) => setUser(data.user))
    }
  }, [token])

  const logout = () => {
    setToken(undefined)
    setApiToken(undefined)
    setUser(initialUserState)
    localStorage.removeItem("userData")
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
