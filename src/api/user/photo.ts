import { type SessionAndUserJSON } from "@/components/auth"
import type { PublicUser } from "@/server/db/entities"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function updateCurrentUserPhotoUrl(options: { photoUrl: string }) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user/photo`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.id}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  })

  if (!response.ok) throw new Error("Response not OK.")

  const responseJson = await response.json()
  return responseJson as {
    message: string
  }
}

export async function removeCurrentUserPhotoUrl() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user/photo`
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.id}`,
    },
  })

  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  const responseJson = await response.json()
  return responseJson as {
    message: string
    user: PublicUser
  }
}
