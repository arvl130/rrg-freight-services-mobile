export const supportedUserRoles = [
  "ADMIN",
  "WAREHOUSE",
  "OVERSEAS_AGENT",
  "DOMESTIC_AGENT",
  "DRIVER",
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

export const REGEX_ONE_OR_MORE_DIGITS = /^\d+$/
