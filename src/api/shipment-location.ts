import auth from "@react-native-firebase/auth"
import { NewShipmentLocation, ShipmentLocation } from "@/utils/entities"

export async function getLocations(shipmentId: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving locations: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/shipment/${shipmentId}/location`,
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
    `${process.env.EXPO_PUBLIC_API_URL}/v1/shipment/${shipmentId}/location`,
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
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${deliveryId}/location`,
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
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${deliveryId}/location`,
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
