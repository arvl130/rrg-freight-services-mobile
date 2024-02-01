import auth from "@react-native-firebase/auth"

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
