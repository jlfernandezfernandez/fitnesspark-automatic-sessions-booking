import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { XIcon } from "./ui/x-icon";
import {
  addReservation,
  deleteReservation,
} from "@/services/ReservationService";
import { useUser } from "@/providers/UserContext";

interface Session {
  id: number;
  activity: string;
  time: string;
}

interface Day {
  name: string;
  id: string;
  sessions: Session[];
}

interface DayColumnProps {
  day: Day;
  userId: number | undefined;
}

const DayColumn: React.FC<DayColumnProps> = ({ day, userId }) => {
  const [isAddingSession, setIsAddingSession] = useState<boolean>(false);
  const [newSession, setNewSession] = useState<Session>({
    id: 0,
    activity: "",
    time: "",
  });
  const { removeFromReservations, addToReservations } = useUser();

  const sortedSessions = [...day.sessions].sort((a, b) => {
    const [hoursA, minutesA] = a.time.split(":").map(Number);
    const [hoursB, minutesB] = b.time.split(":").map(Number);
    return hoursA !== hoursB ? hoursA - hoursB : minutesA - minutesB;
  });

  const toggleAddingSession = () => {
    setIsAddingSession((prev) => !prev);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setNewSession((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const addSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSession.activity || !newSession.time) {
      console.error("Activity and time are required.");
      return;
    }
    try {
      if (userId) {
        const response = await addReservation({
          userId,
          dayOfWeek: day.id,
          ...newSession,
        });

        if (response.status === 200 && response.reservation) {
          addToReservations(response.reservation);
          setIsAddingSession(false); // Reset the adding state
          setNewSession({ id: 0, activity: "", time: "" }); // Clear the form
        }
      }
    } catch (error) {
      console.error("Error al añadir la sesión:", error);
    }
  };

  const deleteSession = async (session: Session) => {
    try {
      const response = await deleteReservation(session.id);
      if (response.status === 200) {
        removeFromReservations(session.id);
      }
    } catch (error) {
      console.error("Error al eliminar la sesión:", error);
    }
  };

  return (
    <div className="flex flex-col items-center m-1 p-4 min-h-[300px] w-full sm:w-auto">
      <div className="font-medium text-gray-700 dark:text-gray-300">
        {day.name}
      </div>
      <div className="mt-2">
        {isAddingSession ? (
          <form className="flex flex-col space-y-2" onSubmit={addSession}>
            <Input
              className="mt-2"
              placeholder="Sesión"
              value={newSession.activity}
              required
              onChange={(e) => handleInputChange(e, "activity")}
            />
            <Input
              className="mt-1"
              placeholder="Hora"
              value={newSession.time}
              required
              type="time"
              onChange={(e) => handleInputChange(e, "time")}
            />
            <div className="flex justify-center">
              <Button type="submit">Añadir</Button>
            </div>
          </form>
        ) : (
          <Button size="sm" variant="outline" onClick={toggleAddingSession}>
            Añadir Sesión
          </Button>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {sortedSessions.map((session) => (
          <div
            key={session.id}
            className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800 flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{session.activity}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {session.time.slice(0, 5)}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => deleteSession(session)}
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
