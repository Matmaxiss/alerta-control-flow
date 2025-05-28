
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import PanelSelector from "./components/PanelSelector";
import LoginForm from "./components/LoginForm";
import Layout from "./components/Layout";
import DriverDashboardNew from "./components/dashboard/DriverDashboardNew";
import PrensaDashboard from "./components/dashboard/PrensaDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<PanelSelector />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/admin" element={<Layout />} />
              <Route path="/supervisor" element={<Layout />} />
              <Route path="/driver" element={<DriverDashboardNew />} />
              <Route path="/prensa" element={<PrensaDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
