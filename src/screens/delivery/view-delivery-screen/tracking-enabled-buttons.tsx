import { useLocationTracker } from "@/components/location-tracker"
import { useSavedShipment } from "@/components/saved-shipment"
import type { NormalizedDeliveryShipment, Package } from "@/server/db/entities"
import { CalculateNearestPackage } from "./calculate-nearest-package"
import { GoToNearestPackage } from "./go-to-nearest-package"
import type { ShipmentPackageStatus } from "@/utils/constants"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function TrackingEnabledButtons(props: {
  shipment: NormalizedDeliveryShipment
  shipmentId: number
  shipmentPackages: ShipmentPackage[]
}) {
  const { savedShipment } = useSavedShipment()
  const { isTracking } = useLocationTracker()

  if (!isTracking) return <></>
  if (savedShipment === null) return <></>
  if (savedShipment.id !== props.shipmentId) return <></>

  return (
    <>
      {props.shipment.nextToBeDeliveredPackageId === null ? (
        <CalculateNearestPackage shipmentId={props.shipmentId} />
      ) : (
        <GoToNearestPackage
          nextToBeDeliveredPackageId={props.shipment.nextToBeDeliveredPackageId}
          shipmentId={props.shipmentId}
          shipmentPackages={props.shipmentPackages}
        />
      )}
    </>
  )
}
