import auth from "@react-native-firebase/auth"

import { NewShipmentLocation, Shipment, ShipmentLocation } from "./entities"

export async function getLocations(shipmentId: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/shipment/${shipmentId}/location`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving locations")
  }

  return responseJson as { locations: ShipmentLocation[] }
}

export async function createLocation(
  shipmentId: number,
  long: number,
  lat: number,
) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/shipment/${shipmentId}/location`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shipmentId,
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

  return responseJson as { newLocation: NewShipmentLocation[] }
}

export async function getShipment(shipmentId: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving shipment: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/shipment/${shipmentId}/location`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

export type Delivery = {
  status: string
  id: number
  createdAt: string
  isArchived: number
  driverId: string
  vehicleId: number
  isExpress: number
}

export async function getDeliveries() {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/deliveries`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving deliveries")
  }

  return responseJson as { message: string; deliveries: Delivery[] }
}

export async function getDelivery(id: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving delivery: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/delivery/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const responseJson = await response.json()

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error("An error occured while retrieving delivery")
  }

  return responseJson as { message: string; delivery: Delivery }
}

export type Vehicle = {
  id: number
  type: "TRUCK" | "VAN" | "MOTORCYCLE"
  displayName: string
  isExpressAllowed: number
}

export async function getVehicle(id: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving delivery: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/vehicle/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

type DeliveryLocation = {
  id: number
  createdAt: string
  deliveryId: number
  long: number
  lat: number
  createdById: string
}

export async function createDeliveryLocation({
  deliveryId,
  long,
  lat,
}: {
  deliveryId: number
  long: number
  lat: number
}) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/delivery/${deliveryId}/location`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        deliveryId,
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

  return responseJson as { newLocation: NewShipmentLocation[] }
}

export async function getDeliveryLocations(deliveryId: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/delivery/${deliveryId}/location`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving delivery locations")
  }

  return responseJson as { message: string; locations: DeliveryLocation[] }
}

export async function getDeliveryPackages(deliveryId: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving delivery packages: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/delivery/${deliveryId}/packages`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("An error occured while retrieving delivery packages")
  }

  return responseJson as { message: string; packages: any }
}

export async function updatePackageStatusToDelivered({
  packageId,
  imageUrl,
}: {
  packageId: number
  imageUrl: string
}) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while updating package status: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/package/${packageId}/deliver`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        imageUrl,
      }),
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    console.log(responseJson)
    throw new Error("An error occured while updating package status")
  }

  return responseJson as { message: string; package: any }
}

export async function updateDeliveryStatusToCompleted(deliveryId: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while updating delivery status: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/delivery/${deliveryId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    console.log(responseJson)
    throw new Error("An error occured while updating delivery status")
  }

  return responseJson as { message: string; package: any }
}

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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving transfer shipments: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/transfer-shipments`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving transfer shipment: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/transfer-shipment/${id}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/transfer-shipment/${transferShipmentId}/location`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/transfer-shipment/${transferShipmentId}/location`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving transfer shipment packages: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/transfer-shipment/${transferShipmentId}/packages`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while updating transfer shipment status: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/transfer-shipment/${transferShipmentId}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
