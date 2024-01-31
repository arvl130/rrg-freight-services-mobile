import { Stack } from "expo-router"

import { useSession } from "../../components/auth"

export default function RootLayout() {
  const { isLoading } = useSession()
  if (isLoading) return null

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="admin/dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Stack.Screen
        name="warehouse"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="driver"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="overseas/dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Stack.Screen
        name="domestic/dashboard"
        options={{
          title: "Dashboard",
        }}
      />
    </Stack>
  )
}
