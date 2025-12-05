import React from "react";
import { View, Text } from "react-native";
import { styles } from "./NextBadge.styles";

const NextBadge = ({ minutesToDeparture, t }) => {
  const timeText =
    minutesToDeparture <= 0
      ? t("now")
      : t("inMinutes", { minutes: minutesToDeparture });

  return (
    <View style={styles.container}>
      <View style={styles.pulseDot} />
      <Text style={styles.text}>
        {t("nextDeparture")} ({timeText})
      </Text>
    </View>
  );
};

export default NextBadge;
