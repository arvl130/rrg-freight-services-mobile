import auth from "@react-native-firebase/auth"
import { useState } from "react"
import { View, Text, Button } from "react-native"

import { useSession } from "../../../components/auth"

export default function DashboardScreen() {
  useSession({
    required: {
      role: "OVERSEAS_AGENT",
    },
  })

  const [isSigningOut, setIsSigningOut] = useState(false)
  return (
    <View>
      <Text>This is the Overseas Agent Dashboard screen</Text>
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
