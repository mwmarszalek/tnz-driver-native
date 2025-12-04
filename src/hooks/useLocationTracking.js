import { useState, useRef } from "react";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { database, ref, set } from "../config/firebase";
import { LOCATION_TASK_NAME, LOCATION_UPDATE_INTERVAL } from "../constants/app";

const IS_WEB = Platform.OS === "web";

export const useLocationTracking = () => {
  const [locationTracking, setLocationTracking] = useState(false);
  const webLocationInterval = useRef(null);

  const startLocationTracking = async () => {
    try {
      // WEB: Mock GPS simulation
      if (IS_WEB) {
        const mockLocation = {
          latitude: 53.416454,
          longitude: 14.549563,
          accuracy: 10,
          timestamp: Date.now(),
        };

        const locationRef = ref(database, "driverLocation");
        await set(locationRef, mockLocation);

        const gpsStateRef = ref(database, "driverGPSEnabled");
        await set(gpsStateRef, true);

        // Simulate location updates
        webLocationInterval.current = setInterval(async () => {
          const updatedLocation = {
            latitude: mockLocation.latitude + (Math.random() - 0.5) * 0.001,
            longitude: mockLocation.longitude + (Math.random() - 0.5) * 0.001,
            accuracy: 10 + Math.random() * 5,
            timestamp: Date.now(),
          };
          await set(locationRef, updatedLocation);
        }, LOCATION_UPDATE_INTERVAL);

        return;
      }

      // NATIVE: Real GPS
      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        return;
      }

      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== "granted") {
        return;
      }

      // Get and set initial location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        timestamp: Date.now(),
      };

      const locationRef = ref(database, "driverLocation");
      await set(locationRef, locationData);

      // Set GPS enabled in Firebase
      const gpsStateRef = ref(database, "driverGPSEnabled");
      await set(gpsStateRef, true);

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: LOCATION_UPDATE_INTERVAL,
        distanceInterval: 0,
        foregroundService: {
          notificationTitle: "TNZ GPS Aktywny",
          notificationBody: "Lokalizacja jest śledzona w tle",
          notificationColor: "#667eea",
        },
      });
    } catch (error) {
      console.error("Error starting location tracking:", error);
    }
  };

  const stopLocationTracking = async () => {
    try {
      // WEB: Stop mock GPS simulation
      if (IS_WEB) {
        if (webLocationInterval.current) {
          clearInterval(webLocationInterval.current);
          webLocationInterval.current = null;
        }

        const gpsStateRef = ref(database, "driverGPSEnabled");
        await set(gpsStateRef, false);

        const locationRef = ref(database, "driverLocation");
        await set(locationRef, null);

        return;
      }

      // NATIVE: Stop real GPS
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
      );
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      // Clear GPS enabled state
      const gpsStateRef = ref(database, "driverGPSEnabled");
      await set(gpsStateRef, false);

      // Clear location from Firebase
      const locationRef = ref(database, "driverLocation");
      await set(locationRef, null);
    } catch (error) {
      console.error("Error stopping location tracking:", error);
    }
  };

  const toggleGPS = (value) => {
    // Immediately update UI for instant feedback
    setLocationTracking(value);

    // Start GPS operations in background (don't await)
    if (value) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  };

  return {
    locationTracking,
    toggleGPS,
  };
};
