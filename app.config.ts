import "dotenv/config"
import { ExpoConfig, ConfigContext } from "expo/config"

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "RRG Freight Services",
  slug: "rrg-freight-services-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
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
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.rrgfreightservices.mobile",
    permissions: ["ACCESS_FINE_LOCATION"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: ["expo-router", "@react-native-firebase/app", "expo-camera"],
  experiments: {
    typedRoutes: true,
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
