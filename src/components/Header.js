import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { styles } from "./Header.styles";
import { colors } from "../styles/theme";

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
            thumbColor={colors.white}
            ios_backgroundColor="rgba(255,255,255,0.3)"
          />
        </View>
      </View>
    </View>
  );
};

export default Header;
