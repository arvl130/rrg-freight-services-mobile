import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import type { MediaLibraryPermissionResponse } from "expo-image-picker"
import { PermissionStatus, useMediaLibraryPermissions } from "expo-image-picker"
import { Button, Text, View } from "react-native"
import Camera from "phosphor-react-native/src/icons/Camera"

const PickerMediaLibraryPermissionContext = createContext<{
  permission: MediaLibraryPermissionResponse | null
  requestPermission: () => Promise<void>
}>({
  permission: null,
  requestPermission: Promise.resolve,
})

export function PickerMediaLibraryPermissionProvider(props: {
  children: ReactNode
}) {
  const [permission, requestPermission] = useMediaLibraryPermissions()

  return (
    <PickerMediaLibraryPermissionContext.Provider
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

export function usePickerMediaLibraryPermission() {
  return useContext(PickerMediaLibraryPermissionContext)
}

function RequestPickerMediaLibraryPermissionView(props: {
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

export function PickerMediaLibraryPermissionRequiredView(props: {
  children: ReactNode
}) {
  const { permission, requestPermission } = usePickerMediaLibraryPermission()

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {permission === null ? (
        <RequestPickerMediaLibraryPermissionView
          header="Camera permission is required."
          message="To continue, please allow it in the Settings app."
          requestPermission={() => {
            requestPermission()
          }}
        />
      ) : (
        <>
          {permission.status === PermissionStatus.UNDETERMINED && (
            <RequestPickerMediaLibraryPermissionView
              header="Camera permission is required."
              message="To continue, please allow it in the Settings app."
              requestPermission={() => {
                requestPermission()
              }}
            />
          )}
          {permission.status === PermissionStatus.DENIED && (
            <RequestPickerMediaLibraryPermissionView
              header="Camera permission has been denied."
              message="This permission is required to use this app. To continue, please allow it in the Settings app."
              requestPermission={() => {
                requestPermission()
              }}
            />
          )}
          {permission.status === PermissionStatus.GRANTED && (
            <>{props.children}</>
          )}
        </>
      )}
    </View>
  )
}
