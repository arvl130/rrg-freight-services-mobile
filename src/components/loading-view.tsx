import React from "react"
import { Text, View, Image } from "react-native"

export default function App() {
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
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Image
          source={require("@/assets/images/pickup-truck.gif")}
          style={{ width: 50, height: 50 }}
        />
        <Text style={{ marginTop: 10 }}>Loading, please wait...</Text>
      </View>
    </View>
  )
}
