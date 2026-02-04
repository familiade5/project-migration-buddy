import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SuperAdminRoute } from "@/components/SuperAdminRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Imobiliaria from "./pages/Imobiliaria";
import CRM from "./pages/CRM";
import CRMLocacao from "./pages/CRMLocacao";
import FinancingCalculator from "./pages/FinancingCalculator";
import ElitePostGenerator from "./pages/ElitePostGenerator";
import RevendaPostGenerator from "./pages/RevendaPostGenerator";
import LocacaoPostGenerator from "./pages/LocacaoPostGenerator";
import EducationalPostGenerator from "./pages/EducationalPostGenerator";
import NotFound from "./pages/NotFound";

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
            <Route path="/crm" element={
              <ProtectedRoute>
                <CRM />
              </ProtectedRoute>
            } />
            <Route path="/crm-locacao" element={
              <ProtectedRoute>
                <CRMLocacao />
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
            <Route path="/revenda" element={
              <ProtectedRoute>
                <RevendaPostGenerator />
              </ProtectedRoute>
            } />
            <Route path="/locacao" element={
              <ProtectedRoute>
                <LocacaoPostGenerator />
              </ProtectedRoute>
            } />
            <Route path="/elite" element={
              <SuperAdminRoute>
                <ElitePostGenerator />
              </SuperAdminRoute>
            } />
            <Route path="/educativo" element={
              <ProtectedRoute>
                <EducationalPostGenerator />
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
