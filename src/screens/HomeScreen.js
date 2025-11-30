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
  Dimensions,
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

  useEffect(() => {
    const schedulesRef = ref(database, 'savedSchedules');
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSavedSchedules(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const gpsStateRef = ref(database, 'driverGPSEnabled');
    const unsubscribe = onValue(gpsStateRef, (snapshot) => {
      const isEnabled = snapshot.val();
      setLocationTracking(isEnabled === true);
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
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor="#6E64C6" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>🚌 Panel Kierowcy</Text>
          <Text style={styles.headerSubtitle}>Transport Na Żądanie - Linia 904</Text>
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
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#22c55e' }}
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
                            <View style={[styles.stopNumber, styles.completedStopNumber]}>
                              <Text style={styles.stopNumberText}>{index + 1}</Text>
                            </View>
                            <Text style={styles.stopName}>{stop}</Text>
                            <Text style={[styles.stopTime, styles.completedStopTime]}>{stopTime}</Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.departureHeader}>
                    <View style={styles.departureTimeWrapper}>
                      <Text style={styles.departureTime}>{timeOnly}</Text>
                      {time !== timeOnly && (
                        <Text style={styles.departureSubtitle}>
                          {time.replace(timeOnly, '').trim()}
                        </Text>
                      )}
                    </View>
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
                      <View style={styles.completeBtnContainer}>
                        <TouchableOpacity
                          style={[
                            styles.completeBtn,
                            currentTime.getHours() >= 17 && styles.completeBtnDisabled,
                          ]}
                          onPress={() => markAsCompleted(time)}
                          disabled={currentTime.getHours() >= 17}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.completeBtnText}>✓ Oznacz jako wykonany</Text>
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
            <Text style={styles.emptySubtext}>Wszystkie kursy pojawią się tutaj</Text>
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
    backgroundColor: '#6E64C6',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    maxWidth: 600,
    minWidth: 360,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 20,
  },
  header: {
    backgroundColor: '#6E64C6',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
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
    minWidth: 140,
  },
  callBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
  },
  callBtnText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationToggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: 'space-between',
  },
  locationLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
  departureCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  nextDeparture: {
    borderColor: '#ff6b35',
    borderWidth: 3,
    backgroundColor: '#fff5f3',
    shadowColor: '#ff6b35',
    shadowOpacity: 0.25,
  },
  completedDeparture: {
    borderColor: '#16a34a',
    borderWidth: 3,
    backgroundColor: '#f0fdf4',
    opacity: 0.7,
  },
  nextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b35',
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
    backgroundColor: 'white',
  },
  nextBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  departureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: '#6E64C6',
  },
  departureTimeWrapper: {
    flexDirection: 'column',
    gap: 4,
  },
  departureTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  departureSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    whiteSpace: 'nowrap',
  },
  departureCount: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: '#16a34a',
    gap: 15,
  },
  completedCheckmarkCircle: {
    width: 32,
    height: 32,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCheckmark: {
    fontSize: 18,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  completedTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  completedCount: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    flex: 1,
  },
  expandIcon: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stopsList: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 0,
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 10,
    gap: 15,
  },
  stopNumber: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#6E64C6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stopName: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  stopTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completedStopNumber: {
    backgroundColor: '#16a34a',
  },
  completedStopTime: {
    color: '#16a34a',
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
  },
  noStopsMsg: {
    backgroundColor: '#fff8e6',
    borderWidth: 2,
    borderColor: '#ffb74d',
    borderStyle: 'dashed',
    padding: 18,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#ff8c42',
    marginVertical: 10,
  },
  completeBtnContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  completeBtn: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  completeBtnDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  completeBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#999',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
