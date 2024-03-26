import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import type { NotificationPermissionsStatus } from "expo-notifications"
import { setNotificationHandler, usePermissions } from "expo-notifications"
import { PermissionStatus } from "expo-location"
import { Button, Text, View } from "react-native"
import Bell from "phosphor-react-native/src/icons/Bell"

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const NotificationPermissionContext = createContext<{
  permission: NotificationPermissionsStatus | null
  requestPermission: () => Promise<void>
}>({
  permission: null,
  requestPermission: Promise.resolve,
})

export function NotificationPermissionProvider(props: { children: ReactNode }) {
  const [permission, requestPermission] = usePermissions()

  return (
    <NotificationPermissionContext.Provider
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

export function useNotificationPermission() {
  return useContext(NotificationPermissionContext)
}

function RequestNotificationPermissionView(props: {
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
      <Bell size={72} color="white" />
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

export function NotificationPermissionRequiredView(props: {
  children: ReactNode
}) {
  const { permission, requestPermission } = useNotificationPermission()

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {permission === null ? (
        <RequestNotificationPermissionView
          header="Notification permission is required."
          message="To continue, please allow it in the Settings app."
          requestPermission={() => {
            requestPermission()
          }}
        />
      ) : (
        <>
          {permission.status === PermissionStatus.UNDETERMINED && (
            <RequestNotificationPermissionView
              header="Notification permission is required."
              message="To continue, please allow it in the Settings app."
              requestPermission={() => {
                requestPermission()
              }}
            />
          )}
          {permission.status === PermissionStatus.DENIED && (
            <RequestNotificationPermissionView
              header="Notification permission has been denied."
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
