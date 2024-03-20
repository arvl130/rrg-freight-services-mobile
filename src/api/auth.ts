import type { Session, SessionAndUserJSON, User } from "@/components/auth"
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
    session: Session
    user: User
  }
}

export async function getCurrentUser() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) return null

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.id}`,
    },
  })

  if (response.status === 401) return null

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("Response not OK.")
  }

  return responseJson as {
    message: string
    session: Session
    user: User
  }
}

export async function signOut() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const url = `${process.env.EXPO_PUBLIC_API_URL}/v1/user`
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

  await AsyncStorage.removeItem("session")
  return responseJson as {
    message: string
  }
}
