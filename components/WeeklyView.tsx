import React, { useMemo, useCallback } from "react";
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
      { id: "mon", name: "Lunes", sessions: getSessionsForDay("mon") },
      { id: "tue", name: "Martes", sessions: getSessionsForDay("tue") },
      { id: "wed", name: "Miércoles", sessions: getSessionsForDay("wed") },
      { id: "thu", name: "Jueves", sessions: getSessionsForDay("thu") },
      { id: "fri", name: "Viernes", sessions: getSessionsForDay("fri") },
    ],
    [getSessionsForDay]
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-gray-600 dark:text-white rounded-xl shadow-xl p-3">
      <div className="w-full ml-2 mb-1">
        <h2 className="text-base font-semibold">Planning Semanal</h2>
        <h3 className="text-xs text-gray-400">lunes - viernes</h3>
      </div>
      <div className="w-full h-full overflow-x-auto overflow-y-hidden mb-3">
        <div className="flex justify-start space-x-2 sm:space-x-4 lg:space-x-6 mx-auto h-full px-2">
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
