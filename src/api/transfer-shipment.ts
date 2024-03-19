import type { Session } from "@/components/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

type TransferShipment = {
  id: number
  status: string
  createdAt: string
  isArchived: number
  driverId: string
  vehicleId: number
  sentToAgentId: string
}

export async function getTransferShipments() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer-shipments`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving transfer shipments")
  }

  return responseJson as {
    message: string
    transferShipments: TransferShipment[]
  }
}

export async function getTransferShipment(id: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer-shipment/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  const responseJson = await response.json()

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error("An error occured while retrieving transfer shipment")
  }

  return responseJson as { message: string; transferShipment: TransferShipment }
}

type TransferShipmentLocation = {
  id: number
  createdAt: string
  transferShipmentId: number
  long: number
  lat: number
  createdById: string
}

type NewTransferShipmentLocation = {
  id: number
  createdAt: string
  transferShipmentId: number
  long: number
  lat: number
  createdById: string
}

export async function createTransferShipmentLocation({
  transferShipmentId,
  long,
  lat,
}: {
  transferShipmentId: number
  long: number
  lat: number
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer-shipment/${transferShipmentId}/location`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
      body: JSON.stringify({
        transferShipmentId,
        long,
        lat,
      }),
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    console.log(responseJson)
    throw new Error("An error occured while saving location")
  }

  return responseJson as {
    message: string
    newLocation: NewTransferShipmentLocation[]
  }
}

export async function getTransferShipmentLocations(transferShipmentId: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer-shipment/${transferShipmentId}/location`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving locations")
  }

  return responseJson as {
    message: string
    locations: TransferShipmentLocation[]
  }
}

export async function getTransferShipmentPackages(transferShipmentId: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer-shipment/${transferShipmentId}/packages`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error(
      "An error occured while retrieving transfer shipment packages",
    )
  }

  return responseJson as { message: string; packages: any }
}

export async function updateTransferShipmentStatusToCompleted({
  imageUrl,
  transferShipmentId,
}: {
  transferShipmentId: number
  imageUrl: string
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer-shipment/${transferShipmentId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
      body: JSON.stringify({
        imageUrl,
      }),
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while updating transfer shipment status")
  }

  return responseJson as { message: string; transferShipment: TransferShipment }
}
