import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Switch,
  StatusBar,
} from 'react-native';
import { database, ref, onValue, set } from '../config/firebase';
import { scheduleSchool904 } from '../config/schedules';

const DISPATCHER_PHONE = '123456789';

export default function HomeScreen() {
  const [savedSchedules, setSavedSchedules] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedCourses, setCompletedCourses] = useState({});
  const [expandedCompleted, setExpandedCompleted] = useState({});
  const [locationTracking, setLocationTracking] = useState(false);

  // Listen to saved schedules from Firebase
  useEffect(() => {
    const schedulesRef = ref(database, 'savedSchedules');
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSavedSchedules(data);
    });

    return () => unsubscribe();
  }, []);

  // Restore GPS tracking state from Firebase
  useEffect(() => {
    const gpsStateRef = ref(database, 'driverGPSEnabled');
    const unsubscribe = onValue(gpsStateRef, (snapshot) => {
      const isEnabled = snapshot.val();
      setLocationTracking(isEnabled === true);
    });

    return () => unsubscribe();
  }, []);

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const callDispatcher = () => {
    Linking.openURL(`tel:${DISPATCHER_PHONE}`);
  };

  const toggleGPS = async (value) => {
    const gpsStateRef = ref(database, 'driverGPSEnabled');
    await set(gpsStateRef, value);
    setLocationTracking(value);
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

    if (completedCourses[departureTime]) {
      return true;
    }

    const minutesToDeparture = getMinutesToDeparture(departureTime);
    return minutesToDeparture !== null && minutesToDeparture < -10;
  };

  const markAsCompleted = (time) => {
    setCompletedCourses({ ...completedCourses, [time]: true });
  };

  const toggleExpandCompleted = (time) => {
    setExpandedCompleted({
      ...expandedCompleted,
      [time]: !expandedCompleted[time],
    });
  };

  const getScheduleKey = (time) => {
    const timeOnly = time.match(/^(\d{2}):(\d{2})/)?.[0] || '';
    const timeFormatted = timeOnly.replace(':', '_');
    return Object.keys(savedSchedules).find((key) => key.includes(timeFormatted));
  };

  const nextDeparture = getNextDeparture();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🚌 Panel Kierowcy</Text>
          <Text style={styles.headerSubtitle}>Transport Na Żądanie - Linia 904</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.callBtn} onPress={callDispatcher}>
            <Text style={styles.callBtnText}>📞 Dyspozytor</Text>
          </TouchableOpacity>

          <View style={styles.locationToggle}>
            <Text style={styles.locationLabel}>📍 GPS</Text>
            <Switch
              value={locationTracking}
              onValueChange={toggleGPS}
              trackColor={{ false: '#ccc', true: '#22c55e' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </View>

      {/* Content - Departures List */}
      <ScrollView style={styles.content}>
        {Object.entries(scheduleSchool904).map(([time, stopTimes]) => {
          const scheduleKey = getScheduleKey(time);
          const selectedStops = scheduleKey ? savedSchedules[scheduleKey] : {};
          const requestedStops = Object.keys(selectedStops).filter(
            (stop) => selectedStops[stop]
          );

          const timeOnly = time.match(/^(\d{2}):(\d{2})/)?.[0] || '';
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
                <TouchableOpacity onPress={() => toggleExpandCompleted(time)}>
                  <View style={styles.completedHeader}>
                    <Text style={styles.completedCheckmark}>✓</Text>
                    <Text style={styles.completedTime}>{timeOnly}</Text>
                    <Text style={styles.completedCount}>
                      {requestedStops.length}{' '}
                      {requestedStops.length === 1
                        ? 'przystanek'
                        : requestedStops.length >= 2 && requestedStops.length <= 4
                        ? 'przystanki'
                        : 'przystanków'}
                    </Text>
                    <Text style={styles.expandIcon}>
                      {expandedCompleted[time] ? '▼' : '▶'}
                    </Text>
                  </View>

                  {expandedCompleted[time] && (
                    <View style={styles.stopsList}>
                      {orderedRequestedStops.map((stop, index) => {
                        const stopTime = stopTimes[stop] || '--:--';
                        return (
                          <View key={index} style={styles.stopItem}>
                            <View style={styles.stopNumber}>
                              <Text style={styles.stopNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stopName}>{stop}</Text>
                            <Text style={styles.stopTime}>{stopTime}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.departureHeader}>
                    <Text style={styles.departureTime}>{timeOnly}</Text>
                    <Text style={styles.departureCount}>
                      {requestedStops.length}{' '}
                      {requestedStops.length === 1
                        ? 'przystanek'
                        : requestedStops.length >= 2 && requestedStops.length <= 4
                        ? 'przystanki'
                        : 'przystanków'}
                    </Text>
                  </View>

                  <View style={styles.stopsList}>
                    {requestedStops.length === 0 ? (
                      <Text style={styles.noStopsMsg}>Brak zamówionych przystanków</Text>
                    ) : (
                      orderedRequestedStops.map((stop, index) => {
                        const stopTime = stopTimes[stop] || '--:--';
                        return (
                          <View key={index} style={styles.stopItem}>
                            <View style={styles.stopNumber}>
                              <Text style={styles.stopNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stopName}>{stop}</Text>
                            <Text style={styles.stopTime}>{stopTime}</Text>
                          </View>
                        );
                      })
                    )}
                  </View>

                  {requestedStops.length > 0 &&
                    (isNext || getMinutesToDeparture(time) < 0) && (
                      <TouchableOpacity
                        style={[
                          styles.completeBtn,
                          currentTime.getHours() >= 17 && styles.completeBtnDisabled,
                        ]}
                        onPress={() => markAsCompleted(time)}
                        disabled={currentTime.getHours() >= 17}
                      >
                        <Text style={styles.completeBtnText}>✓ Oznacz jako wykonany</Text>
                      </TouchableOpacity>
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
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  callBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 140,
  },
  callBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  locationLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  departureCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nextDeparture: {
    borderColor: '#ff5722',
    borderWidth: 3,
    backgroundColor: '#fff8f6',
  },
  completedDeparture: {
    borderColor: '#16a34a',
    borderWidth: 3,
    backgroundColor: '#f0fdf4',
    opacity: 0.85,
  },
  nextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff5722',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    gap: 10,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  nextBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  departureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  departureTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
  },
  departureCount: {
    fontSize: 14,
    color: '#666',
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 15,
  },
  completedCheckmark: {
    fontSize: 24,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  completedTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
    flex: 1,
  },
  completedCount: {
    fontSize: 14,
    color: '#666',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
  },
  stopsList: {
    gap: 10,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    gap: 12,
  },
  stopNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stopName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  stopTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
  },
  noStopsMsg: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    padding: 20,
  },
  completeBtn: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  completeBtnDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.5,
  },
  completeBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
