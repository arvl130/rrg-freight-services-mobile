import FontAwesome from "@expo/vector-icons/FontAwesome"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from "@tanstack/react-query"
import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import { useEffect } from "react"
import { Platform, useColorScheme } from "react-native"
import { AuthProvider } from "@/components/auth"
import { Notifications } from "@/components/notifications"
import { useAppState, useOnlineManager } from "@/utils/tanstack-query"

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(app)",
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    "Montserrat-ExtraLight": require("@/assets/fonts/Montserrat/Montserrat-ExtraLight.ttf"),
    "Montserrat-ExtraLightItalic": require("@/assets/fonts/Montserrat/Montserrat-ExtraLightItalic.ttf"),
    "Montserrat-Light": require("@/assets/fonts/Montserrat/Montserrat-Light.ttf"),
    "Montserrat-LightItalic": require("@/assets/fonts/Montserrat/Montserrat-LightItalic.ttf"),
    "Montserrat-Thin": require("@/assets/fonts/Montserrat/Montserrat-Thin.ttf"),
    "Montserrat-ThinItalic": require("@/assets/fonts/Montserrat/Montserrat-ThinItalic.ttf"),
    Montserrat: require("@/assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-Italic": require("@/assets/fonts/Montserrat/Montserrat-Italic.ttf"),
    "Montserrat-Medium": require("@/assets/fonts/Montserrat/Montserrat-Medium.ttf"),
    "Montserrat-MediumItalic": require("@/assets/fonts/Montserrat/Montserrat-MediumItalic.ttf"),
    "Montserrat-SemiBold": require("@/assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    "Montserrat-SemiBoldItalic": require("@/assets/fonts/Montserrat/Montserrat-SemiBoldItalic.ttf"),
    "Montserrat-Bold": require("@/assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    "Montserrat-BoldItalic": require("@/assets/fonts/Montserrat/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBold": require("@/assets/fonts/Montserrat/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraBoldItalic": require("@/assets/fonts/Montserrat/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-Black": require("@/assets/fonts/Montserrat/Montserrat-Black.ttf"),
    "Montserrat-BlackItalic": require("@/assets/fonts/Montserrat/Montserrat-BlackItalic.ttf"),
    "Roboto-Thin": require("@/assets/fonts/Roboto/Roboto-Thin.ttf"),
    "Roboto-ThinItalic": require("@/assets/fonts/Roboto/Roboto-ThinItalic.ttf"),
    "Roboto-Light": require("@/assets/fonts/Roboto/Roboto-Light.ttf"),
    "Roboto-LightItalic": require("@/assets/fonts/Roboto/Roboto-LightItalic.ttf"),
    Roboto: require("@/assets/fonts/Roboto/Roboto-Regular.ttf"),
    "Roboto-Italic": require("@/assets/fonts/Roboto/Roboto-Italic.ttf"),
    "Roboto-Medium": require("@/assets/fonts/Roboto/Roboto-Medium.ttf"),
    "Roboto-MediumItalic": require("@/assets/fonts/Roboto/Roboto-MediumItalic.ttf"),
    "Roboto-Bold": require("@/assets/fonts/Roboto/Roboto-Bold.ttf"),
    "Roboto-BoldItalic": require("@/assets/fonts/Roboto/Roboto-BoldItalic.ttf"),
    "Roboto-Black": require("@/assets/fonts/Roboto/Roboto-Black.ttf"),
    "Roboto-BlackItalic": require("@/assets/fonts/Roboto/Roboto-BlackItalic.ttf"),
    ...FontAwesome.font,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  if (!loaded) return null
  return <RootLayoutNav />
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  useOnlineManager()
  useAppState((status) => {
    if (Platform.OS !== "web") {
      focusManager.setFocused(status === "active")
    }
  })

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack>
            <Stack.Screen
              name="(app)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <Notifications />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
