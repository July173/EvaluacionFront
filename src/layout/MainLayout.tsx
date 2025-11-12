
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/MainLayout/Footer";
import Menu from "../components/MainLayout/Menu";
import { useUserData } from "../hook/useUserData";

export default function MainLayout() {
  const { userData, isLoading } = useUserData();
  const [activeModule, setActiveModule] = useState<string>("");
  const [activeFormName, setActiveFormName] = useState<string>("");

  // Function to get user name
  const getUserName = () => {
    if (userData?.email) {
      const emailPart = userData.email.split("@")[0];
      const nameParts = emailPart.split(".");
      return nameParts
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
    return "Usuario";
  };

  // Receives menu click and updates breadcrumb
  const handleMenuItemClick = (form) => {
    setActiveModule(form.moduleName); // Make sure the form object has moduleName
    setActiveFormName(form.name);
  };

  if (isLoading) {
    // 👇 while loading, shows a simple loading screen
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  // 👇 now the layout always returns the structure
  return (
    <div className="flex h-screen overflow-hidden w-full bg-[#D9D9D9]">
      <Menu
        className="h-screen flex-shrink-0 "
      />
      <div className="flex-1 overflow-y-auto ">
        <div className="sticky top-0 z-30 ">
        </div>
        <main className="flex-1 p-4 ">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
