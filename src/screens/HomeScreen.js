import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Switch,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { database, ref, onValue, set } from "../config/firebase";
import { scheduleSchool904 } from "../config/schedules";

const LOCATION_TASK_NAME = "background-location-task";
const IS_WEB = Platform.OS === "web";

const DISPATCHER_PHONE = "123456789";

export default function HomeScreen() {
  const [savedSchedules, setSavedSchedules] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedCourses, setCompletedCourses] = useState({});
  const [expandedCompleted, setExpandedCompleted] = useState({});
  const [locationTracking, setLocationTracking] = useState(false);
  const webLocationInterval = useRef(null);

  useEffect(() => {
    const schedulesRef = ref(database, "savedSchedules");
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSavedSchedules(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const callDispatcher = () => {
    Linking.openURL(`tel:${DISPATCHER_PHONE}`);
  };

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

        // Simulate location updates every 60 seconds
        webLocationInterval.current = setInterval(async () => {
          // Add small random offset to simulate movement
          const updatedLocation = {
            latitude: mockLocation.latitude + (Math.random() - 0.5) * 0.001,
            longitude: mockLocation.longitude + (Math.random() - 0.5) * 0.001,
            accuracy: 10 + Math.random() * 5,
            timestamp: Date.now(),
          };
          await set(locationRef, updatedLocation);
        }, 60000);

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
        timeInterval: 60000,
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

  const getNextDeparture = () => {
    const now = currentTime;
    const departures = Object.keys(scheduleSchool904);
    let nextDeparture = null;
    let minDiff = Infinity;

    departures.forEach((time) => {
      const timeMatch = time.match(/^(\d{2}):(\d{2})/);
      if (!timeMatch) return;

      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);

      const departure = new Date(now);
      departure.setHours(hours, minutes, 0, 0);

      const timeDiff = departure.getTime() - now.getTime();
      const minutesDiff = timeDiff / 1000 / 60;

      if (timeDiff > 0 && minutesDiff <= 30 && timeDiff < minDiff) {
        minDiff = timeDiff;
        nextDeparture = time;
      }
    });

    return nextDeparture;
  };

  const getMinutesToDeparture = (departureTime) => {
    const timeMatch = departureTime.match(/^(\d{2}):(\d{2})/);
    if (!timeMatch) return null;

    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);

    const now = currentTime;
    const departure = new Date(now);
    departure.setHours(hours, minutes, 0, 0);

    const timeDiff = departure.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);

    return minutesDiff;
  };

  const isCourseCompleted = (departureTime) => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 17) {
      return false;
    }

    // Check if manually completed
    if (completedCourses[departureTime]?.completed) {
      return true;
    }

    // Auto-complete if more than 10 minutes past departure
    const minutesToDeparture = getMinutesToDeparture(departureTime);
    const autoCompleted = minutesToDeparture !== null && minutesToDeparture < -10;

    // Store auto-completed courses (but mark as NOT manual)
    if (autoCompleted && !completedCourses[departureTime]) {
      setCompletedCourses(prev => ({
        ...prev,
        [departureTime]: { completed: true, manual: false }
      }));
    }

    return autoCompleted;
  };

  const markAsCompleted = (time) => {
    // Mark as completed manually
    setCompletedCourses({
      ...completedCourses,
      [time]: { completed: true, manual: true }
    });
  };

  const markAsIncomplete = (time) => {
    // Only allow unmarking if it was marked manually
    if (completedCourses[time]?.manual) {
      const updated = { ...completedCourses };
      delete updated[time];
      setCompletedCourses(updated);
    }
  };

  const toggleExpandCompleted = (time) => {
    setExpandedCompleted({
      ...expandedCompleted,
      [time]: !expandedCompleted[time],
    });
  };

  const getScheduleKey = (time) => {
    const timeOnly = time.match(/^(\d{2}):(\d{2})/)?.[0] || "";
    const timeFormatted = timeOnly.replace(":", "_");
    return Object.keys(savedSchedules).find((key) =>
      key.includes(timeFormatted)
    );
  };

  const nextDeparture = getNextDeparture();

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#6E64C6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>🚌 Panel Kierowcy</Text>
            <Text style={styles.headerSubtitle}>
              Transport Na Żądanie - Linia 904
            </Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={callDispatcher}
              activeOpacity={0.7}
            >
              <Text style={styles.callBtnText}>📞 Dyspozytor</Text>
            </TouchableOpacity>

            <View style={styles.locationToggleWrapper}>
              <Text style={styles.locationLabel}>📍 Online</Text>
              <Switch
                value={locationTracking}
                onValueChange={toggleGPS}
                trackColor={{ false: "rgba(255,255,255,0.3)", true: "#22c55e" }}
                thumbColor="#ffffff"
                ios_backgroundColor="rgba(255,255,255,0.3)"
              />
            </View>
          </View>
        </View>

        {/* Content - Departures List */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {Object.entries(scheduleSchool904).map(([time, stopTimes]) => {
            const scheduleKey = getScheduleKey(time);
            const selectedStops = scheduleKey
              ? savedSchedules[scheduleKey]
              : {};
            const requestedStops = Object.keys(selectedStops).filter(
              (stop) => selectedStops[stop]
            );

            const timeOnly = time.match(/^(\d{2}):(\d{2})/)?.[0] || "";
            const isNext = nextDeparture === time;
            const isCompleted = isCourseCompleted(time);
            const allStopNames = Object.keys(stopTimes);
            const orderedRequestedStops = allStopNames.filter((x) =>
              requestedStops.includes(x)
            );

            return (
              <View
                key={time}
                style={[
                  styles.departureCard,
                  isNext && !isCompleted && styles.nextDeparture,
                  isCompleted && styles.completedDeparture,
                ]}
              >
                {isNext && !isCompleted && (
                  <View style={styles.nextBadge}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.nextBadgeText}>
                      Najbliższy odjazd (za {getMinutesToDeparture(time)} min)
                    </Text>
                  </View>
                )}

                {isCompleted ? (
                  <TouchableOpacity
                    onPress={() => toggleExpandCompleted(time)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.completedHeader}>
                      <View style={styles.completedCheckmarkCircle}>
                        <Text style={styles.completedCheckmark}>✓</Text>
                      </View>
                      <Text style={styles.completedTime}>{timeOnly}</Text>
                      <Text style={styles.completedCount}>
                        {requestedStops.length}{" "}
                        {requestedStops.length === 1
                          ? "przystanek"
                          : requestedStops.length >= 2 &&
                            requestedStops.length <= 4
                          ? "przystanki"
                          : "przystanków"}
                      </Text>
                      <Text style={styles.expandIcon}>
                        {expandedCompleted[time] ? "▼" : "▶"}
                      </Text>
                    </View>

                    {expandedCompleted[time] && (
                      <>
                        <View style={styles.stopsList}>
                          {orderedRequestedStops.map((stop, index) => {
                            const stopTime = stopTimes[stop] || "--:--";
                            return (
                              <View key={index} style={styles.stopItem}>
                                <View
                                  style={[
                                    styles.stopNumber,
                                    styles.completedStopNumber,
                                  ]}
                                >
                                  <Text style={styles.stopNumberText}>
                                    {index + 1}
                                  </Text>
                                </View>
                                <Text
                                  style={styles.stopName}
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                >
                                  {stop}
                                </Text>
                                <Text
                                  style={[
                                    styles.stopTime,
                                    styles.completedStopTime,
                                  ]}
                                >
                                  {stopTime}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                        {completedCourses[time]?.manual && (
                          <View style={styles.completeBtnContainer}>
                            <TouchableOpacity
                              style={[styles.completeBtn, styles.incompleteBtn]}
                              onPress={() => markAsIncomplete(time)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.completeBtnText}>
                                ↺ Cofnij
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <>
                    <View style={styles.departureHeader}>
                      <View style={styles.departureTimeWrapper}>
                        <Text style={styles.departureTime}>{timeOnly}</Text>
                        {time !== timeOnly && (
                          <Text style={styles.departureSubtitle}>
                            {time.replace(timeOnly, "").trim()}
                          </Text>
                        )}
                      </View>
                      <Text style={styles.departureCount}>
                        {requestedStops.length}{" "}
                        {requestedStops.length === 1
                          ? "przystanek"
                          : requestedStops.length >= 2 &&
                            requestedStops.length <= 4
                          ? "przystanki"
                          : "przystanków"}
                      </Text>
                    </View>

                    <View style={styles.stopsList}>
                      {requestedStops.length === 0 ? (
                        <View style={styles.noStopsContainer}>
                          <View style={styles.noStopsIcon}>
                            <Text style={styles.noStopsIconText}>📍</Text>
                          </View>
                          <Text style={styles.noStopsText}>
                            Brak zamówionych przystanków
                          </Text>
                        </View>
                      ) : (
                        orderedRequestedStops.map((stop, index) => {
                          const stopTime = stopTimes[stop] || "--:--";
                          return (
                            <View key={index} style={styles.stopItem}>
                              <View style={styles.stopNumber}>
                                <Text style={styles.stopNumberText}>
                                  {index + 1}
                                </Text>
                              </View>
                              <Text
                                style={styles.stopName}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                {stop}
                              </Text>
                              <Text style={styles.stopTime}>{stopTime}</Text>
                            </View>
                          );
                        })
                      )}
                    </View>

                    {getMinutesToDeparture(time) <= 0 && (
                      <View style={styles.completeBtnContainer}>
                        <TouchableOpacity
                          style={[
                            styles.completeBtn,
                            currentTime.getHours() >= 17 &&
                              styles.completeBtnDisabled,
                          ]}
                          onPress={() => markAsCompleted(time)}
                          disabled={currentTime.getHours() >= 17}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.completeBtnText}>
                            ✓ Oznacz jako wykonany
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            );
          })}

          {Object.values(savedSchedules).every((stops) =>
            Object.values(stops).every((v) => !v)
          ) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Brak zamówionych kursów</Text>
              <Text style={styles.emptySubtext}>
                Wszystkie kursy pojawią się tutaj
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#6E64C6",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    maxWidth: 600,
    minWidth: 360,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 20,
  },
  header: {
    backgroundColor: "#6E64C6",
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 10,
    minWidth: 140,
  },
  callBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
  },
  callBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  locationToggleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: "space-between",
  },
  locationLabel: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    padding: 20,
  },
  departureCard: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  nextDeparture: {
    borderColor: "#ff6b35",
    borderWidth: 3,
    backgroundColor: "#fff5f3",
    shadowColor: "#ff6b35",
    shadowOpacity: 0.25,
  },
  completedDeparture: {
    borderColor: "#16a34a",
    borderWidth: 3,
    backgroundColor: "#f0fdf4",
    opacity: 0.7,
  },
  nextBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff6b35",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 15,
    gap: 10,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
  nextBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  departureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: "#6E64C6",
  },
  departureTimeWrapper: {
    flexDirection: "column",
    gap: 4,
  },
  departureTime: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  departureSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    whiteSpace: "nowrap",
  },
  departureCount: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  completedHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: "#16a34a",
    gap: 15,
  },
  completedCheckmarkCircle: {
    width: 32,
    height: 32,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  completedCheckmark: {
    fontSize: 18,
    color: "#16a34a",
    fontWeight: "bold",
  },
  completedTime: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  completedCount: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.95)",
    flex: 1,
  },
  expandIcon: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  stopsList: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 10,
    gap: 15,
  },
  stopNumber: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: "#6E64C6",
    justifyContent: "center",
    alignItems: "center",
  },
  stopNumberText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  stopName: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  stopTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#667eea",
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completedStopNumber: {
    backgroundColor: "#16a34a",
  },
  completedStopTime: {
    color: "#16a34a",
    backgroundColor: "rgba(22, 163, 74, 0.1)",
  },
  noStopsContainer: {
    alignItems: "center",
    padding: 30,
    marginVertical: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  noStopsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6E64C6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#6E64C6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  noStopsIconText: {
    fontSize: 28,
  },
  noStopsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  completeBtnContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  completeBtn: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  completeBtnDisabled: {
    backgroundColor: "#9ca3af",
    opacity: 0.6,
  },
  incompleteBtn: {
    backgroundColor: "#3b82f6",
  },
  completeBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: "#999",
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
  },
});
