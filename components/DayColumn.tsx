import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { XIcon } from "./ui/x-icon";

interface Session {
  activity: string;
  time: string;
}

interface Day {
  name: string;
  sessions: Session[];
}

interface DayColumnProps {
  day: Day;
}

const DayColumn: React.FC<DayColumnProps> = ({ day }) => {
  const [isAddingSession, setIsAddingSession] = useState<boolean>(false);
  const [newSession, setNewSession] = useState<Session>({
    activity: "",
    time: "",
  });

  const toggleAddingSession = () => {
    setIsAddingSession(!isAddingSession);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setNewSession({
      ...newSession,
      [field]: e.target.value,
    });
  };

  const addSession = () => {
    console.log("Nueva sesión:", newSession);
    setNewSession({ activity: "", time: "" });
    toggleAddingSession();
  };

  return (
    <div className="flex flex-col items-center m-4 p-4 min-h-[260px] w-full sm:w-auto">
      <div className="font-medium text-gray-700 dark:text-gray-300">
        {day.name}
      </div>
      <div className="flex-grow mt-2">
        {isAddingSession ? (
          <div className="flex flex-col space-y-2">
            <Input
              className="mt-2"
              placeholder="Sesión"
              value={newSession.activity}
              onChange={(e) => handleInputChange(e, "activity")}
            />
            <Input
              className="mt-1"
              placeholder="Hora"
              value={newSession.time}
              onChange={(e) => handleInputChange(e, "time")}
            />
            <div className="flex justify-center">
              <Button onClick={addSession}>Añadir</Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={toggleAddingSession}>
            Añadir Sesión
          </Button>
        )}
      </div>
      <div className="flex-grow mt-4 grid grid-cols-1 gap-4">
        {day.sessions.map((session, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{session.activity}</h3>
              <p className="text-gray-500 dark:text-gray-400">{session.time}</p>
            </div>
            <Button size="icon" variant="ghost">
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
