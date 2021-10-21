import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { api } from '../services/api'

type User = {
  id: string
  name: string
  login: string
  avatar_url: string
}

type AuthContextData = {
  user: User | null
  signInUrl: string
  signOut: () => void
}

const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

type AuthResponse = {
  token: string
  user: {
    id: string
    avatar_url: string
    name: string
    login: string
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=63b2bd7687a5693b1151`

  async function signIn(githubCode: string) {
    const response = await api.post<AuthResponse>('authenticate', {
      code: githubCode
    })
    const { token, user } = response.data

    localStorage.setItem('@dowhile:token', token)
    api.defaults.headers.common.authorization = `Bearer ${token}`
    setUser(user)
  }

  async function signOut() {
    setUser(null)
    localStorage.removeItem('@dowhile:token')
  }

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token')

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`
      api.get<User>('profile').then(response => setUser(response.data))
    } else {
      const url = window.location.href
      const hasGithubCode = url.includes('?code=')
      if (hasGithubCode) {
        const [urlWithoutCode, githubCode] = url.split('?code=')

        window.history.pushState({}, '', urlWithoutCode)

        signIn(githubCode)
      }
    }
  }, [])
  return (
    <AuthContext.Provider value={{ user, signInUrl, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
