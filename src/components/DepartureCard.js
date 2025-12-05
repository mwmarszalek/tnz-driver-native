import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./DepartureCard.styles";
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
  t,
}) => {
  const allStopNames = Object.keys(stopTimes);
  const orderedRequestedStops = allStopNames.filter((x) =>
    requestedStops.includes(x)
  );

  const getStopCountText = (count) => {
    if (count === 1) return t("stop");
    if (count >= 2 && count <= 4) return t("stops2to4");
    return t("stops5plus");
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
                    <Text style={styles.completeBtnText}>↺ {t("undo")}</Text>
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
      {isNext && <NextBadge minutesToDeparture={minutesToDeparture} t={t} />}

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
          <NoStops t={t} />
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
            <Text style={styles.completeBtnText}>✓ {t("markAsCompleted")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DepartureCard;
