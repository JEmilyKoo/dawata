import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";

export default function ModalScreen() {
  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center bg-blue-500">
        <Text className="text-white text-lg font-bold text-red-100">
          Hello, Tailwind!
        </Text>
      </View>

      <Text className="text-lg font-bold mt-4">Modal</Text>
      <View className="my-8 h-0.5 w-4/5 bg-gray-300 dark:bg-gray-600" />
      <EditScreenInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
