import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Gallery" }} />
          <Stack.Screen
            name="camera"
            options={{ headerShown: false, statusBarHidden: true }}
          />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
