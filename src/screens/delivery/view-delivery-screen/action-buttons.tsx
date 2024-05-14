import type { NormalizedDeliveryShipment, Package } from "@/server/db/entities"
import type { ShipmentPackageStatus } from "@/utils/constants"
import { View } from "react-native"
import { StartStopTracking } from "./start-stop-tracking"
import { TrackingEnabledButtons } from "./tracking-enabled-buttons"
import { NotAllApprovedMessage } from "./not-all-approved-message"
import { CompletePackageButton } from "./complete-package-button"
import { ShipmentCompletedMessage } from "./shipment-completed-message"
import { ShipmentPreparingMessage } from "./shipment-preparing-message"
import { ViewPackagesButton } from "./view-packages-button"
import { ViewChecklistButton } from "./view-checklist-button"
import { NoMorePackagesToDeliverMessage } from "./no-more-packages-to-deliver"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function ActionButtons(props: {
  shipment: NormalizedDeliveryShipment
  shipmentPackages: ShipmentPackage[]
}) {
  // Allow start tracking only if the shipment is in transit, and
  // all packages are approved by the driver.
  const canStartTracking =
    props.shipment.status === "IN_TRANSIT" &&
    props.shipmentPackages.every(
      ({ shipmentPackageIsDriverApproved }) => shipmentPackageIsDriverApproved,
    )

  const packagesToDeliver = props.shipmentPackages.filter(
    ({ shipmentPackageStatus }) => shipmentPackageStatus === "IN_TRANSIT",
  )
  const hasPackagesToDeliver = packagesToDeliver.length > 0

  const isAllPackagesDriverApproved = props.shipmentPackages.every(
    ({ shipmentPackageIsDriverApproved }) => shipmentPackageIsDriverApproved,
  )

  const isAllPackagesCompleted = props.shipmentPackages.every(
    ({ shipmentPackageStatus }) => shipmentPackageStatus === "COMPLETED",
  )

  return (
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
            rowGap: 12,
          }}
        >
          <StartStopTracking shipmentId={props.shipment.id} />
          {hasPackagesToDeliver ? (
            <TrackingEnabledButtons
              shipment={props.shipment}
              shipmentId={props.shipment.id}
              shipmentPackages={props.shipmentPackages}
            />
          ) : (
            <NoMorePackagesToDeliverMessage />
          )}
        </View>
      )}

      {props.shipment.status === "IN_TRANSIT" &&
        !isAllPackagesDriverApproved && <NotAllApprovedMessage />}

      {props.shipment.status !== "COMPLETED" && isAllPackagesCompleted && (
        <CompletePackageButton
          shipmentId={props.shipment.id}
          shipmentPackages={props.shipmentPackages}
        />
      )}
    </View>
  )
}
