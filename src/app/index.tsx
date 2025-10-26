import { Link, useFocusEffect } from "expo-router";
import { View, Pressable, StyleSheet, FlatList, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import { getMediaType, mediaType } from "../utils/media";
import { Text } from "react-native";

type Media = {
  name: string;
  uri: string;
  type: mediaType;
};

const MediaItem = function ({ item }: { item: Media }) {
  return (
    <Link href={`/${item.name}`} asChild>
      <Pressable style={{ maxWidth: "33.33%", position: "relative" }}>
        {item.type === "image" ? (
          <Image
            source={{ uri: item.uri }}
            style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 2 }}
            resizeMode="cover"
          />
        ) : (
          <>
            <Image
              source={{ uri: item.uri }}
              style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 2 }}
              resizeMode="cover"
            />
            <View style={styles.videoIconContainer} pointerEvents="none">
              <MaterialIcons
                name="play-circle-filled"
                size={44}
                color="white"
              />
            </View>
          </>
        )}
      </Pressable>
    </Link>
  );
};

export default function HomeScreen() {
  const [files, setFiles] = useState<Media[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFiles();
    }, [])
  );

  const loadFiles = async () => {
    if (!FileSystem.documentDirectory) {
      return;
    }

    const capturesDir = FileSystem.documentDirectory + "captures/";

    const dirInfo = await FileSystem.getInfoAsync(capturesDir);
    if (!dirInfo.exists) {
      console.log("No captures directory yet");
      return;
    }

    const capturedFiles = await FileSystem.readDirectoryAsync(capturesDir);

    setFiles(
      capturedFiles.map((file) => ({
        name: file,
        uri: capturesDir + file,
        type: getMediaType(file),
      }))
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        numColumns={3}
        keyExtractor={(item) => item.uri}
        contentContainerStyle={{ gap: 1 }}
        columnWrapperStyle={{ gap: 1 }}
        renderItem={({ item }) => <MediaItem item={item} />}
      />
      <Link href="./camera" asChild>
        <Pressable style={styles.floatingButton}>
          <MaterialIcons name="photo-camera" size={30} color="white" />
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  floatingButton: {
    backgroundColor: "royalblue",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  videoIconContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
  },
  videoIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -22 }, { translateY: -22 }],
    opacity: 0.9,
  },
});
