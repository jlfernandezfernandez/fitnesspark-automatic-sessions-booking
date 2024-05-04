"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserProps } from "@/user/UserData";
import { useRouter } from "next/navigation";
import { parseCookies, setCookie, destroyCookie } from "nookies";

interface UserContextType {
  user: UserProps | undefined;
  isLinked: boolean;
  login: (userData: UserProps) => void;
  logout: () => void;
  setIsLinked: (isLinked: boolean) => void;
}

const defaultContext: UserContextType = {
  user: undefined,
  isLinked: false,
  login: () => {},
  logout: () => {},
  setIsLinked: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | undefined>();
  const [isLinked, setIsLinked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cookies = parseCookies();
    const sessionUser = cookies.sessionUser;

    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
      router.push("/profile");
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
    setIsLinked(false);
    destroyCookie(null, "sessionUser");
    router.push("/");
  }

  return (
    <UserContext.Provider
      value={{ user, isLinked, login, logout, setIsLinked }}
    >
      {children}
    </UserContext.Provider>
  );
};
