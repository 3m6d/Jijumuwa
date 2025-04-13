import React from "react";
import { Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { caretakerRoutes } from "@/config/caretakerRoutes";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme ?? "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[currentTheme].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      {Object.entries(caretakerRoutes).map(([key, route]) => (
        <Tabs.Screen
          key={key}
          name={route.name}
          options={{
            title: route.title,
            headerShown: route.headerShown,
            tabBarIcon: ({ color }) => (
              <TabBarIcon name={route.icon} color={color} />
            ),
            ...(route.hideTabBar && {
              tabBarStyle: {
                display: "none",
              },
            }),
          }}
        />
      ))}
    </Tabs>
  );
}