import { Link, useFocusEffect } from "expo-router";
import { View, Pressable, StyleSheet, FlatList, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import * as FileSystem from "expo-file-system/legacy";

type Media = {
  name: string;
  uri: string;
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
        renderItem={({ item }) => (
          <Link href={`/${item.name}`} asChild>
            <Pressable style={{ maxWidth: "33.33%" }}>
              <Image
                source={{ uri: item.uri }}
                style={{ width: "100%", aspectRatio: 3 / 4, borderRadius: 2 }}
              />
            </Pressable>
          </Link>
        )}
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
});
