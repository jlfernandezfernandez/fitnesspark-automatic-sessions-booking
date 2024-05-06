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
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface UserContextType {
  user: UserProps | undefined;
  login: (userData: UserProps) => void;
  logout: () => void;
  updateUserData: (userData: UserProps) => void;
}

const defaultContext: UserContextType = {
  user: undefined,
  login: () => {},
  logout: () => {},
  updateUserData: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | undefined>();
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const sessionUser = cookies.sessionUser;

    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    } else {
      router.push("/");
    }
  }, []);

  function login(userData: UserProps) {
    setUser(userData);
    setCookie(null, "sessionUser", JSON.stringify(userData), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
  }

  function logout() {
    setUser(undefined);
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

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
