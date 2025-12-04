import React from "react";
import { View, ScrollView, StyleSheet, StatusBar, Linking } from "react-native";
import { scheduleSchool904 } from "../config/schedules";
import { DISPATCHER_PHONE, COLORS } from "../constants/app";
import { Header, DepartureCard, EmptyState } from "../components";
import {
  useSchedule,
  useLocationTracking,
  useCourseCompletion,
} from "../hooks";

export default function HomeScreen() {
  const {
    savedSchedules,
    currentTime,
    getMinutesToDeparture,
    getNextDeparture,
    getScheduleKey,
  } = useSchedule();

  const { locationTracking, toggleGPS } = useLocationTracking();

  const {
    completedCourses,
    expandedCompleted,
    isCourseCompleted,
    markAsCompleted,
    markAsIncomplete,
    toggleExpandCompleted,
  } = useCourseCompletion(getMinutesToDeparture);

  const callDispatcher = () => {
    Linking.openURL(`tel:${DISPATCHER_PHONE}`);
  };

  const nextDeparture = getNextDeparture(Object.keys(scheduleSchool904));

  const hasAnySchedules = !Object.values(savedSchedules).every((stops) =>
    Object.values(stops).every((v) => !v)
  );

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.container}>
        <Header
          onCallDispatcher={callDispatcher}
          locationTracking={locationTracking}
          onToggleGPS={toggleGPS}
        />

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
            const minutesToDeparture = getMinutesToDeparture(time);

            return (
              <DepartureCard
                key={time}
                time={time}
                timeOnly={timeOnly}
                requestedStops={requestedStops}
                stopTimes={stopTimes}
                isNext={isNext}
                isCompleted={isCompleted}
                minutesToDeparture={minutesToDeparture}
                onMarkComplete={() => markAsCompleted(time)}
                onMarkIncomplete={() => markAsIncomplete(time)}
                onToggleExpanded={() => toggleExpandCompleted(time)}
                isExpanded={expandedCompleted[time]}
                isManuallyCompleted={completedCourses[time]?.manual}
                currentHour={currentTime.getHours()}
              />
            );
          })}

          {!hasAnySchedules && <EmptyState />}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    maxWidth: 600,
    minWidth: 360,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 60,
    elevation: 20,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
  },
});
