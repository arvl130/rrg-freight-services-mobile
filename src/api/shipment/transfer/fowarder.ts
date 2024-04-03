import type { SessionAndUserJSON } from "@/components/auth"
import type {
  ForwarderTransferShipment,
  NormalizedForwarderTransferShipment,
  Package,
} from "@/server/db/entities"
import type { ShipmentStatus } from "@/utils/constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

type NormalizedForwarderTransferShipmentWithPackageCount =
  NormalizedForwarderTransferShipment & {
    packageCount: number
  }

export async function getForwarderTransferShipments() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/forwarders`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving transfer shipments")
  }

  return responseJson as {
    message: string
    shipments: NormalizedForwarderTransferShipmentWithPackageCount[]
  }
}

export async function getForwarderTransferShipmentsByStatus(
  status: ShipmentStatus,
) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/forwarders?status=${status}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving transfer shipments")
  }

  return responseJson as {
    message: string
    shipments: NormalizedForwarderTransferShipmentWithPackageCount[]
  }
}

export async function getForwarderTransferShipment(id: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/forwarder/${id}`,
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
    throw new Error("An error occured while retrieving transfer shipment")
  }

  return responseJson as {
    message: string
    shipment: NormalizedForwarderTransferShipment
  }
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

export async function createForwarderTransferShipmentLocation({
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

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/forwarder/${transferShipmentId}/location`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
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

export async function getForwarderTransferShipmentLocations(
  transferShipmentId: number,
) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/forwarder/${transferShipmentId}/location`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
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

export async function getForwarderTransferShipmentPackages(
  transferShipmentId: number,
) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/forwarder/${transferShipmentId}/packages`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error(
      "An error occured while retrieving transfer shipment packages",
    )
  }

  return responseJson as { message: string; packages: Package[] }
}

export async function updateForwarderTransferShipmentStatusToCompleted({
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

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/forwarder/${transferShipmentId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
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

  return responseJson as {
    message: string
    transferShipment: ForwarderTransferShipment
  }
}
