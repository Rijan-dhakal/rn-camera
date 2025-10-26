import { Alert, Image, StyleSheet, View } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import { MaterialIcons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { getMediaType } from "../utils/media";

export default function ImageScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();

  const fullUri = FileSystem.documentDirectory + "captures/" + name;
  const imageOrVideo = getMediaType(name);

  const player = useVideoPlayer(
    imageOrVideo === "video" ? fullUri : "",
    (player) => {
      if (imageOrVideo === "video") {
        player.play();
      }
    }
  );

  const deleteImage = async () => {
    Alert.alert("Delete File", "Do you want to delete this file?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await FileSystem.deleteAsync(fullUri);
          router.back();
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: "Media",
          headerRight: () => (
            <View style={styles.iconContainer}>
              <MaterialIcons
                name="delete"
                size={26}
                color="crimson"
                onPress={deleteImage}
              />
              <MaterialIcons name="save" size={26} color="black" />
            </View>
          ),
        }}
      />
      {imageOrVideo === "video" ? (
        <VideoView
          player={player}
          style={{ flex: 1, width: "100%", height: "100%" }}
          nativeControls={true}
        />
      ) : (
        <Image
          source={{ uri: fullUri }}
          style={{ flex: 1, width: "100%", height: "100%" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    gap: 40,
  },
});
