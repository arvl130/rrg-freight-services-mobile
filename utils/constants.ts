export const supportedUserRoles = [
  "ADMIN",
  "WAREHOUSE",
  "OVERSEAS_AGENT",
  "DOMESTIC_AGENT",
] as const

export type UserRole = (typeof supportedUserRoles)[number]

export const supportedPackageStatuses = [
  "IN_WAREHOUSE",
  "SORTING",
  "SHIPPING",
  "DELIVERING",
  "DELIVERED",
] as const
export type PackageStatus = (typeof supportedPackageStatuses)[number]
