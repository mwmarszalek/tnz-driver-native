import React from "react";
import { View, Text } from "react-native";
import { styles } from "./StopItem.styles";

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

export default StopItem;
