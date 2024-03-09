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
import { REGISTERED_FONTS } from "@/utils/fonts"

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
  const [loaded, error] = useFonts(REGISTERED_FONTS)

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
