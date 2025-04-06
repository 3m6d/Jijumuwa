import { withSpring } from "react-native-reanimated";

export const springConfig = {
  damping: 10,
  mass: 1,
  stiffness: 100,
};

export const buttonSpringConfig = {
  damping: 15,
  mass: 1,
  stiffness: 120,
};

export const getSpringAnimation = (value: number) => {
  return withSpring(value, springConfig);
};
