import { type SessionAndUserJSON } from "@/components/auth"
import type { PublicUser } from "@/server/db/entities"
import type { Gender } from "@/utils/constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function updateCurrentUserDetails(options: {
  displayName: string
  emailAddress: string
  contactNumber: string
  gender: Gender
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user/details`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.id}`,
    },
    body: JSON.stringify(options),
  })

  if (!response.ok) throw new Error("Response not OK.")

  const responseJson = await response.json()
  return responseJson as {
    message: string
  }
}

export async function getCurrentUserDetails() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user/details`
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.id}`,
    },
  })

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  return responseJson as {
    message: string
    user: PublicUser
  }
}
