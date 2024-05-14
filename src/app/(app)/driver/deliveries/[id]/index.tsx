import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { Text, View } from "react-native"
import { getDeliveryPackages } from "@/api/shipment"
import { getDelivery } from "@/api/delivery"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import { MainView } from "@/screens/delivery/view-delivery-screen/main-view"

export default function Page() {
  const params = useLocalSearchParams<{ id: string }>()
  const deliveryQuery = useQuery({
    queryKey: ["getDelivery", params.id],
    queryFn: () => getDelivery(Number(params.id)),
  })

  const deliveryPackagesQuery = useQuery({
    queryKey: ["getDeliveryPackages", params.id],
    queryFn: () => getDeliveryPackages(Number(params.id)),
  })

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#FFFFFF",
      }}
    >
      {deliveryQuery.status === "pending" && <LoadingView />}
      {deliveryQuery.status === "error" && (
        <ErrorView
          message={deliveryQuery.error.message}
          onRetry={() => {
            deliveryQuery.refetch()
          }}
        />
      )}
      {deliveryQuery.status === "success" && (
        <>
          {deliveryQuery.data === null ? (
            <Text>No such delivery.</Text>
          ) : (
            <>
              {deliveryPackagesQuery.status === "pending" && <LoadingView />}
              {deliveryPackagesQuery.status === "error" && (
                <ErrorView
                  message={deliveryPackagesQuery.error.message}
                  onRetry={() => {
                    deliveryPackagesQuery.refetch()
                  }}
                />
              )}
              {deliveryPackagesQuery.status === "success" && (
                <MainView
                  delivery={deliveryQuery.data.delivery}
                  packages={deliveryPackagesQuery.data.packages}
                />
              )}
            </>
          )}
        </>
      )}
    </View>
  )
}
