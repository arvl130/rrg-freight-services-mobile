import { Text, View } from "react-native"

export function NoMorePackagesToDeliverMessage() {
  return (
    <View
      style={{
        borderRadius: 6,
        backgroundColor: "#dcfce7",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
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
        There are no more packages to deliver.
      </Text>
    </View>
  )
}
