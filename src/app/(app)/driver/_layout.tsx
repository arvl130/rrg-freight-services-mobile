import { Stack } from "expo-router"
import { useSession } from "@/components/auth"

export default function Layout() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })

  return (
    <Stack>
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false,
        }}
      />

      {/* Deliveries */}
      <Stack.Screen
        name="deliveries/(tabs)"
        options={{
          title: "Deliveries",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/index"
        options={{
          title: "View Delivery",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/packages/index"
        options={{
          title: "View Packages",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/packages/search"
        options={{
          title: "Search Packages",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/package/[packageId]/details"
        options={{
          title: "View Packages",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/package/[packageId]/mark-as-delivered"
        options={{
          title: "Mark as Delivered",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/package/[packageId]/location"
        options={{
          title: "View Map",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />

      {/* Forwarder Transfer */}
      <Stack.Screen
        name="transfer/forwarder/(tabs)"
        options={{
          title: "Forwarder Transfer",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer/forwarder/[id]/index"
        options={{
          title: "View Forwarder Transfer",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer/forwarder/[id]/mark-as-completed"
        options={{
          title: "Mark as Transferred",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer/forwarder/[id]/packages/index"
        options={{
          title: "View Packages",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer/forwarder/[id]/packages/search"
        options={{
          title: "Search Packages",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
          animation: "slide_from_bottom",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="transfer/forwarder/[id]/package/[packageId]/details"
        options={{
          title: "View Packages",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />

      {/* Settings */}
      <Stack.Screen
        name="settings/details"
        options={{
          title: "Update Details",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="settings/photo"
        options={{
          title: "Update Photo",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="settings/password"
        options={{
          title: "Update Password",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  )
}
