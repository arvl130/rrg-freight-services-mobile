import type { SessionAndUserJSON } from "@/components/auth"
import type { Shipment, DeliveryShipment } from "@/server/db/entities"
import type { ShipmentStatus } from "@/utils/constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function getDeliveries() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/deliveries`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving deliveries")
  }

  return responseJson as {
    message: string
    deliveries: (Shipment & DeliveryShipment & { packageCount: number })[]
  }
}

export async function getDeliveriesByStatus(status: ShipmentStatus) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/deliveries?status=${status}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving deliveries")
  }

  return responseJson as {
    message: string
    deliveries: (Shipment & DeliveryShipment & { packageCount: number })[]
  }
}

export async function getDelivery(id: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${id}`,
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
    throw new Error("An error occured while retrieving delivery")
  }

  return responseJson as {
    message: string
    delivery: Shipment & DeliveryShipment
  }
}
