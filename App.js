import React, { useState, useEffect } from 'react';
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

    console.log('Background location updated:', locationData);
  }
});

export default function App() {
  const [locationTracking, setLocationTracking] = useState(false);

  // Restore GPS state from Firebase on mount
  useEffect(() => {
    const gpsStateRef = ref(database, 'driverGPSEnabled');
    const unsubscribe = onValue(gpsStateRef, async (snapshot) => {
      const isEnabled = snapshot.val();
      if (isEnabled && !locationTracking) {
        await startBackgroundLocation();
      } else if (!isEnabled && locationTracking) {
        await stopBackgroundLocation();
      }
    });

    return () => unsubscribe();
  }, [locationTracking]);

  const startBackgroundLocation = async () => {
    try {
      // Request permissions
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        console.error('Foreground permission not granted');
        return;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        console.error('Background permission not granted');
        return;
      }

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 60000, // Update every 60 seconds
        distanceInterval: 10, // Or every 10 meters
        foregroundService: {
          notificationTitle: 'TNZ GPS Aktywny',
          notificationBody: 'Lokalizacja jest śledzona w tle',
          notificationColor: '#667eea',
        },
      });

      setLocationTracking(true);
      console.log('Background location started');
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
      setLocationTracking(false);
      console.log('Background location stopped');
    } catch (error) {
      console.error('Error stopping background location:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
