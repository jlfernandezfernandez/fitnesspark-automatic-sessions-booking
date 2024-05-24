import Link from "next/link";
import Image from "next/image";
import FitnessParkLogo from "../components/fitnesspark-logo";

export function StartPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-lg w-full space-y-6 px-4">
        <div className="flex flex-col items-center space-y-2">
          <Image
            src="/svg/dumbbell-icon.svg"
            alt="Dumbbell Icon"
            width={48}
            height={48}
            className="text-gray-900 dark:text-gray-50"
          />
          <div className="mb-4 font-semibold">
            <h1 className="lg:text-4xl text-3xl animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent pb-2">
              Autobooking
              <span className="lg:text-base text-sm italic text-gray-fitnesspark font-cactus mx-1">
                |
              </span>
              <FitnessParkLogo
                size="lg:text-lg text-base"
                underlineOffset="underline-offset-4"
              />
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Reserva tus sesiones de manera{" "}
            <span className="underline">automática</span>, y no te pierdas
            ninguna.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-teal-600 dark:text-gray-50 dark:hover:bg-teal-500 dark:focus-visible:ring-teal-400"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-50 dark:focus-visible:ring-gray-600"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </main>
  );
}
