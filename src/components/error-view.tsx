import { Text, View } from "react-native"

export function ErrorView(props: { message: string }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontFamily: "Roboto-Bold",
          fontSize: 24,
        }}
      >
        Error:
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontFamily: "Roboto",
          fontSize: 16,
        }}
      >
        {props.message}
      </Text>
    </View>
  )
}
