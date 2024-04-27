import type { Shipment } from "@/utils/entities"
import type { Package } from "@/server/db/entities"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { SessionAndUserJSON } from "@/components/auth"
import type { ShipmentPackageStatus } from "@/utils/constants"

export async function getShipment(shipmentId: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/shipment/${shipmentId}/location`,
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
    throw new Error("An error occured while retrieving shipment")
  }

  return responseJson.shipment as Shipment
}

export async function getDeliveryPackages(deliveryId: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${deliveryId}/packages`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving delivery packages")
  }

  return responseJson as {
    message: string
    packages: (Package & { shipmentPackageStatus: ShipmentPackageStatus })[]
  }
}

export async function getDeliveryPackagesOrderedByDistance(
  deliveryId: number,
  lat: number,
  long: number,
) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${deliveryId}/packages?lat=${lat}&long=${long}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving delivery packages")
  }

  return responseJson as { message: string; packages: Package[] }
}
