import { Redirect } from "expo-router"
import { getUserRoleRedirectPath, useSession } from "@/components/auth"

export default function LoginScreen() {
  const { user } = useSession()
  if (user === null) return <Redirect href="/(app)/login" />

  const redirectPath = getUserRoleRedirectPath(user.role)
  return <Redirect href={redirectPath} />
}
