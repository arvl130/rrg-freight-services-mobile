import type { SessionAndUserJSON } from "@/components/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

export async function getOtpValidity({
  shipmentId,
  packageId,
  code,
}: {
  shipmentId: number
  packageId: string
  code: number
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${shipmentId}/package/${packageId}/check-otp-validity`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
      body: JSON.stringify({
        code,
      }),
    },
  )

  const responseJson = await response.json()
  if (!response.ok) throw new Error(responseJson.message)

  return responseJson as { message: string; isValid: boolean }
}

export async function resendOtp(props: {
  shipmentId: number
  packageId: string
}) {
  const sessionStr = await AsyncStorage.getItem("session")
  if (sessionStr === null) {
    throw new Error("Unauthorized.")
  }

  const { session } = JSON.parse(sessionStr) as SessionAndUserJSON
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/v1/delivery/${props.shipmentId}/package/${props.packageId}/resend-otp`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.id}`,
      },
    },
  )

  if (!response.ok) {
    throw new Error("Server Error: Received unrecognized response.")
  }
}
