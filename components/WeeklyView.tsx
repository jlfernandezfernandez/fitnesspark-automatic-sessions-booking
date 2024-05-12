import React from "react";
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

export default function WeeklyView({
  reservations,
  userId,
}: {
  reservations: Reservation[];
  userId: number | undefined;
}) {
  const getSessionsForDay = (day: string): Session[] => {
    return reservations
      .filter((reservation) => reservation.dayOfWeek === day)
      .map((reservation) => ({
        id: reservation.id,
        activity: reservation.activity,
        time: reservation.time,
      }));
  };

  const daysOfWeek: Day[] = [
    { id: "mon", name: "Lunes", sessions: getSessionsForDay("mon") },
    { id: "tue", name: "Martes", sessions: getSessionsForDay("tue") },
    { id: "wed", name: "Miércoles", sessions: getSessionsForDay("wed") },
    { id: "thu", name: "Jueves", sessions: getSessionsForDay("thu") },
    { id: "fri", name: "Viernes", sessions: getSessionsForDay("fri") },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-lg shadow-lg">
      <div className="w-full p-4 dark:bg-gray-900">
        <h2 className="text-xl font-semibold dark:text-white">
          Planning Semanal
        </h2>
      </div>
      <div className="w-full h-full overflow-x-auto">
        <div className="flex space-x-4 justify-center min-w-max mx-auto dark:bg-gray-900 h-full p-4">
          {daysOfWeek.map((day, index) => (
            <DayColumn key={index} day={day} userId={userId} />
          ))}
        </div>
      </div>
    </div>
  );
}
