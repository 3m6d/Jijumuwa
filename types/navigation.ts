import { FontAwesome } from "@expo/vector-icons";

export type TabScreenConfig = {
  name: string;
  title: string;
  icon: keyof typeof FontAwesome.glyphMap;
  headerShown?: boolean;
  hideTabBar?: boolean;
};

export type TabRoutesConfig = {
  index: TabScreenConfig;
  register: TabScreenConfig;
  login: TabScreenConfig;
  // forgot-password : TabScreenConfig;
};

// Create a proper type for the elderly route configuration
export type ElderlyScreenConfig = {
  name: string;
  title: string;
  icon: keyof typeof FontAwesome.glyphMap;
  headerShown?: boolean;
  hideTabBar?: boolean;
};

// Fix the ElderlyRoutesConfig to use ElderlyScreenConfig
export type ElderlyRoutesConfig = {
  dashboard: ElderlyScreenConfig;
  two: ElderlyScreenConfig;
  three: ElderlyScreenConfig;
};

export type CaretakerScreenConfig = {
  name: string;
  title: string;
  icon: keyof typeof FontAwesome.glyphMap;
  headerShown?: boolean;
  hideTabBar?: boolean;
};

export type CaretakerRoutesConfig = {
  dashboard: CaretakerScreenConfig;
  profile: CaretakerScreenConfig;
};

