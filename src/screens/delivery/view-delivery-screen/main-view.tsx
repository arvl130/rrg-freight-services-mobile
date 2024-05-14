import { RefreshControl, ScrollView, View } from "react-native"
import type { NormalizedDeliveryShipment, Package } from "@/server/db/entities"
import type { ShipmentPackageStatus } from "@/utils/constants"
import { ProgressTiles } from "./progress-tiles"
import { VehicleDetails } from "./vehicle-details"
import { ActionButtons } from "./action-buttons"
import { useQuery } from "@tanstack/react-query"
import { getDelivery } from "@/api/delivery"
import { getDeliveryPackages } from "@/api/shipment"

type ShipmentPackage = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

export function MainView(props: {
  delivery: NormalizedDeliveryShipment
  packages: ShipmentPackage[]
}) {
  const deliveryQuery = useQuery({
    queryKey: ["getDelivery", props.delivery.id.toString()],
    queryFn: () => getDelivery(props.delivery.id),
  })

  const deliveryPackagesQuery = useQuery({
    queryKey: ["getDeliveryPackages", props.delivery.id.toString()],
    queryFn: () => getDeliveryPackages(props.delivery.id),
  })

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={
              deliveryQuery.fetchStatus === "fetching" ||
              deliveryPackagesQuery.fetchStatus === "fetching"
            }
            onRefresh={() => {
              deliveryQuery.refetch()
              deliveryPackagesQuery.refetch()
            }}
          />
        }
      >
        <VehicleDetails id={props.delivery.vehicleId} />
        <ProgressTiles shipmentPackages={props.packages} />
      </ScrollView>
      <ActionButtons
        shipment={props.delivery}
        shipmentPackages={props.packages}
      />
    </View>
  )
}
