import { View } from "react-native"
import type {
  NormalizedWarehouseTransferShipment,
  Package,
} from "@/server/db/entities"
import type { ShipmentPackageStatus } from "@/utils/constants"
import { VehicleDetails } from "./view-details"
import { StartStopTransfer } from "./start-stop-transfer"
import { ShipmentCompletedMessage } from "./shipment-completed-message"
import { ShipmentPreparingMessage } from "./shipment-preparing-message"
import { ViewPackagesButton } from "./view-packages-button"
import { ViewChecklistButton } from "./view-checklist-button"
import { NotAllApprovedMessage } from "./not-all-approved-message"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function MainView(props: {
  shipment: NormalizedWarehouseTransferShipment
  packages: ShipmentPackage[]
}) {
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
            {props.shipment.status === "IN_TRANSIT" && (
              <StartStopTransfer shipmentId={props.shipment.id} />
            )}
          </View>
        )}

        {props.shipment.status === "IN_TRANSIT" &&
          !isAllPackagesDriverApproved && <NotAllApprovedMessage />}
      </View>
    </View>
  )
}
