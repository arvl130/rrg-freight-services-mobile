import { Link } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

export function ViewChecklistButton(props: { shipmentId: number }) {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Link
        asChild
        href={{
          pathname: "/(app)/driver/deliveries/[id]/packages/checklist",
          params: {
            id: props.shipmentId,
          },
        }}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            backgroundColor: "#3b82f6",
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontFamily: "Roboto-Medium",
              fontSize: 16,
            }}
          >
            View Checklist
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  )
}
