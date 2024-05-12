import React from "react";
import DayColumn from "./DayColumn";

interface Session {
  activity: string;
  time: string;
}

interface Day {
  name: string;
  sessions: Session[];
}

interface WeeklyViewProps {
  sessions: {
    mon: Session[];
    tue: Session[];
    wed: Session[];
    thu: Session[];
    fri: Session[];
  };
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ sessions }) => {
  const daysOfWeek: Day[] = [
    { name: "Lunes", sessions: sessions.mon },
    { name: "Martes", sessions: sessions.tue },
    { name: "Miércoles", sessions: sessions.wed },
    { name: "Jueves", sessions: sessions.thu },
    { name: "Viernes", sessions: sessions.fri },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white rounded-lg shadow-lg">
      <div className="w-full p-6 dark:bg-gray-900">
        <h2 className="text-xl font-semibold dark:text-white">
          Planning Semanal
        </h2>
      </div>
      <div className="w-full h-full overflow-x-auto">
        <div className="flex space-x-4 justify-center min-w-max mx-auto  dark:bg-gray-900 h-full p-6">
          {daysOfWeek.map((day, index) => (
            <DayColumn key={index} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyView;
