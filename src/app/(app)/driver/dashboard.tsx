import auth from "@react-native-firebase/auth"
import { SplashScreen, router } from "expo-router"
import { useState } from "react"
import { Text, View, TouchableOpacity } from "react-native"
import { useSession } from "@/components/auth"

export default function DashboardPage() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })
  const [isSigningOut, setIsSigningOut] = useState(false)

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                borderRadius: 8,
                paddingVertical: 16,
                backgroundColor: "black",
              }}
              onPress={() => router.push("/(app)/driver/deliveries")}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                Deliveries
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                borderRadius: 8,
                paddingVertical: 16,
                backgroundColor: "black",
              }}
              onPress={() => router.push("/(app)/driver/transfer-shipments")}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 16,
                }}
              >
                Transfer Shipments
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={async () => {
            setIsSigningOut(true)
            try {
              await auth().signOut()
            } finally {
              setIsSigningOut(false)
            }
          }}
        >
          <View
            style={{
              backgroundColor: "#ef4444",
              paddingVertical: 12,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              {isSigningOut ? "Logging Out ..." : "Logout"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
