
import { View } from "@/components/Themed";
import { HeaderImages } from "@/components/HeaderImages";
import { WelcomeText } from "@/components/WelcomeText";
import { ActionButton } from "@/components/ActionButton";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { router } from "expo-router";


export default function elderlyDashboard() {
  return (
    <View className="flex-1 items-center justify-start p-1">
      <BackgroundGradient />
      <HeaderImages />
      <WelcomeText />

      <View className="flex-1 w-full bg-transparent flex-col justify-center items-center">
        <ActionButton
          text="आउनुस्, कुरा गरौँ ।"
          onPress={() => router.replace("/(elderly)/two")}

        />
        <ActionButton
          text="🎶गीत सुनाऊ🎶"
          onPress={() => router.replace("/(elderly)/three")}
          
        />
      </View>
    </View>
  );
}

