export type ShipmentLocation = {
  id: number
  shipmentId: number
  createdAt: Date
  createdById: string
  long: number
  lat: number
}

export type NewShipmentLocation = {
  shipmentId: number
  createdById: string
  long: number
  lat: number
  id?: number | undefined
}

export type Shipment = {
  id: number
  isArchived: number
  originHubId: number
  destinationHubId: number | null
}
