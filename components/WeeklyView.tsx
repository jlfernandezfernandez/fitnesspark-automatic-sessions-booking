import React, { useMemo } from "react";
import DayColumn from "./DayColumn";

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
  const getSessionsForDay = (day: string): Session[] => {
    return reservations
      .filter((reservation) => reservation.dayOfWeek === day)
      .map((reservation) => ({
        id: reservation.id,
        activity: reservation.activity,
        time: reservation.time,
      }));
  };

  const daysOfWeek: Day[] = useMemo(
    () => [
      { id: "mon", name: "Lunes", sessions: getSessionsForDay("mon") },
      { id: "tue", name: "Martes", sessions: getSessionsForDay("tue") },
      { id: "wed", name: "Miércoles", sessions: getSessionsForDay("wed") },
      { id: "thu", name: "Jueves", sessions: getSessionsForDay("thu") },
      { id: "fri", name: "Viernes", sessions: getSessionsForDay("fri") },
    ],
    [reservations]
  );

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white dark:bg-gray-800 dark:text-white rounded-xl shadow-xl">
      <div className="w-full p-4 dark:bg-gray-800">
        <h2 className="text-xl font-semibold">Planning Semanal</h2>
      </div>
      <div className="w-full h-full overflow-auto">
        <div className="flex space-x-4 justify-center min-w-max mx-auto h-full p-4">
          {daysOfWeek.map((day) => (
            <DayColumn key={day.id} day={day} userId={userId} />
          ))}
        </div>
      </div>
    </div>
  );
}
