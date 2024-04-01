import { Text, View, Image, TouchableOpacity } from "react-native"

export function ErrorView(props: { message: string; onRetry: () => void }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          elevation: 5,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/images/error-logo.png")}
          style={{
            width: 40,
            height: 40,
            marginBottom: 10,
          }}
        />
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Roboto-Bold",
            fontSize: 24,
            marginBottom: 5,
          }}
        >
          Unexpected Error
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Roboto",
            fontSize: 16,
            color: "red",
            marginBottom: 20,
          }}
        >
          {props.message}
        </Text>
        <TouchableOpacity
          onPress={props.onRetry}
          activeOpacity={0.6}
          style={{
            backgroundColor: "#FF6347",
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              fontFamily: "Roboto-Bold",
              fontSize: 18,
              color: "white",
            }}
          >
            Try again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
