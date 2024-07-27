import { CameraPermissionRequiredView } from "@/components/camera-permission/main-component"
import { CameraView } from "expo-camera"
import { useState } from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import QrCode from "phosphor-react-native/src/icons/QrCode"
import CameraRotate from "phosphor-react-native/src/icons/CameraRotate"
import XCircle from "phosphor-react-native/src/icons/XCircle"
import PhosphorIconPackage from "phosphor-react-native/src/icons/Package"
import { useLocalSearchParams, Link } from "expo-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import type { Package } from "@/server/db/entities"
import type { ShipmentPackageStatus } from "@/utils/constants"
import { AntDesign, Entypo } from "@expo/vector-icons"
import { ProgressDialog } from "react-native-simple-dialogs"
import {
  approveForwarderTransferShipmentPackageById,
  getForwarderTransferShipmentPackages,
} from "@/api/shipment/transfer/fowarder"

type PackageWithDetails = Package & {
  shipmentPackageStatus: ShipmentPackageStatus
  shipmentPackageIsDriverApproved: boolean
}

function filterBySearchTerm(items: PackageWithDetails[], searchTerm: string) {
  return items.filter((item) =>
    item.id.toString().toUpperCase().includes(searchTerm.toUpperCase()),
  )
}

function GoodToGoMessage() {
  return (
    <View
      style={{
        backgroundColor: "#22c55e",
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        flexDirection: "row",
        columnGap: 8,
        alignItems: "center",
      }}
    >
      <AntDesign name="checkcircle" size={24} color="white" />
      <Text
        style={{
          fontFamily: "Roboto-Medium",
          fontSize: 16,
          color: "white",
        }}
      >
        All Packages Checked. Good to Go!
      </Text>
    </View>
  )
}

function SearchView(props: {
  searchTerm: string
  onChangeSearchTerm: (newSearchTerm: string) => void
  onShowScanner: () => void
}) {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { status, data, error, fetchStatus, refetch } = useQuery({
    queryKey: ["getForwarderTransferShipmentPackages", id],
    queryFn: () => getForwarderTransferShipmentPackages(Number(id)),
  })

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
      }}
    >
      {status === "success" &&
        data.packages.every(
          (_package) => _package.shipmentPackageIsDriverApproved,
        ) && <GoodToGoMessage />}
      <View
        style={{
          flexDirection: "row",
          columnGap: 8,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#ccc",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}
          placeholder="Enter a package ID ..."
          value={props.searchTerm}
          onChangeText={(text) => props.onChangeSearchTerm(text)}
        />
        <TouchableOpacity
          onPress={() => props.onShowScanner()}
          style={{
            borderRadius: 6,
            backgroundColor: "#262626",
          }}
        >
          <QrCode size={48} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView
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
            {filterBySearchTerm(data.packages, props.searchTerm).length ===
            0 ? (
              <Text
                style={{
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                No results found.
              </Text>
            ) : (
              <>
                {filterBySearchTerm(data.packages, props.searchTerm).map(
                  (_package) => (
                    <Link
                      asChild
                      key={_package.id}
                      href={{
                        pathname:
                          "/(app)/driver/transfer/forwarder/[id]/package/[packageId]/details",
                        params: {
                          id,
                          packageId: _package.id,
                        },
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.6}
                        style={{
                          backgroundColor: "#6b7280",
                          paddingVertical: 12,
                          paddingHorizontal: 8,
                          borderRadius: 6,
                          marginTop: 12,
                          flexDirection: "row",
                          columnGap: 6,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            columnGap: 6,
                            alignItems: "center",
                          }}
                        >
                          <PhosphorIconPackage size={32} color="white" />
                          <Text
                            style={{
                              color: "white",
                              fontFamily: "Roboto-Medium",
                              fontSize: 16,
                            }}
                          >
                            {_package.id}
                          </Text>
                        </View>
                        {_package.shipmentPackageIsDriverApproved ? (
                          <AntDesign
                            name="checksquare"
                            size={24}
                            color="#22c55e"
                          />
                        ) : (
                          <Entypo name="cross" size={24} color="#f87171" />
                        )}
                      </TouchableOpacity>
                    </Link>
                  ),
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

function ScanMainView(props: {
  onBarcodeScanned: (newSearchTerm: string) => void
  onHideScanner: () => void
}) {
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(false)
  const { id } = useLocalSearchParams<{ id: string }>()
  const {
    status,
    data: packages,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getForwarderTransferShipmentPackages", id],
    queryFn: () => getForwarderTransferShipmentPackages(Number(id)),
  })

  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: async (input: { packageId: string }) => {
      await approveForwarderTransferShipmentPackageById({
        shipmentId: Number(id),
        packageId: input.packageId,
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getForwarderTransferShipmentPackages", id],
      })
      queryClient.invalidateQueries({
        queryKey: [
          "getForwarderTransferShipmentPackageById",
          id,
          variables.packageId,
        ],
      })
    },
  })

  if (status === "pending") return <LoadingView />
  if (status === "error")
    return (
      <ErrorView
        message={error.message}
        onRetry={() => {
          refetch()
        }}
      />
    )

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ProgressDialog
        title="Loading"
        activityIndicatorColor="#3498db"
        visible={isPending}
        activityIndicatorSize="large"
        animationType="fade"
        message="Please wait."
        dialogStyle={{
          borderRadius: 20,
          alignItems: "center",
          maxWidth: 250,
          alignSelf: "center",
          justifyContent: "center",
        }}
      />

      <CameraView
        style={{
          flex: 1,
          position: "relative",
        }}
        facing={isUsingFrontCamera ? "front" : "back"}
        onBarcodeScanned={({ data }) => {
          props.onBarcodeScanned(data)
          if (packages.packages.some((_package) => _package.id === data)) {
            mutate({
              packageId: data,
            })
          }
        }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <TouchableOpacity
          onPress={() => {
            props.onHideScanner()
          }}
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
          }}
        >
          <View
            style={{
              padding: 6,
              borderRadius: 50,
              backgroundColor: "white",
            }}
          >
            <XCircle size={32} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsUsingFrontCamera((prev) => !prev)
          }}
          style={{
            position: "absolute",
            bottom: 24,
            right: 24,
          }}
        >
          <View
            style={{
              padding: 6,
              borderRadius: 50,
              backgroundColor: "white",
            }}
          >
            <CameraRotate size={32} />
          </View>
        </TouchableOpacity>
      </CameraView>
    </View>
  )
}

function ScanView(props: {
  onBarcodeScanned: (newSearchTerm: string) => void
  onHideScanner: () => void
}) {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CameraPermissionRequiredView>
        <ScanMainView
          onHideScanner={props.onHideScanner}
          onBarcodeScanned={props.onBarcodeScanned}
        />
      </CameraPermissionRequiredView>
    </View>
  )
}

export default function SearchModal() {
  const [isScanning, setIsScanning] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {isScanning ? (
        <ScanView
          onBarcodeScanned={() => {
            setIsScanning(false)
          }}
          onHideScanner={() => {
            setIsScanning(false)
          }}
        />
      ) : (
        <SearchView
          searchTerm={searchTerm}
          onChangeSearchTerm={(newSearchTerm) => {
            setSearchTerm(newSearchTerm)
          }}
          onShowScanner={() => {
            setIsScanning(true)
          }}
        />
      )}
    </View>
  )
}
