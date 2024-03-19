import type { Session } from "@/components/auth"
import type { UserRole } from "@/utils/constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function signInWithEmailAndPassword(options: {
  email: string
  password: string
}) {
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/signin`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  })

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  return responseJson as {
    message: string
    sessionId: string
    user: {
      id: string
      role: UserRole
    }
  }
}

export async function getCurrentUser() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    return null
  }

  const session = JSON.parse(sessionStr) as Session
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.sessionId}`,
    },
  })

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  return responseJson as {
    message: string
    sessionId: string
    user: {
      id: string
      role: UserRole
    }
  }
}

export async function signOut() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.sessionId}`,
    },
  })

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  await AsyncStorage.removeItem("session")
  return responseJson as {
    message: string
  }
}
