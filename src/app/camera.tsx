import { router } from "expo-router";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  Button,
  Pressable,
} from "react-native";
import {
  CameraCapturedPicture,
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import path from "path";
import * as FileSystem from "expo-file-system/legacy";
import { VideoView, useVideoPlayer } from "expo-video";

export default function CameraScreen() {
  const [videoPermission, requestVideoPermission] = useCameraPermissions();
  const [audioPermission, requestAudioPermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [picture, setPicture] = useState<CameraCapturedPicture>();
  const [video, setVideo] = useState<string | undefined>();
  const camera = useRef<CameraView>(null);
  const [mode, setMode] = useState<CameraMode>("picture");
  const [isRecording, setIsRecording] = useState(false);

  const player = useVideoPlayer(video || "", (player) => {
    if (video) {
      player.loop = true;
      player.play();
    }
  });

  const changeFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (mode === "picture") {
      const res = await camera.current?.takePictureAsync();
      setPicture(res);
    }
  };

  const saveFile = async (uri: string) => {
    const fileName = path.parse(uri).base;
    const capturesDir = FileSystem.documentDirectory + "captures/";

    const dirInfo = await FileSystem.getInfoAsync(capturesDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(capturesDir, { intermediates: true });
    }

    await FileSystem.copyAsync({
      from: uri,
      to: capturesDir + fileName,
    });

    setPicture(undefined);
    router.back();
  };

  const toggleMode = async () => {
    setMode((prev) => (prev === "picture" ? "video" : "picture"));
  };

  const recordVideo = async () => {
    if (!camera.current) return;

    try {
      setIsRecording(true);

      const video = await camera.current.recordAsync({ maxDuration: 60 });

      setIsRecording(false);

      setVideo(video?.uri);
    } catch (error) {
      console.error("Error recording video:", error);
      setIsRecording(false);
    }
  };

  const stopRecord = () => {
    if (!camera.current || !isRecording) return;
    camera.current.stopRecording();
  };

  useEffect(() => {
    // video permission
    if (!videoPermission) {
      requestVideoPermission();
      return;
    }

    if (
      videoPermission &&
      !videoPermission.granted &&
      videoPermission.canAskAgain
    ) {
      requestVideoPermission();
    }

    // audio permission
    if (!audioPermission) {
      requestAudioPermission();
      return;
    }

    if (
      audioPermission &&
      !audioPermission.granted &&
      audioPermission.canAskAgain
    ) {
      requestAudioPermission();
    }
  }, [
    videoPermission,
    requestVideoPermission,
    audioPermission,
    requestAudioPermission,
  ]);

  if (!videoPermission?.granted || !audioPermission?.granted) {
    return <ActivityIndicator />;
  }

  if (picture) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={{ uri: picture.uri }}
          style={{ height: "100%", flex: 1 }}
        />
        <View style={{ padding: 10 }}>
          <Button title="Save" onPress={() => saveFile(picture.uri)} />
        </View>
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

  if (video) {
    return (
      <View style={{ flex: 1 }}>
        <VideoView
          style={{ height: "100%", flex: 1 }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
        <View style={{ padding: 10 }}>
          <Button title="Save" onPress={() => saveFile(video)} />
        </View>
        <MaterialIcons
          style={styles.close}
          name="arrow-back"
          color="white"
          onPress={() => {
            setVideo(undefined);
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
      <CameraView
        ref={camera}
        style={styles.camera}
        facing={facing}
        mode={mode}
      />

      <View style={styles.footerOverlay} pointerEvents="box-none">
        <View style={styles.footer}>
          <Pressable onPress={toggleMode}>
            {mode === "picture" ? (
              <MaterialIcons name="videocam" size={24} color="white" />
            ) : (
              <MaterialIcons name="photo-camera" size={24} color="white" />
            )}
          </Pressable>

          <Pressable>
            {mode === "picture" ? (
              <MaterialIcons
                name="camera"
                size={44}
                color="white"
                style={styles.recordButton}
                onPress={takePicture}
              />
            ) : isRecording ? (
              <MaterialIcons
                name="stop-circle"
                size={60}
                color="red"
                style={styles.recordButton}
                onPress={stopRecord}
              />
            ) : (
              <MaterialIcons
                name="fiber-manual-record"
                size={60}
                color="red"
                style={styles.recordButton}
                onPress={recordVideo}
              />
            )}
          </Pressable>
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
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    bottom: 20,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#00000099",
  },
});
