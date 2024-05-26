import React, { useEffect, useState, useCallback, useMemo } from "react";

interface FailedReservation {
  id: number;
  userId: number;
  reservationId: number;
  dateOfFailure: string;
  errorMessage: string;
  sessionActivity: string;
  sessionTime: string;
}

interface FailedReservationsListProps {
  userId: number | undefined;
}

const fetchFailedReservations = async (userId: number) => {
  const response = await fetch(`/api/reservation/failed/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch failed reservations: ${response.statusText}`
    );
  }
  const data = await response.json();
  return data.failedReservations || [];
};

const extractErrorMessage = (errorMessage: string) => {
  try {
    const errorJson = JSON.parse(errorMessage);
    return errorJson.message || errorMessage;
  } catch {
    return errorMessage;
  }
};

const FailedReservationsList: React.FC<FailedReservationsListProps> = ({
  userId,
}) => {
  const [failedReservations, setFailedReservations] = useState<
    FailedReservation[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadFailedReservations = useCallback(async () => {
    if (userId) {
      setIsLoading(true);
      try {
        const data = await fetchFailedReservations(userId);
        setFailedReservations(data);
        setError(null);
      } catch (error: any) {
        console.error(error.message);
        setError("No se han podido recuperar las reservas fallidas");
      } finally {
        setIsLoading(false);
      }
    }
  }, [userId]);

  useEffect(() => {
    loadFailedReservations();
  }, [loadFailedReservations]);

  const failedReservationsThisWeek = useMemo(() => {
    const now = new Date();
    const startOfWeek = () => {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      return new Date(now.setDate(diff));
    };
    return failedReservations.filter(
      (reservation) => new Date(reservation.dateOfFailure) >= startOfWeek()
    ).length;
  }, [failedReservations]);

  const failedReservationsThisMonth = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return failedReservations.filter(
      (reservation) => new Date(reservation.dateOfFailure) >= startOfMonth
    ).length;
  }, [failedReservations]);

  return (
    <div className="max-w-full mx-auto bg-white dark:bg-gray-800 overflow-hidden">
      <div className="p-4">
        <div className="h-64 overflow-y-auto">
          {isLoading ? (
            <p className="text-center"></p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : failedReservations.length === 0 ? (
            <p className="text-center">No hay reservas fallidas</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {failedReservations.map((failedReservation) => (
                <li key={failedReservation.id} className="py-4">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {failedReservation.sessionActivity} a las{" "}
                    {failedReservation.sessionTime}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(failedReservation.dateOfFailure).toLocaleString()}
                  </div>
                  <div className="text-xs text-red-500 dark:text-red-400">
                    {extractErrorMessage(failedReservation.errorMessage)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {failedReservations.length > 0 && (
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
            <p>Esta semana: {failedReservationsThisWeek}</p>
            <p>Este mes: {failedReservationsThisMonth}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FailedReservationsList);
