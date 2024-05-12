"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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
  updateUserData: (userData: UserProps) => void;
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
  }, []);

  async function getReservations(userId: number) {
    const { reservations, status } = await getAllReservations(userId);
    if (status === 200) {
      setReservations(reservations);
    }
  }

  function login(userData: UserProps) {
    setUser(userData);
    getReservations(userData.id);
    setCookie(null, "sessionUser", JSON.stringify(userData), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  }

  function logout() {
    setUser(undefined);
    setReservations([]);
    destroyCookie(null, "sessionUser");
    router.push("/");
  }

  function updateUserData(userData: Partial<UserProps>) {
    setUser((prevUser) => {
      if (!prevUser) {
        return userData as UserProps;
      } else {
        const newUser = {
          ...prevUser,
          ...userData,
        };
        setCookie(null, "sessionUser", JSON.stringify(newUser), {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        return newUser;
      }
    });
  }

  function removeFromReservations(reservationId: number) {
    setReservations((prevReservations) => {
      const updatedReservations = prevReservations.filter(
        (reservation) => reservation.id !== reservationId
      );
      return updatedReservations;
    });
  }

  function addToReservations(newReservation: Reservation) {
    setReservations((prevReservations) => {
      const updatedReservations = [...prevReservations, newReservation];
      return updatedReservations;
    });
  }

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
