import { SplashScreen } from "expo-router"
import { View, Text } from "react-native"

export default function DashboardScreen() {
  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <Text>Something went wrong :(</Text>
    </View>
  )
}
