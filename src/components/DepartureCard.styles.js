import { StyleSheet } from "react-native";
import { colors, spacing, borderRadius, shadows, typography } from "../styles/theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.border,
    ...shadows.lg,
  },
  nextCard: {
    borderColor: colors.warning,
    backgroundColor: colors.warningLight,
    ...shadows.warning,
    padding: spacing.base,
  },
  completedCard: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.primary,
  },
  headerRounded: {
    borderRadius: borderRadius.md,
  },
  timeWrapper: {
    flexDirection: "column",
    gap: spacing.xs,
  },
  time: {
    fontSize: typography.fontSize.huge,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: "rgba(255, 255, 255, 0.9)",
  },
  count: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    fontWeight: typography.fontWeight.semibold,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  completedHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    backgroundColor: colors.success,
    gap: spacing.base,
  },
  completedCheckmarkCircle: {
    width: 32,
    height: 32,
    backgroundColor: colors.white,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  completedCheckmark: {
    fontSize: typography.fontSize.xl,
    color: colors.success,
    fontWeight: typography.fontWeight.bold,
  },
  completedTime: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  completedCount: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: "rgba(255, 255, 255, 0.95)",
    flex: 1,
  },
  expandIcon: {
    fontSize: typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
  },
  stopsList: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingBottom: 0,
  },
  stopsListNoPadding: {
    paddingHorizontal: spacing.xl,
  },
  completeBtnContainer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundDark,
    paddingTop: spacing.base,
  },
  completeBtnContainerNoPadding: {
    paddingHorizontal: spacing.xxl,
  },
  completeBtn: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
    ...shadows.success,
  },
  completeBtnDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  incompleteBtn: {
    backgroundColor: "#3b82f6",
  },
  completeBtnText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
  },
});
