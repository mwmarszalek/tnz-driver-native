import { useState } from "react";
import { AUTO_COMPLETE_DELAY, END_OF_DAY_HOUR } from "../constants/app";

export const useCourseCompletion = (getMinutesToDeparture) => {
  const [completedCourses, setCompletedCourses] = useState({});
  const [expandedCompleted, setExpandedCompleted] = useState({});

  const isCourseCompleted = (departureTime) => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= END_OF_DAY_HOUR) {
      return false;
    }

    // Check if manually completed
    if (completedCourses[departureTime]?.completed) {
      return true;
    }

    // Auto-complete if more than AUTO_COMPLETE_DELAY minutes past departure
    const minutesToDeparture = getMinutesToDeparture(departureTime);
    const autoCompleted =
      minutesToDeparture !== null && minutesToDeparture < -AUTO_COMPLETE_DELAY;

    // Store auto-completed courses (but mark as NOT manual)
    if (autoCompleted && !completedCourses[departureTime]) {
      setCompletedCourses((prev) => ({
        ...prev,
        [departureTime]: { completed: true, manual: false },
      }));
    }

    return autoCompleted;
  };

  const markAsCompleted = (time) => {
    // Mark as completed manually
    setCompletedCourses({
      ...completedCourses,
      [time]: { completed: true, manual: true },
    });
  };

  const markAsIncomplete = (time) => {
    // Only allow unmarking if it was marked manually
    if (completedCourses[time]?.manual) {
      const updated = { ...completedCourses };
      delete updated[time];
      setCompletedCourses(updated);
    }
  };

  const toggleExpandCompleted = (time) => {
    setExpandedCompleted({
      ...expandedCompleted,
      [time]: !expandedCompleted[time],
    });
  };

  return {
    completedCourses,
    expandedCompleted,
    isCourseCompleted,
    markAsCompleted,
    markAsIncomplete,
    toggleExpandCompleted,
  };
};
