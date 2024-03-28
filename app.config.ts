import "dotenv/config"
import type { ExpoConfig } from "expo/config"

function generateVersionNumber() {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, "0")
  const day = `${now.getDate()}`.padStart(2, "0")
  const hours = `${now.getHours()}`.padStart(2, "0")
  const minutes = `${now.getMinutes()}`.padStart(2, "0")

  return `1.0.0-build${year}${month}${day}_${hours}${minutes}`
}

export default (): ExpoConfig => ({
  name: "RRG Freight Services",
  slug: "rrg-freight-services-mobile",
  version: generateVersionNumber(),
  orientation: "portrait",
  icon: "./src/assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./src/assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    googleServicesFile: process.env.GOOGLE_SERVICES_FILE,
    adaptiveIcon: {
      foregroundImage: "./src/assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.rrgfreightservices.mobile",
    permissions: ["ACCESS_FINE_LOCATION"],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./src/assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "@react-native-firebase/app",
    "expo-camera",
    [
      "@rnmapbox/maps",
      {
        RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET_KEY,
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./src/assets/fonts/Montserrat/Montserrat-ExtraLight.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-ExtraLightItalic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-Light.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-LightItalic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-Thin.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-ThinItalic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-Italic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-Medium.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-MediumItalic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-SemiBold.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-SemiBoldItalic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-Bold.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-BoldItalic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-ExtraBold.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-ExtraBoldItalic.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-Black.ttf",
          "./src/assets/fonts/Montserrat/Montserrat-BlackItalic.ttf",
          "./src/assets/fonts/Roboto/Roboto-Thin.ttf",
          "./src/assets/fonts/Roboto/Roboto-ThinItalic.ttf",
          "./src/assets/fonts/Roboto/Roboto-Light.ttf",
          "./src/assets/fonts/Roboto/Roboto-LightItalic.ttf",
          "./src/assets/fonts/Roboto/Roboto.ttf",
          "./src/assets/fonts/Roboto/Roboto-Italic.ttf",
          "./src/assets/fonts/Roboto/Roboto-Medium.ttf",
          "./src/assets/fonts/Roboto/Roboto-MediumItalic.ttf",
          "./src/assets/fonts/Roboto/Roboto-Bold.ttf",
          "./src/assets/fonts/Roboto/Roboto-BoldItalic.ttf",
          "./src/assets/fonts/Roboto/Roboto-Black.ttf",
          "./src/assets/fonts/Roboto/Roboto-BlackItalic.ttf",
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
})
