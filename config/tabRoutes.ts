import { TabRoutesConfig } from "@/types/navigation";

export const tabRoutes: TabRoutesConfig = {
  index: {
    name: "index",
    title: "Welcome",
    icon: "home",
    headerShown: true,
    hideTabBar: false,
  },
  // welcome: {
  //   name: "welcome",
  //   title: "Welcome",
  //   icon: "home",
  //   headerShown: false,
  // },
  register: {
    name: "register",
    title: "Register",
    icon: "user-plus",
    headerShown: false,
    hideTabBar: false,
  },
  login: {
    name: "login",
    title: "Login",
    icon: "sign-in",
    headerShown: false,
    hideTabBar: true,
  },
};