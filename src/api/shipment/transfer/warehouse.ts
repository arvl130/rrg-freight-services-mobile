import type { SessionAndUserJSON } from "@/components/auth"
import type {
  NormalizedWarehouseTransferShipment,
  Package,
  ShipmentLocation,
  NewShipmentLocation,
} from "@/server/db/entities"
import type { ShipmentPackageStatus, ShipmentStatus } from "@/utils/constants"
import AsyncStorage from "@react-native-async-storage/async-storage"

type NormalizedWarehouseTransferShipmentWithPackageCount =
  NormalizedWarehouseTransferShipment & {
    packageCount: number
  }

export async function getWarehouseTransferShipments() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouses`,
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
    shipments: NormalizedWarehouseTransferShipmentWithPackageCount[]
  }
}

export async function getWarehouseTransferShipmentsByStatus(
  status: ShipmentStatus,
) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouses?status=${status}`,
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
    shipments: NormalizedWarehouseTransferShipmentWithPackageCount[]
  }
}

export async function getWarehouseTransferShipment(id: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouse/${id}`,
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
    shipment: NormalizedWarehouseTransferShipment
  }
}

export async function createWarehouseTransferShipmentLocation({
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
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouse/${transferShipmentId}/location`,
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
    newLocation: NewShipmentLocation[]
  }
}

export async function getWarehouseTransferShipmentLocations(
  transferShipmentId: number,
) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouse/${transferShipmentId}/location`,
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
    locations: ShipmentLocation[]
  }
}

export async function getWarehouseTransferShipmentPackages(shipmentId: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouse/${shipmentId}/packages`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving shipment packages.")
  }

  return responseJson as {
    message: string
    packages: (Package & {
      shipmentPackageStatus: ShipmentPackageStatus
      shipmentPackageIsDriverApproved: boolean
    })[]
  }
}

export async function getWarehouseTransferShipmentPackageById(options: {
  shipmentId: number
  packageId: string
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouse/${options.shipmentId}/package/${options.packageId}`,
    {
      headers: {
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("ServerError: Retrieving package failed.")
  }

  return responseJson as {
    message: string
    package: Package & {
      shipmentPackageStatus: ShipmentPackageStatus
      shipmentPackageIsDriverApproved: boolean
    }
  }
}

export async function approveWarehouseTransferShipmentPackageById(options: {
  shipmentId: number
  packageId: string
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/transfer/warehouse/${options.shipmentId}/package/${options.packageId}/driver-approve`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("ServerError: Approving warehouse transfer package failed.")
  }

  return responseJson as {
    message: string
  }
}
