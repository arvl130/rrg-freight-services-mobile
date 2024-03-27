import type { SessionAndUserJSON } from "@/components/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { ExpoPushToken } from "expo-notifications"

export async function getExpoPushTokens() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user/expo-push-tokens`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.id}`,
    },
  })

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  return responseJson as {
    message: string
    tokens: string[]
  }
}

export async function registerNewExpoPushToken(newToken: ExpoPushToken) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user/expo-push-tokens`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.id}`,
    },
    body: JSON.stringify({
      token: newToken.data,
    }),
  })

  if (!response.ok) throw new Error("Response not OK.")

  const responseJson = await response.json()
  return responseJson as {
    message: string
    token: string
  }
}
