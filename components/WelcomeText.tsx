import { Text, View } from "@/components/Themed";

export const WelcomeText = () => {
  return (
    <View className="items-center justify-center bg-transparent w-full py-2">
      <Text className="text-2xl text-black">नमस्ते</Text>
      <Text className="text-xl text-black">म तपाईंको डिजिटल साथी हुँ।</Text>
    </View>
  );
};
