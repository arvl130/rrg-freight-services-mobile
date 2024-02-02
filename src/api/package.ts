import auth from "@react-native-firebase/auth"

export async function updatePackageStatusToDelivered({
  packageId,
  imageUrl,
}: {
  packageId: string
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
    `${process.env.EXPO_PUBLIC_API_URL}/v1/package/${packageId}/deliver`,
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
