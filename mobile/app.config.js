export default {
  "expo": {
    "name": "4Ps-Nexus",
    "slug": "mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "package": "com.lynard.mobile",
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ],
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "splash": {
      "backgroundColor": "#10b981",
      "resizeMode": "contain"
    },
    "plugins": [
      "expo-secure-store",
      "expo-font",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow 4Ps-Nexus to use your location."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "7b4986ac-30b5-4f8a-b93d-5d29388a1911"
      }
    }
  }
}
