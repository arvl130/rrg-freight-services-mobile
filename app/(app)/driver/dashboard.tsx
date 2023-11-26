import { router } from "expo-router"
import { Text, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export default function DashboardPage() {
  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
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
        <TouchableOpacity activeOpacity={0.6}>
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
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}
