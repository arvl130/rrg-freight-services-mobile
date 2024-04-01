import { getTransferShipments } from "@/api/transfer-shipment"
import { ErrorView } from "@/components/error-view"
import { LoadingView } from "@/components/loading-view"
import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { DateTime } from "luxon"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

export default function TransferShipmentsPage() {
  const { status, data, error, fetchStatus, refetch } = useQuery({
    queryKey: ["getTransferShipments"],
    queryFn: () => getTransferShipments(),
  })

  return (
    <ScrollView
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
      refreshControl={
        <RefreshControl
          refreshing={status !== "pending" && fetchStatus === "fetching"}
          onRefresh={() => refetch()}
        />
      }
    >
      {status === "pending" && <LoadingView />}
      {status === "error" && (
        <ErrorView
          message={error.message}
          onRetry={() => {
            refetch()
          }}
        />
      )}
      {status === "success" && (
        <View>
          {data.transferShipments.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
              }}
            >
              No transfer shipments assigned.
            </Text>
          ) : (
            <>
              {data.transferShipments.map((transferShipment, index) => (
                <View
                  key={transferShipment.id}
                  style={
                    index === data.transferShipments.length - 1
                      ? undefined
                      : {
                          marginBottom: 12,
                        }
                  }
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(app)/driver/transfer-shipments/[id]/",
                        params: {
                          id: transferShipment.id,
                        },
                      })
                    }
                    activeOpacity={0.6}
                    style={{
                      backgroundColor: "black",
                      borderRadius: 8,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 24,
                        }}
                      >
                        {transferShipment.id}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: "white",
                        }}
                      >
                        Assigned:{" "}
                        {DateTime.fromISO(
                          transferShipment.createdAt,
                        ).toLocaleString(DateTime.DATETIME_SHORT)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </ScrollView>
  )
}
