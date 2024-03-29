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
        name="deliveries/viewDelivery"
        options={{
          headerShown: false,
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
        name="deliveries/[id]/locations"
        options={{
          title: "Views Locations",
        }}
      />
      <Stack.Screen
        name="transfer-shipments/index"
        options={{
          title: "Transfer Shipments",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer-shipments/[id]/index"
        options={{
          title: "View Transfer Shipment",
        }}
      />
      <Stack.Screen
        name="transfer-shipments/[id]/transfer"
        options={{
          title: "Transfer Shipment",
        }}
      />
      <Stack.Screen
        name="transfer-shipments/[id]/packages"
        options={{
          title: "View Transfer Shipment",
        }}
      />
      <Stack.Screen
        name="transfer-shipments/[id]/locations"
        options={{
          title: "View Transfer Shipment",
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
