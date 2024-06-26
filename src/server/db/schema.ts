import {
  SUPPORTED_GENDERS,
  SUPPORTED_PACKAGE_STATUSES,
  SUPPORTED_PACKAGE_RECEPTION_MODES,
  SUPPORTED_USER_ROLES,
  SUPPORTED_SHIPMENT_STATUSES,
  SUPPORTED_PACKAGE_SHIPPING_MODES,
  SUPPORTED_PACKAGE_SHIPPING_TYPES,
  SUPPORTED_VEHICLE_TYPES,
  SUPPORTED_SHIPMENT_TYPES,
  SUPPORTED_SHIPMENT_PACKAGE_STATUSES,
  SUPPORTED_ACTIVITY_VERB,
  SUPPORTED_ACTIVITY_ENTITY,
  SUPPORTED_PACKAGE_REMARKS,
} from "../../utils/constants"
import {
  bigint,
  mysqlTable,
  varchar,
  text,
  mysqlEnum,
  timestamp,
  tinyint,
  int,
  double,
  primaryKey,
  datetime,
  decimal,
} from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
  id: varchar("id", { length: 28 }).primaryKey(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  photoUrl: text("photo_url"),
  emailAddress: varchar("email_address", { length: 100 }).notNull().unique(),
  hashedPassword: varchar("hashed_password", { length: 255 }).notNull(),
  contactNumber: varchar("contact_number", { length: 15 }).notNull(),
  gender: mysqlEnum("gender", SUPPORTED_GENDERS).notNull(),
  role: mysqlEnum("role", SUPPORTED_USER_ROLES).notNull(),
  isEnabled: tinyint("is_enabled").notNull().default(1),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const sessions = mysqlTable("sessions", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 28,
  }).notNull(),
  expiresAt: datetime("expires_at").notNull(),
})

export const warehouseStaffs = mysqlTable("warehouse_staffs", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  warehouseId: bigint("warehouse_id", {
    mode: "number",
  }).notNull(),
})

export const drivers = mysqlTable("drivers", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  licenseNumber: varchar("license_number", {
    length: 100,
  }).notNull(),
  licenseRegistrationDate: varchar("license_registration_date", {
    length: 10,
  }).notNull(),
})

export const driverAssignedAreas = mysqlTable(
  "driver_assigned_areas",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    areaCode: varchar("area_code", { length: 10 }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.areaCode],
    }),
  }),
)

export const overseasAgents = mysqlTable("overseas_agents", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  companyName: varchar("company_name", {
    length: 100,
  }).notNull(),
})

export const domesticAgents = mysqlTable("domestic_agents", {
  userId: varchar("user_id", {
    length: 28,
  })
    .notNull()
    .primaryKey(),
  companyName: varchar("company_name", {
    length: 100,
  }).notNull(),
})

export const shipments = mysqlTable("shipments", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  type: mysqlEnum("type", SUPPORTED_SHIPMENT_TYPES).notNull(),
  status: mysqlEnum("status", SUPPORTED_SHIPMENT_STATUSES).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const shipmentPackages = mysqlTable(
  "shipment_packages",
  {
    shipmentId: bigint("shipment_id", {
      mode: "number",
    }).notNull(),
    packageId: varchar("package_id", { length: 36 }).notNull(),
    status: mysqlEnum("status", SUPPORTED_SHIPMENT_PACKAGE_STATUSES).notNull(),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.shipmentId, table.packageId],
    }),
  }),
)

export const shipmentPackageOtps = mysqlTable(
  "shipment_package_otps",
  {
    shipmentId: bigint("shipment_id", {
      mode: "number",
    }).notNull(),
    packageId: varchar("package_id", { length: 36 }).notNull(),
    isValid: tinyint("is_valid").notNull().default(1),
    code: int("code").notNull(),
    expireAt: varchar("expire_at", {
      length: 255,
    }).notNull(),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.shipmentId, table.packageId],
      }),
    }
  },
)

export const shipmentLocations = mysqlTable("shipment_locations", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).notNull(),
  long: double("long", {
    precision: 12,
    scale: 9,
  }).notNull(),
  lat: double("lat", {
    precision: 12,
    scale: 9,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const incomingShipments = mysqlTable("incoming_shipments", {
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).primaryKey(),
  sentByAgentId: varchar("sent_by_agent_id", {
    length: 28,
  }).notNull(),
  receivedAtWarehouseId: bigint("received_at_warehouse_id", {
    mode: "number",
  }),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const forwarderTransferShipments = mysqlTable(
  "forwarder_transfer_shipments",
  {
    shipmentId: bigint("shipment_id", {
      mode: "number",
    }).primaryKey(),
    driverId: varchar("driver_id", {
      length: 28,
    }).notNull(),
    vehicleId: bigint("vehicle_id", {
      mode: "number",
    }).notNull(),
    sentToAgentId: varchar("sent_to_agent_id", {
      length: 28,
    }).notNull(),
    departingWarehouseId: bigint("departing_warehouse_id", {
      mode: "number",
    }).notNull(),
    proofOfTransferImgUrl: text("proof_of_transfer_img_url"),
    isTransferConfirmed: tinyint("is_transfer_confirmed").notNull().default(0),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
)

export const warehouseTransferShipments = mysqlTable(
  "warehouse_transfer_shipments",
  {
    shipmentId: bigint("shipment_id", {
      mode: "number",
    }).primaryKey(),
    driverId: varchar("driver_id", {
      length: 28,
    }).notNull(),
    vehicleId: bigint("vehicle_id", {
      mode: "number",
    }).notNull(),
    sentFromWarehouseId: bigint("sent_from_warehouse_id", {
      mode: "number",
    }).notNull(),
    sentToWarehouseId: bigint("sent_to_warehouse_id", {
      mode: "number",
    }).notNull(),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
)

export const deliveryShipments = mysqlTable("delivery_shipments", {
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).primaryKey(),
  driverId: varchar("driver_id", {
    length: 28,
  }).notNull(),
  vehicleId: bigint("vehicle_id", {
    mode: "number",
  }).notNull(),
  isExpress: tinyint("is_express").notNull(),
  departureAt: varchar("departure_at", {
    length: 100,
  }).notNull(),
  departingWarehouseId: bigint("departing_warehouse_id", {
    mode: "number",
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  nextToBeDeliveredPackageId: varchar("next_to_be_delivered_package_id", {
    length: 36,
  }),
})

export const warehouses = mysqlTable("warehouses", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  volumeCapacityInCubicMeter: double("volume_capacity_in_cubic_meter", {
    precision: 8,
    scale: 2,
  }).notNull(),
  targetUtilization: double("target_utilization", {
    precision: 8,
    scale: 2,
  }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const vehicles = mysqlTable("vehicles", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  type: mysqlEnum("type", SUPPORTED_VEHICLE_TYPES).notNull(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  plateNumber: varchar("plate_number", {
    length: 15,
  })
    .notNull()
    .unique(),
  weightCapacityInKg: double("weight_capacity_in_kg", {
    precision: 8,
    scale: 2,
  }).notNull(),
  isExpressAllowed: tinyint("is_express_allowed").notNull(),
  isMaintenance: tinyint("is_maintenance").notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const packageCategories = mysqlTable("package_categories", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const packages = mysqlTable("packages", {
  id: varchar("id", { length: 36 }).primaryKey(),
  preassignedId: varchar("preassigned_id", { length: 100 }).primaryKey(),
  shippingMode: mysqlEnum(
    "shipping_mode",
    SUPPORTED_PACKAGE_SHIPPING_MODES,
  ).notNull(),
  shippingType: mysqlEnum(
    "shippingtype",
    SUPPORTED_PACKAGE_SHIPPING_TYPES,
  ).notNull(),
  receptionMode: mysqlEnum(
    "reception_mode",
    SUPPORTED_PACKAGE_RECEPTION_MODES,
  ).notNull(),
  remarks: mysqlEnum("remarks", SUPPORTED_PACKAGE_REMARKS),
  weightInKg: double("weight_in_kg", {
    precision: 8,
    scale: 2,
  }).notNull(),
  volumeInCubicMeter: double("volume_in_cubic_meter", {
    precision: 8,
    scale: 2,
  }).notNull(),
  senderFullName: varchar("sender_full_name", { length: 100 }).notNull(),
  senderContactNumber: varchar("sender_contact_number", {
    length: 15,
  }).notNull(),
  senderEmailAddress: varchar("sender_email_address", {
    length: 100,
  }).notNull(),
  senderStreetAddress: varchar("sender_street_address", {
    length: 255,
  }).notNull(),
  senderCity: varchar("sender_city", {
    length: 100,
  }).notNull(),
  senderStateOrProvince: varchar("sender_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  senderCountryCode: varchar("sender_country_code", { length: 3 }).notNull(),
  senderPostalCode: int("sender_postal_code").notNull(),
  receiverFullName: varchar("receiver_full_name", { length: 100 }).notNull(),
  receiverContactNumber: varchar("receiver_contact_number", {
    length: 15,
  }).notNull(),
  receiverEmailAddress: varchar("receiver_email_address", {
    length: 100,
  }).notNull(),
  receiverStreetAddress: varchar("receiver_street_address", {
    length: 255,
  }).notNull(),
  receiverBarangay: varchar("receiver_barangay", {
    length: 100,
  }).notNull(),
  receiverCity: varchar("receiver_city", {
    length: 100,
  }).notNull(),
  receiverStateOrProvince: varchar("receiver_state_province", {
    length: 100,
  }).notNull(),
  // Uses ISO 3166-1 alpha-3 format.
  // See: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3
  receiverCountryCode: varchar("receiver_country_code", {
    length: 3,
  }).notNull(),
  receiverPostalCode: int("receiver_postal_code").notNull(),
  proofOfDeliveryImgUrl: text("proof_of_delivery_img_url"),
  proofOfDeliverySignatureUrl: text("proof_of_delivery_sig_url"),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  updatedById: varchar("updated_by_id", { length: 28 }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
  isDeliverable: tinyint("is_deliverable").notNull(),
  isUnmanifested: tinyint("is_unmanifested").notNull().default(0),
  lastWarehouseId: bigint("last_warehouse_id", {
    mode: "number",
  }),
  expectedHasDeliveryAt: varchar("expected_has_delivery_at", {
    length: 100,
  }),
  expectedIsDeliveredAt: varchar("expected_is_delivered_at", {
    length: 100,
  }),
  isFragile: tinyint("is_fragile").notNull(),
  status: mysqlEnum("status", SUPPORTED_PACKAGE_STATUSES).notNull(),
  failedAttempts: tinyint("failed_attempts").notNull().default(0),
  declaredValue: double("declared_value"),
  areaCode: varchar("area_code", { length: 100 }).notNull(),
})

export const packageMonitoringAccessKeys = mysqlTable(
  "package_monitoring_access_keys",
  {
    packageId: varchar("package_id", { length: 36 }).notNull(),
    accessKey: varchar("access_key", { length: 36 }).notNull(),
    isValid: tinyint("is_valid").notNull().default(1),
    createdAt: varchar("created_at", {
      length: 100,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.packageId, table.accessKey],
    }),
  }),
)

export const packageStatusLogs = mysqlTable("package_status_logs", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  packageId: varchar("package_id", { length: 36 }).notNull(),
  status: mysqlEnum("status", SUPPORTED_PACKAGE_STATUSES).notNull(),
  description: varchar("description", {
    length: 255,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
})

export const activities = mysqlTable("activities", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  verb: mysqlEnum("verb", SUPPORTED_ACTIVITY_VERB).notNull(),
  entity: mysqlEnum("entity", SUPPORTED_ACTIVITY_ENTITY).notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
  createdById: varchar("created_by_id", { length: 28 }).notNull(),
  isArchived: tinyint("is_archived").notNull().default(0),
})

export const webpushSubscriptions = mysqlTable(
  "webpush_subscriptions",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    endpointHashed: varchar("endpoint_hashed", {
      length: 64,
    }).notNull(),
    endpoint: text("endpoint").notNull(),
    expirationTime: int("expiration_time"),
    keyAuth: text("key_auth").notNull(),
    keyP256dh: text("key_p256dh").notNull(),
    createdAt: varchar("created_at", {
      length: 255,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.endpointHashed],
      }),
    }
  },
)

export const webauthnChallenges = mysqlTable("webauthn_challenges", {
  userId: varchar("user_id", { length: 28 }).primaryKey(),
  challenge: text("challenge").notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const webauthnCredentials = mysqlTable("webauthn_credentials", {
  id: varchar("id", {
    length: 256,
  }).primaryKey(),
  deviceName: varchar("device_name", {
    length: 100,
  }).notNull(),
  userId: varchar("user_id", { length: 28 }).notNull(),
  key: text("key").notNull(),
  transports: text("transports").notNull(),
  counter: int("counter").notNull(),
  createdAt: varchar("created_at", {
    length: 255,
  }).notNull(),
})

export const expopushTokens = mysqlTable(
  "expopush_tokens",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    data: varchar("data", {
      length: 100,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.data],
      }),
    }
  },
)

export const passwordResetTokens = mysqlTable(
  "password_reset_tokens",
  {
    userId: varchar("user_id", {
      length: 28,
    }).notNull(),
    tokenHashed: varchar("token_hashed", {
      length: 64,
    }).notNull(),
    isValid: tinyint("is_valid").notNull().default(1),
    expireAt: varchar("expire_at", {
      length: 100,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.userId, table.tokenHashed],
      }),
    }
  },
)

export const deliverableProvinces = mysqlTable("deliverable_provinces", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  displayName: varchar("display_name", {
    length: 100,
  }).notNull(),
  createdAt: varchar("created_at", {
    length: 100,
  }).notNull(),
})

export const assignedDrivers = mysqlTable("assigned_drivers", {
  driverId: varchar("user_id", {
    length: 28,
  }).notNull(),
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).notNull(),
})

export const assignedVehicles = mysqlTable("assigned_vehicles", {
  vehicleId: bigint("id", {
    mode: "number",
  }).primaryKey(),
  shipmentId: bigint("shipment_id", {
    mode: "number",
  }).notNull(),
})

export const barangays = mysqlTable("barangays", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  code: varchar("code", {
    length: 9,
  }).notNull(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  regionId: varchar("region_id", {
    length: 2,
  }).notNull(),
  provinceId: varchar("province_id", {
    length: 4,
  }).notNull(),
  cityId: varchar("city_id", {
    length: 6,
  }).notNull(),
  published: tinyint("published").notNull().default(0),
  shippingFee: decimal("shipping_fee", {
    precision: 10,
    scale: 2,
  })
    .notNull()
    .default("0.00"),
})

export const cities = mysqlTable("cities", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  code: varchar("code", {
    length: 9,
  }).notNull(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  regionId: varchar("region_id", {
    length: 2,
  }).notNull(),
  provinceId: varchar("province_id", {
    length: 4,
  }).notNull(),
  cityId: varchar("city_id", {
    length: 6,
  }).notNull(),
  published: tinyint("published").notNull().default(0),
})

export const provinces = mysqlTable("provinces", {
  id: bigint("id", {
    mode: "number",
  })
    .primaryKey()
    .autoincrement(),
  code: varchar("code", {
    length: 9,
  }).notNull(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  regionId: varchar("region_id", {
    length: 2,
  }).notNull(),
  provinceId: varchar("province_id", {
    length: 4,
  }).notNull(),
  published: tinyint("published").notNull().default(0),
})
