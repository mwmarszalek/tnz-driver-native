import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/app";
import NextBadge from "./NextBadge";
import StopItem from "./StopItem";
import NoStops from "./NoStops";

const DepartureCard = ({
  time,
  timeOnly,
  requestedStops,
  stopTimes,
  isNext,
  isCompleted,
  minutesToDeparture,
  onMarkComplete,
  onMarkIncomplete,
  onToggleExpanded,
  isExpanded,
  isManuallyCompleted,
  currentHour,
}) => {
  const allStopNames = Object.keys(stopTimes);
  const orderedRequestedStops = allStopNames.filter((x) =>
    requestedStops.includes(x)
  );

  const getStopCountText = (count) => {
    if (count === 1) return "przystanek";
    if (count >= 2 && count <= 4) return "przystanki";
    return "przystanków";
  };

  if (isCompleted) {
    return (
      <View
        style={[
          styles.card,
          styles.completedCard,
        ]}
      >
        <TouchableOpacity onPress={onToggleExpanded} activeOpacity={0.7}>
          <View style={styles.completedHeader}>
            <View style={styles.completedCheckmarkCircle}>
              <Text style={styles.completedCheckmark}>✓</Text>
            </View>
            <Text style={styles.completedTime}>{timeOnly}</Text>
            <Text style={styles.completedCount}>
              {requestedStops.length} {getStopCountText(requestedStops.length)}
            </Text>
            <Text style={styles.expandIcon}>{isExpanded ? "▼" : "▶"}</Text>
          </View>

          {isExpanded && (
            <>
              <View style={styles.stopsList}>
                {orderedRequestedStops.map((stop, index) => (
                  <StopItem
                    key={index}
                    stopName={stop}
                    stopTime={stopTimes[stop] || "--:--"}
                    index={index}
                    isCompleted={true}
                  />
                ))}
              </View>
              {isManuallyCompleted && (
                <View style={styles.completeBtnContainer}>
                  <TouchableOpacity
                    style={[styles.completeBtn, styles.incompleteBtn]}
                    onPress={onMarkIncomplete}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.completeBtnText}>↺ Cofnij</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        isNext && styles.nextCard,
      ]}
    >
      {isNext && <NextBadge minutesToDeparture={minutesToDeparture} />}

      <View style={[styles.header, isNext && styles.headerRounded]}>
        <View style={styles.timeWrapper}>
          <Text style={styles.time}>{timeOnly}</Text>
          {time !== timeOnly && (
            <Text style={styles.subtitle}>
              {time.replace(timeOnly, "").trim()}
            </Text>
          )}
        </View>
        <Text style={styles.count}>
          {requestedStops.length} {getStopCountText(requestedStops.length)}
        </Text>
      </View>

      <View style={[styles.stopsList, !isNext && styles.stopsListNoPadding]}>
        {requestedStops.length === 0 ? (
          <NoStops />
        ) : (
          orderedRequestedStops.map((stop, index) => (
            <StopItem
              key={index}
              stopName={stop}
              stopTime={stopTimes[stop] || "--:--"}
              index={index}
            />
          ))
        )}
      </View>

      {minutesToDeparture <= 0 && (
        <View style={[styles.completeBtnContainer, !isNext && styles.completeBtnContainerNoPadding]}>
          <TouchableOpacity
            style={[
              styles.completeBtn,
              currentHour >= 17 && styles.completeBtnDisabled,
            ]}
            onPress={onMarkComplete}
            disabled={currentHour >= 17}
            activeOpacity={0.8}
          >
            <Text style={styles.completeBtnText}>✓ Oznacz jako wykonany</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  nextCard: {
    borderColor: COLORS.warning,
    backgroundColor: "#fff5f3",
    shadowColor: COLORS.warning,
    shadowOpacity: 0.25,
    padding: 15,
  },
  completedCard: {
    borderColor: COLORS.success,
    backgroundColor: "#f0fdf4",
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: COLORS.primary,
  },
  headerRounded: {
    borderRadius: 12,
  },
  timeWrapper: {
    flexDirection: "column",
    gap: 4,
  },
  time: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    whiteSpace: "nowrap",
  },
  count: {
    fontSize: 16,
    color: COLORS.white,
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
    backgroundColor: COLORS.success,
    gap: 15,
  },
  completedCheckmarkCircle: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  completedCheckmark: {
    fontSize: 18,
    color: COLORS.success,
    fontWeight: "bold",
  },
  completedTime: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  stopsListNoPadding: {
    paddingHorizontal: 20,
  },
  completeBtnContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 15,
  },
  completeBtnContainerNoPadding: {
    paddingHorizontal: 25,
  },
  completeBtn: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: COLORS.success,
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
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default DepartureCard;
