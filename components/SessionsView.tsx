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

export default function WeeklyView({ sessions }: WeeklyViewProps) {
  const daysOfWeek: Day[] = [
    { name: "Lunes", sessions: sessions.mon },
    { name: "Martes", sessions: sessions.tue },
    { name: "Miércoles", sessions: sessions.wed },
    { name: "Jueves", sessions: sessions.thu },
    { name: "Viernes", sessions: sessions.fri },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-2 dark:text-white">
          Vista Semanal
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {daysOfWeek.map((day, index) => (
            <DayColumn key={index} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
}
