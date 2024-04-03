import {
  RequestCameraPermissionView,
  useCameraPermission,
} from "@/components/camera-permission/main-component"
import { CameraView, PermissionStatus } from "expo-camera/next"
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
import { getForwarderTransferShipmentPackages } from "@/api/shipment/transfer/fowarder"
import { useQuery } from "@tanstack/react-query"
import { LoadingView } from "@/components/loading-view"
import { ErrorView } from "@/components/error-view"
import type { Package } from "@/server/db/entities"

function filterBySearchTerm(items: Package[], searchTerm: string) {
  return items.filter((item) =>
    item.id.toString().toUpperCase().includes(searchTerm.toUpperCase()),
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
                          flexDirection: "row",
                          columnGap: 6,
                          marginTop: 12,
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

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CameraView
        style={{
          flex: 1,
          position: "relative",
        }}
        facing={isUsingFrontCamera ? "front" : "back"}
        onBarcodeScanned={({ data }) => {
          props.onBarcodeScanned(data)
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
  const { permission, requestPermission } = useCameraPermission()

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {permission === null ? (
        <RequestCameraPermissionView
          header="Camera permission is required."
          message="To continue, please allow it in the Settings app."
          requestPermission={() => {
            requestPermission()
          }}
          cancelRequestPermission={() => {
            props.onHideScanner()
          }}
        />
      ) : (
        <>
          {permission.status === PermissionStatus.UNDETERMINED && (
            <RequestCameraPermissionView
              header="Camera permission is required."
              message="To continue, please allow it in the Settings app."
              requestPermission={() => {
                requestPermission()
              }}
              cancelRequestPermission={() => {
                props.onHideScanner()
              }}
            />
          )}
          {permission.status === PermissionStatus.DENIED && (
            <RequestCameraPermissionView
              header="Camera permission has been denied."
              message="This permission is required to use this app. To continue, please allow it in the Settings app."
              requestPermission={() => {
                requestPermission()
              }}
              cancelRequestPermission={() => {
                props.onHideScanner()
              }}
            />
          )}
          {permission.status === PermissionStatus.GRANTED && (
            <ScanMainView
              onHideScanner={props.onHideScanner}
              onBarcodeScanned={props.onBarcodeScanned}
            />
          )}
        </>
      )}
    </View>
  )
}

export function SearchModal() {
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
          onBarcodeScanned={(newSearchTerm) => {
            setSearchTerm(newSearchTerm)
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
