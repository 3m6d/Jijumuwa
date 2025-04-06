import { ElderlyRoutesConfig } from "@/types/navigation";

export const elderlyRoutes: ElderlyRoutesConfig = {
  dashboard: {
    name: "dashboard",
    title: "Dashboard",
    icon: "dashboard",
    headerShown: true,
    hideTabBar: false,
  },
  two: {
    name: "two",
    title: "Chatbot",
    icon: "comments",
    headerShown: true,
    hideTabBar: false,
  },
  three: {
    name: "three",
    title: "Music",
    icon: "music",
    headerShown: true,
    hideTabBar: false,
  },
};