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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    gap: 10,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.white,
  },
  text: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
});

export default NextBadge;
