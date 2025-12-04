import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/app";

const NextBadge = ({ minutesToDeparture }) => {
  return (
    <View style={styles.container}>
      <View style={styles.pulseDot} />
      <Text style={styles.text}>
        Najbliższy odjazd (za {minutesToDeparture} min)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.warning,
    paddingVertical: 16,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginBottom: 15,
    gap: 12,
  },
  pulseDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.white,
  },
  text: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
});

export default NextBadge;
