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

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
};

const deleteCookie = (name: string) => {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const router = useRouter();

  const getReservations = useCallback(async (userId: number) => {
    const { reservations, status } = await getAllReservations(userId);
    if (status === 200) {
      setReservations(reservations);
    }
  }, []);

  useEffect(() => {
    const sessionUser = getCookie("sessionUser");

    if (sessionUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(sessionUser));
        setUser(userData);
        getReservations(userData.id);
      } catch (e) {
        console.error("Failed to parse sessionUser cookie", e);
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router, getReservations]);

  const login = useCallback(
    (userData: UserProps) => {
      setUser(userData);
      getReservations(userData.id);
      setCookie("sessionUser", JSON.stringify(userData), 30);
    },
    [getReservations]
  );

  const logout = useCallback(() => {
    setUser(undefined);
    setReservations([]);
    deleteCookie("sessionUser");
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
          setCookie("sessionUser", JSON.stringify(newUser), 30);
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