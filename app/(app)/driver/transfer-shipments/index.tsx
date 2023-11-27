import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { DateTime } from "luxon"
import { Text, TouchableOpacity, View } from "react-native"

import { getTransferShipments } from "../../../../utils/api"

export default function TransferShipmentsPage() {
  const { status, data, error } = useQuery({
    queryKey: ["getTransferShipments"],
    queryFn: () => getTransferShipments(),
  })

  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      {status === "pending" && <Text>Loading ...</Text>}
      {status === "error" && <Text>Error {error.message}</Text>}
      {status === "success" && (
        <View>
          <>
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
                {data.transferShipments.map((transferShipment) => (
                  <View key={transferShipment.id}>
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
          </>
        </View>
      )}
    </View>
  )
}
