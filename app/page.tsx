export default function Home() {
  return (
    <main className="flex h-screen flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 lg:w-2/3 bg-gray-fitnesspark items-center justify-center p-4">
        <div className="text-center">
          {" "}
          <h1 className="lg:text-6xl text-5xl italic font-bold text-yellow-fitnesspark mb-4 font-cactus">
            FitnessPark{" "}
            <span className="lg:text-4xl text-3xl animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text text-transparent pr-1">
              boosted
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Reserva tus sesiones de manera{" "}
            <span className="underline">automática</span>
          </p>
        </div>
      </div>
      <div className="flex-1 w-full md:w-1/2 lg:w-1/3 bg-white flex flex-col items-center justify-center p-4">
        <p className="text-3xl mb-4 font-bold text-black/75">Empieza ahora</p>
        <div className="w-full px-10 flex flex-col md:flex-row md:space-x-2">
          <button className="bg-yellow-fitnesspark text-black font-bold py-2 px-4 rounded w-full md:w-1/2 mb-2 md:mb-0">
            Iniciar Sesión
          </button>
          <button className="bg-white hover:bg-gray-100 border border-black text-black font-bold py-2 px-4 rounded w-full md:w-1/2">
            Registrarse
          </button>
        </div>
      </div>
    </main>
  );
}
