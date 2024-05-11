import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { XIcon } from "./ui/x-icon";

interface Session {
  activity: string;
  time: string;
}

interface Day {
  name: string;
  sessions: Session[];
}

interface DayColumnProps {
  day: Day;
}

const DayColumn: React.FC<DayColumnProps> = ({ day }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col items-center m-4 p-4">
      <div className="font-medium text-gray-700 dark:text-gray-300">
        {day.name}
      </div>
      <div className="mt-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline" onClick={toggleMenu}>
              Añadir Sesión
            </Button>
          </DropdownMenuTrigger>
          {isMenuOpen && (
            <DropdownMenuContent>
              <DropdownMenuItem>
                <form className="flex flex-col">
                  <Input className="mt-2" placeholder="Sesión" />
                  <Input className="mt-1" placeholder="Hora" />
                  <Button className="my-2">Añadir</Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {day.sessions.map((session, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-lg p-4 dark:bg-gray-800"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{session.activity}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {session.time}
                </p>
              </div>
              <Button size="icon" variant="ghost">
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayColumn;
