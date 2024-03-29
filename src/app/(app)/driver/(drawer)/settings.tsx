import { SplashScreen } from "expo-router"
import { Text, View } from "react-native"
import { useSession } from "@/components/auth"

export default function DashboardPage() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })

  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <Text
        style={{
          textAlign: "center",
        }}
      >
        This is the Settings page.
      </Text>
    </View>
  )
}
