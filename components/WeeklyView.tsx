import React, { useMemo, useCallback, useEffect, useState } from "react";
import DayColumn from "./day-column";

interface Session {
  id: number;
  activity: string;
  time: string;
}

interface Day {
  id: string;
  name: string;
  sessions: Session[];
  availableClasses: { name: string; time: string }[];
}

interface Reservation {
  id: number;
  userId: number;
  dayOfWeek: string;
  activity: string;
  time: string;
}

interface WeeklyViewProps {
  reservations: Reservation[];
  userId: number | undefined;
}

export default function WeeklyView({ reservations, userId }: WeeklyViewProps) {
  const [availableClasses, setAvailableClasses] = useState<
    Record<string, { name: string; time: string }[]>
  >({});

  async function fetchAvailableClasses() {
    try {
      const response = await fetch("/api/sesions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const groupedClasses = data.reduce(
        (
          acc: {
            [x: string]: { name: string; time: string; instructor: string }[];
          },
          classInfo: {
            day: string;
            name: string;
            time: string;
            instructor: string;
          }
        ) => {
          const { day, name, time, instructor } = classInfo;
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push({ name, time, instructor });
          return acc;
        },
        {}
      );
      setAvailableClasses(groupedClasses);
    } catch (error) {
      console.error("Failed to fetch available classes:", error);
    }
  }

  useEffect(() => {
    fetchAvailableClasses();
  }, []);

  const getSessionsForDay = useCallback(
    (day: string): Session[] => {
      return reservations
        .filter((reservation) => reservation.dayOfWeek === day)
        .map((reservation) => ({
          id: reservation.id,
          activity: reservation.activity,
          time: reservation.time,
        }));
    },
    [reservations]
  );

  const daysOfWeek: Day[] = useMemo(
    () => [
      {
        id: "mon",
        name: "Lunes",
        sessions: getSessionsForDay("mon"),
        availableClasses: availableClasses["mon"] || [],
      },
      {
        id: "tue",
        name: "Martes",
        sessions: getSessionsForDay("tue"),
        availableClasses: availableClasses["tue"] || [],
      },
      {
        id: "wed",
        name: "Miércoles",
        sessions: getSessionsForDay("wed"),
        availableClasses: availableClasses["wed"] || [],
      },
      {
        id: "thu",
        name: "Jueves",
        sessions: getSessionsForDay("thu"),
        availableClasses: availableClasses["thu"] || [],
      },
      {
        id: "fri",
        name: "Viernes",
        sessions: getSessionsForDay("fri"),
        availableClasses: availableClasses["fri"] || [],
      },
    ],
    [getSessionsForDay, availableClasses]
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-gray-600 dark:text-white">
      <div className="w-full h-full overflow-x-auto overflow-y-hidden">
        <div className="flex justify-start space-x-2 sm:space-x-4 lg:space-x-6 mx-auto h-full p-1">
          {daysOfWeek.map((day) => (
            <div key={day.id} className="flex-1 min-w-[250px]">
              <DayColumn day={day} userId={userId} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
