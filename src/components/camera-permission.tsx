import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import type { PermissionResponse } from "expo-camera/next"
import { useCameraPermissions } from "expo-camera/next"
import { Button, Text, View } from "react-native"
import Camera from "phosphor-react-native/src/icons/Camera"

const CameraPermissionContext = createContext<{
  permission: PermissionResponse | null
  requestPermission: () => Promise<void>
}>({
  permission: null,
  requestPermission: Promise.resolve,
})

export function CameraPermissionProvider(props: { children: ReactNode }) {
  const [permission, requestPermission] = useCameraPermissions()

  return (
    <CameraPermissionContext.Provider
      value={{
        permission,
        requestPermission: async () => {
          await requestPermission()
        },
      }}
      {...props}
    />
  )
}

export function useCameraPermission() {
  return useContext(CameraPermissionContext)
}

export function RequestCameraPermissionView(props: {
  header: string
  message: string
  requestPermission?: () => void
  cancelRequestPermission?: () => void
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Camera size={72} color="white" />
      <Text
        style={{
          color: "white",
          fontFamily: "Roboto-Bold",
          fontSize: 20,
          textAlign: "center",
          maxWidth: 200,
          marginTop: 12,
        }}
      >
        {props.header}
      </Text>
      <Text
        style={{
          color: "white",
          maxWidth: 300,
          marginTop: 24,
          marginBottom: props.requestPermission ? 16 : 0,
          textAlign: "center",
        }}
      >
        {props.message}
      </Text>
      {props.requestPermission && (
        <Button title="Request Permission" onPress={props.requestPermission} />
      )}
      <View
        style={{
          marginTop: 24,
        }}
      >
        {props.cancelRequestPermission && (
          <Button title="Cancel" onPress={props.cancelRequestPermission} />
        )}
      </View>
    </View>
  )
}
