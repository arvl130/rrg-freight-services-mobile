import { Text, View, Image } from "react-native"

export function LoadingView() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5.62,
          elevation: 8,
          paddingHorizontal: 50,
          paddingVertical: 25,
        }}
      >
        <Image
          source={require("@/assets/images/pickup-truck.gif")}
          style={{ width: 75, height: 75 }}
        />
        <Text
          style={{ marginTop: 10, fontFamily: "Roboto-Bold", fontSize: 24 }}
        >
          Loading
        </Text>
        <Text style={{ marginTop: 10 }}>Please wait ...</Text>
      </View>
    </View>
  )
}
