import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, typography } from "../styles/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.base,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    marginBottom: 10,
    gap: spacing.base,
  },
  stopNumber: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  completedStopNumber: {
    backgroundColor: colors.success,
  },
  stopNumberText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  stopName: {
    flex: 1,
    fontSize: typography.fontSize.xl,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  stopTime: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.secondary,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
  },
  completedStopTime: {
    color: colors.success,
    backgroundColor: "rgba(22, 163, 74, 0.1)",
  },
});
