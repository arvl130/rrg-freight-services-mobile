import { router } from "expo-router"
import type { ReactNode } from "react"
import { createContext, useContext, useEffect } from "react"
import type { UserRole } from "@/utils/constants"
import { SUPPORTED_USER_ROLES } from "@/utils/constants"
import { useQuery } from "@tanstack/react-query"
import { getCurrentUser } from "@/api/auth"

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

export type User = {
  id: string
  role: UserRole
}

export type Session = {
  sessionId: string
  user: User
}

type TAuthContext = {
  error: Error | null
  reload: () => Promise<void>
} & (
  | {
      // Initial state
      isLoading: true
      sessionId: null
      user: null
    }
  // Unauthenticated state
  | {
      isLoading: false
      sessionId: null
      user: null
    }
  // Authenticated state
  | {
      isLoading: false
      sessionId: string
      user: User
    }
)

const AuthContext = createContext<TAuthContext>({
  isLoading: true,
  sessionId: null,
  user: null,
  error: null,
  reload: Promise.resolve,
})

export function AuthProvider(props: { children: ReactNode; [x: string]: any }) {
  const { status, data, error, refetch } = useQuery({
    queryKey: ["getCurrentUser"],
    queryFn: () => getCurrentUser(),
    retry: 1,
    staleTime: Infinity,
  })

  if (status === "pending") {
    return (
      <AuthContext.Provider
        value={{
          isLoading: true,
          sessionId: null,
          user: null,
          error,
          reload: async () => {
            await refetch()
          },
        }}
        {...props}
      />
    )
  }

  if (status === "error") {
    return (
      <AuthContext.Provider
        value={{
          isLoading: false,
          sessionId: null,
          user: null,
          error,
          reload: async () => {
            await refetch()
          },
        }}
        {...props}
      />
    )
  }

  if (data === null) {
    return (
      <AuthContext.Provider
        value={{
          isLoading: false,
          sessionId: null,
          user: null,
          error,
          reload: async () => {
            await refetch()
          },
        }}
        {...props}
      />
    )
  } else {
    return (
      <AuthContext.Provider
        value={{
          isLoading: false,
          sessionId: data.sessionId,
          user: data.user,
          error,
          reload: async () => {
            await refetch()
          },
        }}
        {...props}
      />
    )
  }
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
        if (
          required.role === sessionRole &&
          session.user.role !== sessionRole
        ) {
          const redirectPath = getUserRoleRedirectPath(session.user.role)
          router.replace(redirectPath)

          return
        }
      }
    }

    // TODO: Handle return urls.
  }, [required, session])

  return session
}
