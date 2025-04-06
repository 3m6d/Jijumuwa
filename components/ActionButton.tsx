import { TouchableOpacity } from "react-native";
import { Text } from "@/components/Themed";
import { useRouter } from "expo-router";

interface ActionButtonProps {
  onPress?: () => void;
  text: string;
}

export const ActionButton = ({ onPress, text }: ActionButtonProps) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.replace("../(elderly)/two");
    }
  };

  return (
    <TouchableOpacity
      className="bg-yellow-400 py-4 mx-4 px-10 rounded-full z-10 mt-10"
      onPress={handlePress}
    >
      <Text className="text-2xl text-center font-extrabold text-gray-800">
        {text}
      </Text>
    </TouchableOpacity>
  );
};
