"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProps } from "@/user/UserData";
import { useRouter } from "next/navigation";

interface UserContextType {
  user: UserProps | undefined;
  login: (userData: UserProps) => void;
  logout: () => void;
}

const defaultContext: UserContextType = {
  user: undefined,
  login: () => {},
  logout: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProps | undefined>();
  const router = useRouter();

  function login(userData: UserProps) {
    setUser(userData);
  }

  function logout() {
    setUser(undefined);
    router.push("/");
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
