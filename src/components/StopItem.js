import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/app";

const StopItem = ({ stopName, stopTime, index, isCompleted = false }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.stopNumber, isCompleted && styles.completedStopNumber]}>
        <Text style={styles.stopNumberText}>{index + 1}</Text>
      </View>
      <Text style={styles.stopName} numberOfLines={1} ellipsizeMode="tail">
        {stopName}
      </Text>
      <Text style={[styles.stopTime, isCompleted && styles.completedStopTime]}>
        {stopTime}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: 10,
    gap: 15,
  },
  stopNumber: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  completedStopNumber: {
    backgroundColor: COLORS.success,
  },
  stopNumberText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  stopName: {
    flex: 1,
    fontSize: 18,
    color: COLORS.text,
    fontWeight: "500",
  },
  stopTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.secondary,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  completedStopTime: {
    color: COLORS.success,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
  },
});

export default StopItem;
