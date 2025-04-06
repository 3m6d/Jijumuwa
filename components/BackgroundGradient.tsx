import { LinearGradient } from "expo-linear-gradient";

export const BackgroundGradient = () => {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,255)", "#fff", "#ffffd0"]}
      className="absolute flex-1 top-0 left-0 right-0 bottom-0 z-0"
    />
  );
};
