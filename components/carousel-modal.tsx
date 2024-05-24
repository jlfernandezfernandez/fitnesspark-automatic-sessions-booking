import React, { useState, useEffect } from "react";
import UserForm from "@/components/user-form";
import FitnessParkLogo from "@/components/fitnesspark-logo";

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
        <div className="flex flex-col justify-center items-center space-y-4 p-1 w-full h-full">
          <div>
            <div className="mb-4 font-semibold text-center">
              <h1 className="lg:text-5xl text-2xl animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent pb-2">
                Autobooking
                <span className="lg:text-lg text-base italic text-gray-fitnesspark font-cactus">
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
        </div>
      ),
    },
    {
      content: (
        <div className="flex flex-col justify-center items-center space-y-4 p-1 w-full h-full">
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
        <div className="flex flex-col justify-center items-center space-y-4 p-1 w-full h-full">
          <div className="space-y-2 text-center">
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
      <div className="relative bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg max-w-lg w-full sm:max-w-2xl sm:h-[450px] h-auto p-4">
        <div
          className="absolute inset-y-0 left-0 flex items-center justify-center w-10 cursor-pointer transition-opacity duration-300"
          onClick={prevSlide}
        >
          <div className="flex items-center justify-center w-full h-full opacity-50 hover:opacity-100">
            <span className="sr-only">Previous slide</span>
            <svg
              className="w-6 h-6 text-gray-500 hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </div>
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-center w-10 cursor-pointer transition-opacity duration-300"
          onClick={nextSlide}
        >
          <div className="flex items-center justify-center w-full h-full opacity-50 hover:opacity-100">
            <span className="sr-only">Next slide</span>
            <svg
              className="w-6 h-6 text-gray-500 hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
        <div className="flex-grow mx-3 mb-2 h-full flex justify-center items-center transition-all">
          {slides[currentSlide].content}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full ${
                currentSlide === index
                  ? "bg-gray-800 dark:bg-white"
                  : "bg-gray-400"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
