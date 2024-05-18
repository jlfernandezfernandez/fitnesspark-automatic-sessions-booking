import React, { useState } from "react";
import { Button } from "./ui/button";
import { XIcon } from "./ui/x-icon";
import {
  addReservation,
  deleteReservation,
} from "@/services/ReservationService";
import { useUser } from "@/providers/UserContext";
import ActivitySelect from "./activity-select";
import TimeInput from "./time-input";
import GradientButton from "./ui/gradient-button";

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

  const handleInputChange = (field: string, value: string) => {
    setNewSession((prev) => ({
      ...prev,
      [field]: value,
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

  const cancelAddSession = () => {
    setIsAddingSession(false); // Reset the adding state
    setNewSession({ id: 0, activity: "", time: "" }); // Clear the form
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
    <div className="flex flex-col items-center m-1 p-4 min-h-[250px] sm:min-h-[400px] w-full sm:w-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="font-medium text-gray-700 dark:text-gray-300">
        {day.name}
      </div>
      <div className="mt-2">
        {isAddingSession ? (
          <div className="w-full p-4 bg-white dark:bg-gray-700 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1">
            <form className="flex flex-col space-y-2" onSubmit={addSession}>
              <ActivitySelect
                value={newSession.activity}
                onChange={(e) => handleInputChange("activity", e.target.value)}
                required
              />
              <TimeInput
                value={newSession.time}
                onChange={(value) => handleInputChange("time", value)}
                required
              />
              <div className="flex space-x-4">
                <Button type="submit" className="flex-1 min-w-[80px]">
                  Añadir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 min-w-[80px]"
                  onClick={cancelAddSession}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <GradientButton onClick={toggleAddingSession} text="Añadir Sesión" />
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 w-full min-w-[200px]">
        {sortedSessions.map((session) => (
          <div
            key={session.id}
            className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800 flex justify-between items-center shadow-sm hover:shadow-lg transition-shadow"
          >
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-200">
                {session.activity}
              </h3>
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
