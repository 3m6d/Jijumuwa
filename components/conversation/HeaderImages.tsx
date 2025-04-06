import { View } from "@/components/Themed";
import { Image } from "expo-image";
import { blurhash } from "@/constants";

export const HeaderImages = () => {
  return (
    <View className="flex flex-row justify-center w-full bg-transparent">
      <Image
        placeholder={blurhash}
        source={require("@/assets/images/header.svg")}
        className="h-20 w-20 z-10"
      />

    </View>
  );
};
