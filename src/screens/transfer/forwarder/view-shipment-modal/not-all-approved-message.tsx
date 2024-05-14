import { Text, View } from "react-native"

export function NotAllApprovedMessage() {
  return (
    <View
      style={{
        borderRadius: 6,
        backgroundColor: "#dcfce7",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        marginTop: 12,
      }}
    >
      <Text
        style={{
          fontFamily: "Roboto-Medium",
          color: "#14532d",
          paddingHorizontal: 6,
        }}
      >
        All packages need to be checked before the transfer can begin.
      </Text>
    </View>
  )
}
