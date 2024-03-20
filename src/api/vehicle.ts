import type { SessionAndUserJSON } from "@/components/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

export type Vehicle = {
  id: number
  type: "TRUCK" | "VAN" | "MOTORCYCLE"
  displayName: string
  isExpressAllowed: number
}

export async function getVehicle(id: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/vehicle/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error("An error occured while retrieving vehicle")
  }

  return responseJson as { message: string; vehicle: Vehicle }
}
