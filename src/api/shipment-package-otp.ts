import auth from "@react-native-firebase/auth"

export async function checkOtp(props: {
  shipmentId: number
  packageId: string
  code: number
}) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error("Unauthenticated")
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${props.shipmentId}/package/${props.packageId}/otp/${props.code}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (response.status === 500) throw new Error("Internal Server Error")
  if (response.status === 401) throw new Error("Unauthorized")
  if (response.status === 404) return false

  if (!response.ok) {
    throw new Error("Response not OK")
  }

  return true
}
