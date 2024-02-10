import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { DateTime } from "luxon"
import { Text, TouchableOpacity, View } from "react-native"
import { getDeliveries } from "@/api/delivery"

export default function DeliveriesPage() {
  const { status, data, error } = useQuery({
    queryKey: ["getDeliveries"],
    queryFn: () => getDeliveries(),
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
          {data.deliveries.length === 0 ? (
            <Text
              style={{
                textAlign: "center",
              }}
            >
              No deliveries assigned.
            </Text>
          ) : (
            <>
              {data.deliveries.map((delivery, index) => (
                <View
                  key={delivery.id}
                  style={
                    index === data.deliveries.length - 1
                      ? undefined
                      : {
                          marginBottom: 12,
                        }
                  }
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/(app)/driver/deliveries/[id]/",
                        params: {
                          id: delivery.id,
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
                        {delivery.id}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          color: "white",
                        }}
                      >
                        Assigned:{" "}
                        {DateTime.fromISO(delivery.createdAt).toLocaleString(
                          DateTime.DATETIME_SHORT,
                        )}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>
      )}
    </View>
  )
}
