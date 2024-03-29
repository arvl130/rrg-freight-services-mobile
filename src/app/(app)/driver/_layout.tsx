import { Stack } from "expo-router"
import { Alert, TouchableOpacity } from "react-native"
import List from "phosphor-react-native/src/icons/List"
import SignOut from "phosphor-react-native/src/icons/SignOut"
import { useSession } from "@/components/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signOut } from "@/api/auth"
export default function Layout() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })

  const queryClient = useQueryClient()
  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(["getCurrentUser"], () => null)
    },
    onError: ({ message }) => {
      Alert.alert("Sign Out Failed", message, [
        {
          text: "OK",
        },
      ])
    },
  })
  const isDisabled = signOutMutation.isPending || signOutMutation.isSuccess
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          headerStyle: {
            backgroundColor: "#79CFDC",
          },
          headerTintColor: "white",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                marginRight: 14,
              }}
            >
              <List size={24} color="white" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              disabled={isDisabled}
              onPress={async () => {
                // Use Alert to confirm signing out
                Alert.alert(
                  "Confirm Sign Out",
                  "Are you sure you want to sign out?",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Sign Out",
                      onPress: async () => {
                        try {
                          await signOutMutation.mutate()
                        } catch {}
                      },
                    },
                  ],
                  { cancelable: false },
                )
              }}
            >
              <SignOut
                size={24}
                color="white"
                style={{
                  opacity: isDisabled ? 0.2 : undefined,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="deliveries/index"
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
    </Stack>
  )
}
