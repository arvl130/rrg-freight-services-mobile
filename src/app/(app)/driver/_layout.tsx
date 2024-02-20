import { Stack } from "expo-router"
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {},
        headerShadowVisible: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="deliveries/index"
        options={{
          title: "Deliveries",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/index"
        options={{
          title: "View Delivery",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/packages"
        options={{
          title: "View Packages",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/locations"
        options={{
          title: "Views Locations",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/deliver"
        options={{
          title: "Deliver Package",
        }}
      />
      <Stack.Screen
        name="transfer-shipments/index"
        options={{
          title: "Transfer Shipments",
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
    </Stack>
  )
}
