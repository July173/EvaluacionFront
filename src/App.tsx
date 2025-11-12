import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/MainLayout/ProtectedRoute";
import { AuthProvider } from "./hook/AuthProvider";
import Index from "./pages/Index";
import {  NotFound, Home,  } from "./pages/RoutesIndex";
import React from "react";
import MainLayout from "./layout/MainLayout";

const queryClient = new QueryClient();

// Componente wrapper para las rutas protegidas
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Ruta pública */}
            <Route path="/" element={<Index />} />

            {/* Rutas protegidas con layout */}
            <Route element={<ProtectedLayout />}>
              <Route path="/home" element={<Home />} />

            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;