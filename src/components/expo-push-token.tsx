import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { ExpoPushToken } from "expo-notifications"
import {
  AndroidImportance,
  getExpoPushTokenAsync,
  setNotificationChannelAsync,
} from "expo-notifications"
import { Platform } from "react-native"
import { isDevice } from "expo-device"
import { useNotificationPermission } from "./notification-permission"
import Constants from "expo-constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

const ExpoPushTokenContext = createContext<{
  isLoading: boolean
  token: ExpoPushToken | null
  requestToken: () => Promise<null | ExpoPushToken>
}>({
  isLoading: true,
  token: null,
  requestToken: async () => {
    return null
  },
})

export function ExpoPushTokenProvider(props: { children: ReactNode }) {
  const { permission } = useNotificationPermission()
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<null | ExpoPushToken>(null)

  useEffect(() => {
    async function retrieveSavedToken() {
      const expoPushTokenData = await AsyncStorage.getItem("expo-push-token")
      if (expoPushTokenData) {
        setToken({
          type: "expo",
          data: expoPushTokenData,
        })
      }

      setIsLoading(false)
    }

    retrieveSavedToken()
  }, [])

  async function requestToken() {
    if (!isDevice) {
      console.log("Running environment should be a physical device.")
      return null
    }

    if (!(permission && permission.granted)) {
      console.log("Notification must be granted.")
      return null
    }

    if (Platform.OS === "android") {
      setNotificationChannelAsync("default", {
        name: "default",
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    try {
      const token = await getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      })

      await AsyncStorage.setItem("expo-push-token", token.data)

      setToken(token)
      return token
    } catch {
      return null
    }
  }

  return (
    <ExpoPushTokenContext.Provider
      value={{
        isLoading,
        token,
        requestToken,
      }}
      {...props}
    />
  )
}

export function useExpoPushToken() {
  return useContext(ExpoPushTokenContext)
}
