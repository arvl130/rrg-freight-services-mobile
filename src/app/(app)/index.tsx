import { Redirect } from "expo-router"
import { getUserRoleRedirectPath, useSession } from "@/components/auth"

export default function LoginScreen() {
  const { user, role } = useSession()
  if (user === null) return <Redirect href="/(app)/login" />

  const redirectPath = getUserRoleRedirectPath(role)
  return <Redirect href={redirectPath} />
}
