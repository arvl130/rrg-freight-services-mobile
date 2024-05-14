import type {
  NormalizedForwarderTransferShipment,
  Package,
} from "@/server/db/entities"
import { View } from "react-native"
import { useLocationTracker } from "@/components/location-tracker"
import { StartStopTransfer } from "./start-stop-transfer"
import { MarkAsTransferredButton } from "./complete-transfer-button"
import { VehicleDetails } from "./vehicle-details"
import type { ShipmentPackageStatus } from "@/utils/constants"
import { ViewChecklistButton } from "./view-checklist-button"
import { ViewPackagesButton } from "./view-packages-button"
import { ShipmentCompletedMessage } from "./shipment-completed-message"
import { ShipmentPreparingMessage } from "./shipment-preparing-message"
import { NotAllApprovedMessage } from "./not-all-approved-message"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function MainView(props: {
  shipment: NormalizedForwarderTransferShipment
  packages: ShipmentPackage[]
}) {
  const { isTracking } = useLocationTracker()
  const canStartTracking =
    props.shipment.status === "IN_TRANSIT" &&
    props.packages.every(
      ({ shipmentPackageIsDriverApproved }) => shipmentPackageIsDriverApproved,
    )

  const isAllPackagesDriverApproved = props.packages.every(
    ({ shipmentPackageIsDriverApproved }) => shipmentPackageIsDriverApproved,
  )

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <VehicleDetails id={props.shipment.vehicleId} />

      <View
        style={{
          backgroundColor: "#79CFDC",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          paddingVertical: 16,
          paddingHorizontal: 12,
        }}
      >
        {props.shipment.status === "COMPLETED" && <ShipmentCompletedMessage />}
        {props.shipment.status === "PREPARING" && <ShipmentPreparingMessage />}
        {props.shipment.status === "IN_TRANSIT" && isTracking && (
          <MarkAsTransferredButton shipmentId={props.shipment.id} />
        )}

        <View
          style={{
            flexDirection: "row",
            gap: 12,
          }}
        >
          <ViewPackagesButton shipmentId={props.shipment.id} />
          <ViewChecklistButton shipmentId={props.shipment.id} />
        </View>
        {canStartTracking && (
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
            }}
          >
            <StartStopTransfer shipmentId={props.shipment.id} />
          </View>
        )}

        {props.shipment.status === "IN_TRANSIT" &&
          !isAllPackagesDriverApproved && <NotAllApprovedMessage />}
      </View>
    </View>
  )
}
