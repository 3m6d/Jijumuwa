type ColorScheme = {
  text: string;
  background: string;
  tint: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

type ThemeColors = {
  light: ColorScheme;
  dark: ColorScheme;
};

export const Colors: ThemeColors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: "#2f95dc",
    tabIconDefault: "#ccc",
    tabIconSelected: "#2f95dc",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: "#fff",
    tabIconDefault: "#ccc",
    tabIconSelected: "#fff",
  },
} as const;

export default Colors;
