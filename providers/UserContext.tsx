"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { UserProps } from "@/model/UserData";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { getAllReservations } from "@/services/ReservationService";

interface Reservation {
  id: number;
  userId: number;
  dayOfWeek: string;
  activity: string;
  time: string;
}

interface UserContextType {
  user: UserProps | undefined;
  reservations: Reservation[];
  login: (userData: UserProps) => void;
  logout: () => void;
  updateUserData: (userData: Partial<UserProps>) => void;
  removeFromReservations: (reservationId: number) => void;
  addToReservations: (newReservation: Reservation) => void;
}

const defaultContext: UserContextType = {
  user: undefined,
  reservations: [],
  login: () => {},
  logout: () => {},
  updateUserData: () => {},
  removeFromReservations: () => {},
  addToReservations: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const cookies = parseCookies();
      const sessionUser = cookies.sessionUser;

      if (sessionUser) {
        const userData = JSON.parse(sessionUser);
        setUser(userData);
        getReservations(userData.id);
      } else {
        router.push("/");
      }
    };

    fetchData();
  }, [router]);

  const getReservations = useCallback(async (userId: number) => {
    const { reservations, status } = await getAllReservations(userId);
    if (status === 200) {
      setReservations(reservations);
    }
  }, []);

  const login = useCallback(
    (userData: UserProps) => {
      setUser(userData);
      getReservations(userData.id);
      setCookie(null, "sessionUser", JSON.stringify(userData), {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
      });
    },
    [getReservations]
  );

  const logout = useCallback(() => {
    setUser(undefined);
    setReservations([]);
    destroyCookie(null, "sessionUser");
    router.push("/");
  }, [router]);

  const updateUserData = useCallback((userData: Partial<UserProps>) => {
    setUser((prevUser) => {
      if (!prevUser) {
        return userData as UserProps;
      } else {
        const newUser = {
          ...prevUser,
          ...userData,
        };
        if (JSON.stringify(prevUser) !== JSON.stringify(newUser)) {
          setCookie(null, "sessionUser", JSON.stringify(newUser), {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
          return newUser;
        }
        return prevUser;
      }
    });
  }, []);

  const removeFromReservations = useCallback((reservationId: number) => {
    setReservations((prevReservations) => {
      return prevReservations.filter(
        (reservation) => reservation.id !== reservationId
      );
    });
  }, []);

  const addToReservations = useCallback((newReservation: Reservation) => {
    setReservations((prevReservations) => {
      return [...prevReservations, newReservation];
    });
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        reservations,
        login,
        logout,
        updateUserData,
        removeFromReservations,
        addToReservations,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
