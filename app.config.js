const IS_DEV = process.env.APP_VARIANT === 'development';

export default {
  "expo": {
    "name": IS_DEV ? "sarathi (DEV)" : "sarathi",
    "slug": "sarathi",
    "version": "1.0.0",
    "orientation": "potrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": IS_DEV ? "com.dipawoli.sarathi.dev" : "com.dipawoli.sarathi",
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ],
      "package":IS_DEV ? "com.dipawoli.sarathi" : "com.dipawoli.sarathi",
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-secure-store",
      [
        "@react-native-voice/voice",
        {
          "microphonePermission": "Allow Sarathi to access the microphone",
          "speechRecognitionPermission": "Allow Sarathi to securely recognize user speech"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "tsconfigPaths": true
    },
    "extra": {
      "router": {
        "origin": false
      },
        "eas": {
            "projectId": "b31d4fd3-bbcf-4345-9b39-9831362e5441"
          }
    }
  }
}
