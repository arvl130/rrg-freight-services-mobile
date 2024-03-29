import { type SessionAndUserJSON } from "@/components/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function updateCurrentUserPassword(options: {
  currentPassword: string
  newPassword: string
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user/password`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.id}`,
    },
    body: JSON.stringify(options),
  })

  if (response.status === 400) {
    const responseJson = await response.json()
    throw new Error(responseJson.message ?? "Response not OK.")
  }

  if (!response.ok) throw new Error("Response not OK.")

  const responseJson = await response.json()
  return responseJson as {
    message: string
  }
}
