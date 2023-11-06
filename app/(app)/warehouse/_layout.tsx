import { Stack } from "expo-router"

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />
      <Stack.Screen
        name="scanner"
        options={{
          title: "Package Scanner",
        }}
      />
    </Stack>
  )
}
