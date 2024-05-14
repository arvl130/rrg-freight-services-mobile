import { Text, View } from "react-native"

export function ShipmentPreparingMessage() {
  return (
    <View
      style={{
        borderRadius: 6,
        backgroundColor: "#fee2e2",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          fontFamily: "Roboto-Medium",
          color: "#7f1d1d",
          paddingHorizontal: 6,
          textAlign: "center",
        }}
      >
        This shipment is still being prepared.
      </Text>
    </View>
  )
}
