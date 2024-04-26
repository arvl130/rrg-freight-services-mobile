import { Link, Stack, useLocalSearchParams } from "expo-router"
import { useSession } from "@/components/auth"
import { TouchableOpacity } from "react-native"
import MagnifyingGlass from "phosphor-react-native/src/icons/MagnifyingGlass"

function SearchButton() {
  const { id } = useLocalSearchParams<{
    id: string
  }>()

  return (
    <>
      <Link
        asChild
        href={{
          pathname: "/(app)/driver/deliveries/[id]/packages/search",
          params: {
            id,
          },
        }}
      >
        <TouchableOpacity activeOpacity={0.6}>
          <MagnifyingGlass size={20} color="white" weight="bold" />
        </TouchableOpacity>
      </Link>
    </>
  )
}

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
          headerRight: () => <SearchButton />,
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
        name="deliveries/[id]/package/[packageId]/confirm-delivery"
        options={{
          title: "Confirm Delivery",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="deliveries/[id]/package/[packageId]/fail-delivery"
        options={{
          title: "Fail Delivery",
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

      {/* Warehouse Transfer */}
      <Stack.Screen
        name="transfer/warehouse/(tabs)"
        options={{
          title: "Warehouse Transfer",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer/warehouse/[id]/index"
        options={{
          title: "View Warehouse Transfer",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer/warehouse/[id]/packages/index"
        options={{
          title: "View Packages",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="transfer/warehouse/[id]/packages/search"
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
        name="transfer/warehouse/[id]/package/[packageId]/details"
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
