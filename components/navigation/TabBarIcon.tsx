import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color }) => {
  return (
    <FontAwesome
      size={16}
      style={{ marginBottom: -3 }}
      name={name}
      color={color}
    />
  );
};
