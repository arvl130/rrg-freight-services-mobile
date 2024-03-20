import { SplashScreen } from "expo-router"
import { View, Text, Button, Alert } from "react-native"
import { useSession } from "@/components/auth"
import { useMutation } from "@tanstack/react-query"
import { signOut } from "@/api/auth"

export default function DashboardScreen() {
  const { reload } = useSession({
    required: {
      role: "OVERSEAS_AGENT",
    },
  })

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      await reload()
    },
    onError: ({ message }) => {
      Alert.alert("Sign Out Failed", message, [
        {
          text: "OK",
        },
      ])
    },
  })

  return (
    <View
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <Text>This is the Overseas Agent Dashboard screen</Text>
      <Button
        title={signOutMutation.isPending ? "Logging Out ..." : "Logout"}
        disabled={signOutMutation.isPending}
        onPress={() => {
          signOutMutation.mutate()
        }}
      />
    </View>
  )
}
