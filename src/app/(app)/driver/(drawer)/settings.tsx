import { SplashScreen } from "expo-router"
import { Switch, Text, View } from "react-native"
import { useSession } from "@/components/auth"
import Constants from "expo-constants"
import { getHumanizedOfUserRole } from "@/utils/humanize"
import { TouchableOpacity } from "react-native-gesture-handler"
import User from "phosphor-react-native/src/icons/User"
import {
  getExpoPushTokens,
  registerNewExpoPushToken,
  unregisterExpoPushToken,
} from "@/api/expo-push-token"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useExpoPushToken } from "@/components/expo-push-token"
import { useEffect, useState } from "react"

function ProfileSection() {
  const { user } = useSession()

  return (
    <View
      style={{
        paddingHorizontal: 12,
      }}
    >
      <Text
        style={{
          color: "#374151",
          fontFamily: "Roboto-Bold",
          fontSize: 20,
          paddingVertical: 12,
          paddingHorizontal: 12,
        }}
      >
        Profile
      </Text>

      <View
        style={{
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: "#e5e7eb",
            borderRadius: 100 / 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <User size={48} color="#6b7280" />
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottomWidth: 1,
          borderColor: "#f3f4f6",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          Name
        </Text>
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto",
            fontSize: 16,
          }}
        >
          {user?.displayName}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          Role
        </Text>
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto",
            fontSize: 16,
          }}
        >
          {getHumanizedOfUserRole(user?.role!)}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

function EnableNotificationButton(props: { registeredTokens: string[] }) {
  const [isEnabled, setIsEnabled] = useState(false)
  const { token, requestToken } = useExpoPushToken()
  const queryClient = useQueryClient()
  const registerMutation = useMutation({
    mutationFn: async () => {
      if (token) {
        await registerNewExpoPushToken(token)
      } else {
        const newToken = await requestToken()
        if (newToken) await registerNewExpoPushToken(newToken)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getExpoPushTokens"],
      })
    },
  })
  const unregisterMutation = useMutation({
    mutationFn: unregisterExpoPushToken,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getExpoPushTokens"],
      })
    },
  })

  useEffect(() => {
    if (token) {
      if (props.registeredTokens.includes(token.data)) {
        setIsEnabled(true)
      } else {
        setIsEnabled(false)
      }
    } else {
      setIsEnabled(false)
    }
  }, [token, props.registeredTokens])

  return (
    <>
      <Switch
        disabled={registerMutation.isPending || unregisterMutation.isPending}
        value={isEnabled}
        onValueChange={() => {
          setIsEnabled((currIsEnabled) => {
            const newIsEnabled = !currIsEnabled
            if (newIsEnabled) {
              registerMutation.mutate()
            } else {
              if (token) unregisterMutation.mutate(token)
            }

            return newIsEnabled
          })
        }}
      />
    </>
  )
}

function NotificationsSection() {
  const { status, data } = useQuery({
    queryKey: ["getExpoPushTokens"],
    queryFn: () => getExpoPushTokens(),
  })

  return (
    <View
      style={{
        paddingHorizontal: 12,
      }}
    >
      <Text
        style={{
          color: "#374151",
          fontFamily: "Roboto-Bold",
          fontSize: 20,
          paddingTop: 24,
          paddingBottom: 12,
          paddingHorizontal: 12,
        }}
      >
        Notifications
      </Text>

      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          borderBottomWidth: 1,
          borderColor: "#f3f4f6",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          Show on this device
        </Text>
        {status === "success" ? (
          <EnableNotificationButton registeredTokens={data.tokens} />
        ) : (
          <Switch disabled value={false} />
        )}
      </View>
    </View>
  )
}

function AboutSection() {
  return (
    <View
      style={{
        paddingHorizontal: 12,
      }}
    >
      <Text
        style={{
          color: "#374151",
          fontFamily: "Roboto-Bold",
          fontSize: 20,
          paddingTop: 24,
          paddingBottom: 12,
          paddingHorizontal: 12,
        }}
      >
        About
      </Text>

      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          borderBottomWidth: 1,
          borderColor: "#f3f4f6",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          App Name
        </Text>
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto",
            fontSize: 16,
          }}
        >
          {Constants.expoConfig?.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          App Version
        </Text>
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto",
            fontSize: 16,
          }}
        >
          {Constants.expoConfig?.version}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          backgroundColor: "white",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto-Medium",
            fontSize: 16,
          }}
        >
          Expo SDK Version
        </Text>
        <Text
          style={{
            color: "#374151",
            fontFamily: "Roboto",
            fontSize: 16,
          }}
        >
          {Constants.expoConfig?.sdkVersion}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default function SettingsPage() {
  useSession({
    required: {
      role: "DRIVER",
    },
  })

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f3f4f6",
      }}
      onLayout={() => {
        SplashScreen.hideAsync()
      }}
    >
      <ProfileSection />
      <NotificationsSection />
      <AboutSection />
    </View>
  )
}
