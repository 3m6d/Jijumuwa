import { View } from "@/components/Themed";
import { Image } from "expo-image";
import { blurhash } from "@/constants";

export const HeaderImages = () => {
  return (
    <View className="justify-center items-center w-full bg-transparent mb-1">
      <Image
        placeholder={blurhash}
        source={require("@/assets/images/header.svg")}
        className="h-40 w-40 z-10"
      />
    </View>
  );
};
