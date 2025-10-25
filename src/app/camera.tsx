import { router } from "expo-router";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const camera = useRef<CameraView>(null);

  const changeFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    const res = await camera.current?.takePictureAsync();
    setPicture(res);
  };

  useEffect(() => {
    if (!permission) {
      requestPermission();
      return;
    }

    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission?.granted) {
    return <ActivityIndicator />;
  }

  if (picture) {
    return (
      <View>
        <Image
          source={{ uri: picture.uri }}
          style={{ height: "100%", width: "100%" }}
        />
        <MaterialIcons
          style={styles.close}
          name="arrow-back"
          color="white"
          onPress={() => {
            setPicture(undefined);
          }}
        />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CameraView ref={camera} style={styles.camera} facing={facing} />

      <View style={styles.footerOverlay} pointerEvents="box-none">
        <View style={styles.footer}>
          <View />

          <MaterialIcons
            name="camera"
            size={44}
            color="white"
            style={styles.recordButton}
            onPress={takePicture}
          />
          <MaterialIcons
            name="flip-camera-android"
            color="white"
            size={24}
            onPress={changeFacing}
          />
        </View>
      </View>
      <MaterialIcons
        style={styles.close}
        name="close"
        color="white"
        onPress={() => router.back()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    height: "100%",
    width: "100%",
  },
  close: {
    fontSize: 30,
    position: "absolute",
    top: 70,
    left: 20,
  },
  footer: {
    padding: 30,
    paddingBottom: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00000099",
  },
  footerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "stretch",
  },
  recordButton: {
    backgroundColor: "#c7c5c5ff",
    borderRadius: 50,
    position: "relative",
    marginLeft: 25,
    fontSize: 55,
  },
});
