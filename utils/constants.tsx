export const supportedUserRoles = [
  "ADMIN",
  "WAREHOUSE",
  "OVERSEAS_AGENT",
  "DOMESTIC_AGENT",
] as const

export type UserRole = (typeof supportedUserRoles)[number]
