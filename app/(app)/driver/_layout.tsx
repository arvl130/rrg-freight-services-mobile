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
        name="transfer-shipments/[id]"
        options={{
          title: "View Transfer Shipment",
        }}
      />
    </Stack>
  )
}
