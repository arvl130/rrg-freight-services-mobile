import auth from "@react-native-firebase/auth"
import { SplashScreen } from "expo-router"
import { useState } from "react"
import { View, Text, Button } from "react-native"

import { useSession } from "../../../components/auth"

export default function DashboardScreen() {
  useSession({
    required: {
      role: "DOMESTIC_AGENT",
    },
  })

  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <Text>This is the Domestic Agent Dashboard screen</Text>
      <Button
        title={isSigningOut ? "Logging Out ..." : "Logout"}
        disabled={isSigningOut}
        onPress={async () => {
          setIsSigningOut(true)
          try {
            await auth().signOut()
          } finally {
            setIsSigningOut(false)
          }
        }}
      />
    </View>
  )
}
