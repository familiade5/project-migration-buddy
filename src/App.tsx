import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Imobiliaria from "./pages/Imobiliaria";
import FinancingCalculator from "./pages/FinancingCalculator";
import EducationalPostGenerator from "./pages/EducationalPostGenerator";
import NotFound from "./pages/NotFound";
import AMAuth from "./pages/am/AMAuth";
import ApartamentosManausPage from "./pages/am/ApartamentosManausPage";
import AMLibrary from "./pages/am/AMLibrary";
import AMAdmin from "./pages/am/AMAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/imobiliaria" element={
              <ProtectedRoute requireAdmin>
                <Imobiliaria />
              </ProtectedRoute>
            } />
            <Route path="/calculadora" element={
              <ProtectedRoute>
                <FinancingCalculator />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/educativo" element={
              <ProtectedRoute>
                <EducationalPostGenerator />
              </ProtectedRoute>
            } />
            {/* Apartamentos Manaus – separate brand, same auth */}
            <Route path="/am/auth" element={<AMAuth />} />
            <Route path="/apartamentos-manaus" element={
              <ProtectedRoute>
                <ApartamentosManausPage />
              </ProtectedRoute>
            } />
            <Route path="/apartamentos-manaus/biblioteca" element={
              <ProtectedRoute>
                <AMLibrary />
              </ProtectedRoute>
            } />
            <Route path="/apartamentos-manaus/admin" element={
              <ProtectedRoute requireAdmin>
                <AMAdmin />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
