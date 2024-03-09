import type { FirebaseAuthTypes } from "@react-native-firebase/auth"
import auth from "@react-native-firebase/auth"
import { router } from "expo-router"
import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { UserRole } from "@/utils/constants"
import { SUPPORTED_USER_ROLES } from "@/utils/constants"

const userRoleRedirectPaths = {
  ADMIN: "/admin/dashboard",
  WAREHOUSE: "/warehouse/dashboard",
  OVERSEAS_AGENT: "/overseas/dashboard",
  DOMESTIC_AGENT: "/domestic/dashboard",
  DRIVER: "/driver/dashboard",
} as const

export function getUserRoleRedirectPath(role: UserRole | null) {
  if (role === null) return "/something-went-wrong"

  return userRoleRedirectPaths[role]
}

type TAuthContext = {
  reload: () => Promise<void>
} & (
  | {
      // Initial state
      isLoading: true
      user: null
      role: null
    }
  // Unauthenticated state
  | {
      isLoading: false
      user: null
      role: null
    }
  // Authenticated state
  | {
      isLoading: false
      user: FirebaseAuthTypes.User
      role: UserRole | null
    }
)

const AuthContext = createContext<TAuthContext>({
  isLoading: true,
  user: null,
  role: null,
  reload: Promise.resolve,
})

export function AuthProvider(props: { children: ReactNode; [x: string]: any }) {
  const [session, setSession] = useState<TAuthContext>({
    isLoading: true,
    user: null,
    role: null,
    reload: Promise.resolve,
  })

  async function reload() {
    const { currentUser } = auth()
    await currentUser?.reload()

    setSession((currSession) => ({
      ...currSession,
    }))
  }

  useEffect(() => {
    return auth().onAuthStateChanged(async (user) => {
      if (user === null) {
        setSession({
          isLoading: false,
          user: null,
          role: null,
          reload,
        })
        return
      }

      try {
        const idTokenResult = await user.getIdTokenResult()
        setSession({
          isLoading: false,
          user,
          role: (idTokenResult.claims.role as UserRole) ?? null,
          reload,
        })
      } catch {
        setSession({
          isLoading: false,
          user: null,
          role: null,
          reload,
        })
      }
    })
  }, [])

  return <AuthContext.Provider value={session} {...props} />
}

export function useSession(
  {
    required,
  }: {
    required:
      | false // Session is not required.
      | true // Session is required, but any user is allowed.
      // Session is required, with a particular type.
      | {
          role: UserRole
        }
  } = {
    required: false,
  },
) {
  const session = useContext(AuthContext)

  useEffect(() => {
    if (session.isLoading) return

    // If a session is required, but there is no session user,
    // then redirect to the login page.
    if (typeof required === "boolean" && required && session.user === null) {
      router.replace("/(app)/login")
      return
    }

    if (typeof required === "object") {
      if (session.user === null) {
        router.replace("/(app)/login")

        return
      }

      for (const sessionRole of SUPPORTED_USER_ROLES) {
        if (required.role === sessionRole && session.role !== sessionRole) {
          const redirectPath = getUserRoleRedirectPath(session.role)
          router.replace(redirectPath)

          return
        }
      }
    }

    // TODO: Handle return urls.
  }, [required, session])

  return session
}
