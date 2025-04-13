import React from "react";
import { View } from "@/components/Themed";
import { HeaderImages } from "@/components/HeaderImages";
import { WelcomeText } from "@/components/WelcomeText";
import { ActionButton } from "@/components/ActionButton";
import { BackgroundGradient } from "@/components/BackgroundGradient";
import { router } from "expo-router";
import { logout } from "@/services/auth/authService";  // Make sure the path is correct

export default function ElderlyDashboard() {
  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
          text="🎶भजन सुनाऊ🎶"
          onPress={() => router.replace("/(elderly)/three")}
        />
        <ActionButton
          text="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}
