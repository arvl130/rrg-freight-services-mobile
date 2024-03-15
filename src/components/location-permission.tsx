import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import {
  useForegroundPermissions,
  type LocationPermissionResponse,
  PermissionStatus,
} from "expo-location"
import { Button, Text, View } from "react-native"
import MapPin from "phosphor-react-native/src/icons/MapPin"

const LocationPermissionContext = createContext<{
  permission: LocationPermissionResponse | null
  requestPermission: () => Promise<void>
}>({
  permission: null,
  requestPermission: Promise.resolve,
})

export function LocationPermissionProvider(props: { children: ReactNode }) {
  const [permission, requestPermission] = useForegroundPermissions()

  return (
    <LocationPermissionContext.Provider
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

export function useLocationPermission() {
  return useContext(LocationPermissionContext)
}

export function RequestLocationPermissionView(props: {
  header: string
  message: string
  requestPermission?: () => void
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
      <MapPin size={72} color="white" />
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
    </View>
  )
}

export function LocationPermissionRequiredView(props: { children: ReactNode }) {
  const { permission, requestPermission } = useLocationPermission()

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {permission === null ? (
        <RequestLocationPermissionView
          header="Location permission is required."
          message="To continue, please allow it in the Settings app."
          requestPermission={() => {
            requestPermission()
          }}
        />
      ) : (
        <>
          {permission.status === PermissionStatus.UNDETERMINED && (
            <RequestLocationPermissionView
              header="Location permission is required."
              message="To continue, please allow it in the Settings app."
              requestPermission={() => {
                requestPermission()
              }}
            />
          )}
          {permission.status === PermissionStatus.DENIED && (
            <RequestLocationPermissionView
              header="Location permission has been denied."
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
