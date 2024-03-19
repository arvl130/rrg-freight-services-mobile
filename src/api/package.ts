import type { Session } from "@/components/auth"
import type { Package } from "@/server/db/entities"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Coordinates = {
  lat: number
  lon: number
}

export async function updatePackageStatusToDelivered({
  shipmentId,
  packageId,
  imageUrl,
  code,
}: {
  shipmentId: number
  packageId: string
  imageUrl: string
  code: number
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${shipmentId}/package/${packageId}/mark-delivered`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
      body: JSON.stringify({
        imageUrl,
        code,
      }),
    },
  )

  const responseJson = await response.json()
  if (!response.ok) throw new Error(responseJson.message)

  return responseJson as { message: string; package: any }
}

export async function updateDeliveryStatusToCompleted(deliveryId: number) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${deliveryId}/complete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.sessionId}`,
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

export async function getCountOfInTransitPackagesByDriver() {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/user/statistics`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    console.log(responseJson)
    throw new Error("An error occured while updating delivery status")
  }

  return responseJson as {
    message: string
    total: number
    completePackagesCount: number
    pendingPackagesCount: number
    packageCoordinates: Coordinates[]
  }
}

export async function getPackageById(id: string) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/package/${id}`,
    {
      headers: {
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    throw new Error("ServerError: Retrieving package failed.")
  }

  return responseJson as { message: string; package: Package }
}
export async function getPackageAddressByPackageId(packageId: string) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/package/${packageId}/location`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  const responseJson = await response.json()
  if (!response.ok) {
    console.log(responseJson)
    throw new Error("An error occured retrieving package")
  }

  return responseJson as {
    message: string
    packageCoordinate: Coordinates
    packageAddress: string
  }
}
