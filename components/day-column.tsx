import React, { useState } from "react";
import { Button } from "./ui/button";
import { XIcon, PlusIcon } from "lucide-react";
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

  const sessionLimit = 3;
  const sessionsCount = day.sessions.length;

  return (
    <div className="relative flex flex-col items-center m-1 p-3 sm:p-6 min-h-[450px] sm:min-h-[500px] w-full sm:w-auto bg-gray-100 dark:bg-gray-800 rounded-xl dark:text-white">
      <div className="flex justify-between items-center w-full">
        <div className="font-medium text-gray-700 dark:text-gray-300">
          {day.name}
        </div>
        {!isAddingSession && (
          <GradientButton
            onClick={toggleAddingSession}
            text={<PlusIcon className="w-4 h-4" />}
            disabled={sessionsCount >= sessionLimit}
          />
        )}
      </div>
      {isAddingSession && (
        <div className="mt-2 w-full">
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
        </div>
      )}
      <div className="mt-3 grid grid-cols-1 gap-4 w-full min-w-[200px]">
        {sortedSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white rounded-lg p-4 dark:bg-gray-600 flex justify-between items-center shadow-sm hover:shadow-lg transition-shadow"
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
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400 mb-1">
        {sessionsCount < sessionLimit
          ? `${sessionLimit - sessionsCount} sesiones restantes`
          : "Todas reservadas"}
      </div>
    </div>
  );
};

export default DayColumn;
