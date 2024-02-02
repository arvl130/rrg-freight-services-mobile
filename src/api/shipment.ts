import auth from "@react-native-firebase/auth"
import { Shipment } from "@/utils/entities"

export async function getShipment(shipmentId: number) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while retrieving shipment: unauthenticated",
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

  if (response.status === 404) return null
  if (!response.ok) {
    throw new Error("An error occured while retrieving shipment")
  }

  return responseJson.shipment as Shipment
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
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${deliveryId}/packages`,
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
