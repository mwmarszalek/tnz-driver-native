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

    if (completedCourses[departureTime]?.completed) {
      return true;
    }

    const minutesToDeparture = getMinutesToDeparture(departureTime);
    const autoCompleted =
      minutesToDeparture !== null && minutesToDeparture < -AUTO_COMPLETE_DELAY;

    if (autoCompleted && !completedCourses[departureTime]) {
      setCompletedCourses((prev) => ({
        ...prev,
        [departureTime]: { completed: true, manual: false },
      }));
    }

    return autoCompleted;
  };

  const markAsCompleted = (time) => {
    setCompletedCourses({
      ...completedCourses,
      [time]: { completed: true, manual: true },
    });
  };

  const markAsIncomplete = (time) => {
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
