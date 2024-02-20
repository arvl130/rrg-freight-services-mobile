import auth from "@react-native-firebase/auth"

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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error("Unauthenticated.")
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${shipmentId}/package/${packageId}/mark-delivered`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while updating delivery status: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${deliveryId}/complete`,
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
export async function getCountOfInTransitPackagesByDriver() {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error(
      "An error occured while updating delivery status: unauthenticated",
    )
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/user/statistics`,
    {
      method: "GET",
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

  return responseJson as {
    message: string
    total: number
    completePackagesCount: number
    pendingPackagesCount: number
    packageAddresses: []
  }
}
