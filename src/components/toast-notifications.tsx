import Constants from "expo-constants"
import { useEffect, useRef } from "react"
import type { Toast } from "react-hot-toast/headless"
import { useToaster } from "react-hot-toast/headless"
import { Text, View, Animated } from "react-native"

function ToastNotification({
  t,
  updateHeight,
  offset,
}: {
  t: Toast
  offset: number
  updateHeight: (height: number) => void
}) {
  // Animations for enter and exit
  const fadeAnim = useRef(new Animated.Value(0.5)).current
  const posAnim = useRef(new Animated.Value(-80)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: t.visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim, t.visible])

  useEffect(() => {
    Animated.spring(posAnim, {
      toValue: t.visible ? offset : -80,
      useNativeDriver: true,
    }).start()
  }, [posAnim, offset, t.visible])

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: t.visible ? 9999 : undefined,
        alignItems: "center",
        opacity: fadeAnim,
        transform: [
          {
            translateY: posAnim,
          },
        ],
      }}
    >
      <View
        onLayout={(event) => updateHeight(event.nativeEvent.layout.height)}
        style={{
          margin: Constants.statusBarHeight + 10,
          backgroundColor: "black",
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 12,
        }}
        key={t.id}
      >
        <Text>{t.icon}</Text>
        <Text
          style={{
            color: "#fff",
            paddingVertical: 4,
            paddingHorizontal: 12,
            textAlign: "center",
          }}
        >
          {t.message as string}
        </Text>
      </View>
    </Animated.View>
  )
}

export function ToastNotifications() {
  const { toasts, handlers } = useToaster()
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {toasts.map((t) => (
        <ToastNotification
          key={t.id}
          t={t}
          updateHeight={(height) => handlers.updateHeight(t.id, height)}
          offset={handlers.calculateOffset(t, {
            reverseOrder: false,
          })}
        />
      ))}
    </View>
  )
}
