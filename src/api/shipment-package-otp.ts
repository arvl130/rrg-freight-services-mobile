import type { Session } from "@/components/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function resendOtp(props: {
  shipmentId: number
  packageId: string
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const session = JSON.parse(sessionStr) as Session
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${props.shipmentId}/package/${props.packageId}/resend-otp`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.sessionId}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Server Error: Received unrecognized response.")
  }
}
