import { Image, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";

export default function ImageScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();

  const fullUri = FileSystem.documentDirectory + "captures/" + name;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen options={{ title: "Media" }} />

      <Image
        source={{ uri: fullUri }}
        style={{ flex: 1, width: "100%", height: "100%" }}
      />
    </View>
  );
}
