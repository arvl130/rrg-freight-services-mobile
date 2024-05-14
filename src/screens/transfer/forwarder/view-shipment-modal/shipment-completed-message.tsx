import { Text, View } from "react-native"

export function ShipmentCompletedMessage() {
  return (
    <View
      style={{
        borderRadius: 6,
        backgroundColor: "#dcfce7",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontFamily: "Roboto-Medium",
          color: "#14532d",
          paddingHorizontal: 6,
          textAlign: "center",
        }}
      >
        This shipment has been completed.
      </Text>
    </View>
  )
}
