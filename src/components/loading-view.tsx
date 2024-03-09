import { ActivityIndicator, View } from "react-native"

export function LoadingView() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <ActivityIndicator size="large" />
    </View>
  )
}
