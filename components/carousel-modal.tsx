import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import UserForm from "@/components/user-form";
import FitnessParkLogo from "@/components/fitnesspark-logo";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

interface CarouselModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error: string;
  handleLinkFitnessPark: (email: string, password: string) => void;
}

export function CarouselModal({
  isOpen,
  setIsOpen,
  error,
  handleLinkFitnessPark,
}: CarouselModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      content: (
        <div className="flex flex-col justify-center items-center space-y-4 p-4 w-full h-full">
          <div className="mb-4 font-semibold text-center">
            <h1 className="lg:text-5xl text-2xl animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent pb-2">
              Autobooking
              <span className="lg:text-lg text-base italic text-gray-fitnesspark font-cactus mx-1">
                |
              </span>
              <FitnessParkLogo
                size="lg:text-xl text-lg"
                underlineOffset="underline-offset-4"
              />
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center text-base lg:text-lg">
            <strong>Fitness Park</strong> utiliza los servicios de{" "}
            <strong>Virtuagym</strong>. Para poder realizar las reservas
            automáticas necesitamos vincularnos con tu cuenta de Virtuagym.
          </p>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col justify-center items-center space-y-4 p-4 w-full h-full">
          <p className="text-gray-500 dark:text-gray-400 text-center text-base lg:text-lg">
            Si no has cambiado tu contraseña de <strong>Fitness Park</strong>,
            puedes utilizar esas mismas credenciales. Si no, puedes recuperarlas
            en:
            <a
              href="https://virtuagym.com/resetpassword"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 underline ml-1"
            >
              https://virtuagym.com/resetpassword
            </a>
          </p>
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col justify-center items-center space-y-4 p-4 w-full h-full">
          <div className="space-y-2 text-center">
            <h2 className="lg:text-4xl text-2xl font-bold">
              Vincula tu cuenta
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base lg:text-lg">
              Ingresa tu <strong>email</strong> y <strong>contraseña</strong>{" "}
              para vincular tu cuenta de <strong>Fitness Park</strong>.
            </p>
          </div>
          <div className="w-full">
            <UserForm
              onSubmit={(email, password) => {
                handleLinkFitnessPark(email, password);
                setIsOpen(false);
              }}
              formTitle=""
              submitButtonLabel="Conectar"
              error={error}
            />
          </div>
        </div>
      ),
    },
  ];

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (!isOpen) setCurrentSlide(0);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center text-center z-50 overflow-y-auto px-2">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-4 sm:p-6 max-w-lg w-full sm:max-w-2xl sm:h-[450px] h-auto">
        <div className="relative flex items-center justify-between h-full">
          <Button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-transparent p-1"
          >
            <ArrowLeftCircle className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 hover:text-gray-700 opacity-75" />
          </Button>
          <div className="flex-grow mx-2 sm:mx-4 h-full flex justify-center items-center">
            {slides[currentSlide].content}
          </div>
          <Button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-transparent p-1"
          >
            <ArrowRightCircle className="h-8 w-8 sm:h-10 sm:w-10 text-gray-500 hover:text-gray-700 opacity-75" />
          </Button>
        </div>
      </div>
    </div>
  );
}
