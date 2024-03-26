import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"
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

const ExpoPushTokenContext = createContext<{
  token: ExpoPushToken | null
  requestToken: () => Promise<null | ExpoPushToken>
}>({
  token: null,
  requestToken: async () => {
    return null
  },
})

export function ExpoPushTokenProvider(props: { children: ReactNode }) {
  const { permission } = useNotificationPermission()
  const [token, setToken] = useState<null | ExpoPushToken>(null)

  async function requestToken() {
    if (Platform.OS === "android") {
      setNotificationChannelAsync("default", {
        name: "default",
        importance: AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    if (!isDevice) {
      console.log("Running environment should be a physical device.")
      return null
    }

    if (!(permission && permission.granted)) {
      console.log("Notification must be granted.")
      return null
    }

    const token = await getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    })

    setToken(token)
    return token
  }

  return (
    <ExpoPushTokenContext.Provider
      value={{
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
