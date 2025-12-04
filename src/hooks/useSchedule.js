import { useState, useEffect } from "react";
import { database, ref, onValue } from "../config/firebase";
import { TIME_UPDATE_INTERVAL, NEXT_DEPARTURE_WINDOW } from "../constants/app";

export const useSchedule = () => {
  const [savedSchedules, setSavedSchedules] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const schedulesRef = ref(database, "savedSchedules");
    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSavedSchedules(data);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, TIME_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getMinutesToDeparture = (departureTime) => {
    const timeMatch = departureTime.match(/^(\d{2}):(\d{2})/);
    if (!timeMatch) return null;

    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);

    const now = currentTime;
    const departure = new Date(now);
    departure.setHours(hours, minutes, 0, 0);

    const timeDiff = departure.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);

    return minutesDiff;
  };

  const getNextDeparture = (scheduleKeys) => {
    const now = currentTime;
    let nextDeparture = null;
    let minDiff = Infinity;

    scheduleKeys.forEach((time) => {
      const timeMatch = time.match(/^(\d{2}):(\d{2})/);
      if (!timeMatch) return;

      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);

      const departure = new Date(now);
      departure.setHours(hours, minutes, 0, 0);

      const timeDiff = departure.getTime() - now.getTime();
      const minutesDiff = timeDiff / 1000 / 60;

      if (timeDiff > 0 && minutesDiff <= NEXT_DEPARTURE_WINDOW && timeDiff < minDiff) {
        minDiff = timeDiff;
        nextDeparture = time;
      }
    });

    return nextDeparture;
  };

  const getScheduleKey = (time) => {
    const timeOnly = time.match(/^(\d{2}):(\d{2})/)?.[0] || "";
    const timeFormatted = timeOnly.replace(":", "_");
    return Object.keys(savedSchedules).find((key) =>
      key.includes(timeFormatted)
    );
  };

  return {
    savedSchedules,
    currentTime,
    getMinutesToDeparture,
    getNextDeparture,
    getScheduleKey,
  };
};
