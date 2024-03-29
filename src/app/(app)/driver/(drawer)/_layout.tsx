import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Drawer } from "expo-router/drawer"
import { Alert, Image, Text, View } from "react-native"
import SignOut from "phosphor-react-native/src/icons/SignOut"
import House from "phosphor-react-native/src/icons/House"
import Gear from "phosphor-react-native/src/icons/Gear"
import User from "phosphor-react-native/src/icons/User"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { signOut } from "@/api/auth"
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer"
import { useSession } from "@/components/auth"

function DrawerContent(props: any) {
  const { user } = useSession()
  const queryClient = useQueryClient()
  const { isPending, isSuccess, mutate } = useMutation({
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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <DrawerContentScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          {user ? (
            <>
              {user.photoUrl ? (
                <Image
                  style={{
                    height: 75,
                    width: 75,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 75 / 2,
                  }}
                  source={{
                    uri: user?.photoUrl!,
                  }}
                />
              ) : (
                <View
                  style={{
                    height: 75,
                    width: 75,
                    backgroundColor: "#e5e7eb",
                    borderRadius: 75 / 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <User size={36} color="#6b7280" />
                </View>
              )}
            </>
          ) : (
            <View
              style={{
                height: 75,
                width: 75,
                backgroundColor: "#e5e7eb",
                borderRadius: 37.5,
              }}
            />
          )}

          <Text
            style={{
              marginTop: 6,
              marginBottom: 12,
              color: "#6b7280",
            }}
          >
            {user?.displayName ?? "..."}
          </Text>
        </View>
        <DrawerItemList {...props} />
        <DrawerItem
          style={{
            marginTop: "auto",
          }}
          label="Logout"
          icon={({ size, color }) => <SignOut size={size} color={color} />}
          onPress={async () => {
            if (!(isPending || isSuccess))
              Alert.alert("Confirm", "Are you sure you want to sign out?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    mutate()
                  },
                },
              ])
          }}
        />
      </DrawerContentScrollView>
      <View />
    </View>
  )
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer drawerContent={DrawerContent}>
        <Drawer.Screen
          name="dashboard"
          options={{
            title: "Home",
            headerStyle: {
              backgroundColor: "#79CFDC",
            },
            headerTintColor: "white",
            drawerIcon: ({ size, color }) => (
              <House size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",
            headerStyle: {
              backgroundColor: "#79CFDC",
            },
            headerTintColor: "white",
            drawerIcon: ({ size, color }) => <Gear size={size} color={color} />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  )
}
