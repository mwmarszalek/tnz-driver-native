import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { database, ref, onValue, set } from './src/config/firebase';

// Screens
import HomeScreen from './src/screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Background location task
const LOCATION_TASK_NAME = 'background-location-task';

// Define the background task
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Background location error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const location = locations[0];

    // Update Firebase with new location
    const locationData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: Date.now(),
    };

    const locationRef = ref(database, 'driverLocation');
    set(locationRef, locationData).catch(console.error);
  }
});

export default function App() {
  // Check if location tracking is currently active
  const checkLocationStatus = async () => {
    try {
      return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    } catch (error) {
      return false;
    }
  };

  const startBackgroundLocation = async () => {
    try {
      // Request permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        return;
      }

      // Get initial location immediately
      try {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const locationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          timestamp: Date.now(),
        };

        const locationRef = ref(database, 'driverLocation');
        await set(locationRef, locationData);
      } catch (locationError) {
        // Continue anyway to start background updates
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 60000, // Update every 60 seconds
        distanceInterval: 0, // Disabled - only update based on time
        foregroundService: {
          notificationTitle: 'TNZ GPS Aktywny',
          notificationBody: 'Lokalizacja jest śledzona w tle',
          notificationColor: '#667eea',
        },
      });

    } catch (error) {
      console.error('Error starting background location:', error);
    }
  };

  const stopBackgroundLocation = async () => {
    try {
      const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      if (hasStarted) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      // Clear location from Firebase
      const locationRef = ref(database, 'driverLocation');
      await set(locationRef, null);

    } catch (error) {
      console.error('Error stopping background location:', error);
    }
  };

  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) => 'Panel Kierowcy - 904 - TNŻ'
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Panel Kierowcy - 904 - TNŻ'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
