import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { SessionAndUserJSON } from "./auth"

export const SAVED_SESSION_STORAGE_KEY = "saved-session"

const SavedSessionContext = createContext<{
  isLoading: boolean
  savedSession: null | SessionAndUserJSON
  save: () => Promise<void>
  clear: () => Promise<void>
}>({
  isLoading: true,
  savedSession: null,
  save: Promise.resolve,
  clear: Promise.resolve,
})

export function SavedSessionProvider(props: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [savedSession, setSavedSession] = useState<null | SessionAndUserJSON>(
    null,
  )

  useEffect(() => {
    async function retrieveSavedSession() {
      try {
        const savedSessionAndUser = await AsyncStorage.getItem(
          SAVED_SESSION_STORAGE_KEY,
        )
        if (savedSessionAndUser) {
          const sessionAndUser = JSON.parse(
            savedSessionAndUser,
          ) as SessionAndUserJSON

          setSavedSession(sessionAndUser)
        }
      } catch {}

      setIsLoading(false)
    }

    retrieveSavedSession()
  }, [])

  return (
    <SavedSessionContext.Provider
      value={{
        isLoading,
        savedSession,
        save: async () => {
          const sessionStr = await AsyncStorage.getItem("session")
          if (sessionStr) {
            await AsyncStorage.setItem(SAVED_SESSION_STORAGE_KEY, sessionStr)
            const sessionAndUser = JSON.parse(sessionStr) as SessionAndUserJSON
            setSavedSession(sessionAndUser)
          }
        },
        clear: async () => {
          await AsyncStorage.removeItem(SAVED_SESSION_STORAGE_KEY)
          setSavedSession(null)
        },
      }}
      {...props}
    />
  )
}

export function useSavedSession() {
  return useContext(SavedSessionContext)
}
