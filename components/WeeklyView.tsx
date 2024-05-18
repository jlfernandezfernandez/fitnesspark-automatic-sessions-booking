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
  // Filtra las reservas por día
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

  // Define los días de la semana y sus sesiones
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
    <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-gray-600 dark:text-white rounded-md shadow-md px-4 py-2">
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
