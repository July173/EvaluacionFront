import { useUserData } from "../hook/useUserData";
import { useState } from "react";

export const Home = () => {
  const { userData } = useUserData();
  const [welcomeMessage] = useState("Bienvenido a Orphane");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-3 drop-shadow-sm">
          {welcomeMessage}
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-lg">
          Ayudamos a los niños a encontrar un hogar lleno de amor y esperanza.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-green-100 p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Niños</h3>
          <p className="text-gray-600 text-sm mb-4">Administra los niños bajo nuestro cuidado. Cada niño merece una familia.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-green-100 p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Padres</h3>
          <p className="text-gray-600 text-sm mb-4">Registra o busca padres interesados en adoptar y ofrecer cariño.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-green-100 p-6">
          <h3 className="text-xl font-semibold text-green-700 mb-2">Orfanatos</h3>
          <p className="text-gray-600 text-sm mb-4">Explora los orfanatos, su personal y los niños a su cargo.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
