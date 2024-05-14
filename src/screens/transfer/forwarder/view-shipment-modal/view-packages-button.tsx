import { Link } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

export function ViewPackagesButton(props: { shipmentId: number }) {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Link
        asChild
        href={{
          pathname: "/(app)/driver/transfer/forwarder/[id]/packages/",
          params: {
            id: props.shipmentId,
          },
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            borderRadius: 6,
            backgroundColor: "#EEAE3F",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto-Medium",
              color: "white",
              fontSize: 16,
              paddingHorizontal: 6,
              textAlign: "center",
            }}
          >
            View Packages
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}
