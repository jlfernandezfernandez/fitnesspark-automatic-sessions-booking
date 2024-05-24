import React, { useState, useMemo, useCallback } from "react";
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
  availableClasses: { name: string; time: string; instructor?: string }[];
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

  const sortedSessions = useMemo(() => {
    return [...day.sessions].sort((a, b) => {
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);
      return hoursA !== hoursB ? hoursA - hoursB : minutesA - minutesB;
    });
  }, [day.sessions]);

  const toggleAddingSession = useCallback(() => {
    setIsAddingSession((prev) => !prev);
  }, []);

  const handleActivityChange = useCallback(
    (value: string) => {
      setNewSession((prev) => ({
        ...prev,
        activity: value,
        time: "", // Reset time when activity changes
      }));

      const filteredTimes = day.availableClasses
        .filter((cls) => cls.name === value)
        .map((cls) => cls.time);

      if (filteredTimes.length === 1) {
        setNewSession((prev) => ({
          ...prev,
          time: filteredTimes[0],
        }));
      }
    },
    [day.availableClasses]
  );

  const handleInputChange = useCallback((field: string, value: string) => {
    setNewSession((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const addSession = useCallback(
    async (e: React.FormEvent) => {
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
            activity: newSession.activity,
            time: newSession.time,
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
    },
    [addToReservations, day.id, newSession.activity, newSession.time, userId]
  );

  const cancelAddSession = useCallback(() => {
    setIsAddingSession(false); // Reset the adding state
    setNewSession({ id: 0, activity: "", time: "" }); // Clear the form
  }, []);

  const deleteSession = useCallback(
    async (session: Session) => {
      try {
        const response = await deleteReservation(session.id);
        if (response.status === 200) {
          removeFromReservations(session.id);
        }
      } catch (error) {
        console.error("Error al eliminar la sesión:", error);
      }
    },
    [removeFromReservations]
  );

  const sessionLimit = 3;
  const sessionsCount = day.sessions.length;

  const filteredClasses = day.availableClasses.filter(
    (cls) =>
      !sortedSessions.some(
        (session) => session.time === cls.time && session.activity === cls.name
      )
  );

  const filteredTimes = filteredClasses
    .filter((cls) => cls.name === newSession.activity)
    .map((cls) => cls.time);

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
                options={filteredClasses.map((cls, index) => ({
                  label: cls.name,
                  value: cls.name,
                  key: `${cls.name}-${index}`,
                }))}
                value={newSession.activity}
                onChange={(e) => handleActivityChange(e.target.value)}
                required
              />
              <TimeInput
                options={filteredTimes}
                value={newSession.time}
                onChange={(value) => handleInputChange("time", value)}
                required
                disabled={!newSession.activity}
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
        {sortedSessions.map((session) => {
          const availableClass = day.availableClasses.find(
            (cls) => cls.name === session.activity && cls.time === session.time
          );

          const isAvailable = Boolean(availableClass);
          const instructor = availableClass?.instructor;

          return (
            <div
              key={session.id}
              className={`rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-lg transition-shadow ${
                isAvailable
                  ? "bg-white dark:bg-gray-600"
                  : "bg-red-200 dark:bg-red-800"
              }`}
            >
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {session.activity}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {session.time.slice(0, 5)}
                </p>
                {instructor && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {instructor}
                  </p>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => deleteSession(session)}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500 dark:text-gray-400 mb-1">
        {sessionsCount < sessionLimit
          ? `${sessionLimit - sessionsCount} sesiones restantes`
          : "Todas reservadas"}
      </div>
    </div>
  );
};

export default React.memo(DayColumn);
