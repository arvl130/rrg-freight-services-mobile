import auth from "@react-native-firebase/auth"

export async function resendOtp(props: {
  shipmentId: number
  packageId: string
}) {
  const { currentUser } = auth()
  if (!currentUser) {
    throw new Error("Client Error: Not authorized.")
  }

  const token = await currentUser.getIdToken()
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${props.shipmentId}/package/${props.packageId}/resend-otp`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Server Error: Received unrecognized response.")
  }
}
