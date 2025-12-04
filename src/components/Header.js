import React from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet } from "react-native";
import { COLORS } from "../constants/app";

const Header = ({ onCallDispatcher, locationTracking, onToggleGPS }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.title}>🚌 Panel Kierowcy</Text>
        <Text style={styles.subtitle}>Transport Na Żądanie - Linia 904</Text>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={onCallDispatcher}
          activeOpacity={0.7}
        >
          <Text style={styles.callBtnText}>📞 Dyspozytor</Text>
        </TouchableOpacity>

        <View style={styles.locationToggleWrapper}>
          <Text style={styles.locationLabel}>📍 Online</Text>
          <Switch
            value={locationTracking}
            onValueChange={onToggleGPS}
            trackColor={{ false: "rgba(255,255,255,0.3)", true: "#22c55e" }}
            thumbColor={COLORS.white}
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
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
  left: {
    flex: 1,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
  right: {
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
    color: COLORS.white,
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
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
});

export default Header;
