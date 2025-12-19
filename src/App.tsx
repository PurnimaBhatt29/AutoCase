import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import LegalQuery from "./pages/LegalQuery";
import CaseBriefs from "./pages/CaseBriefs";
import CompareCases from "./pages/CompareCases";
import ActsStatutes from "./pages/ActsStatutes";
import ChatResearch from "./pages/ChatResearch";
import UploadDocument from "./pages/UploadDocument";
import VoiceQuery from "./pages/VoiceQuery";
import History from "./pages/History";
import SavedReports from "./pages/SavedReports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/query" element={<LegalQuery />} />
            <Route path="/dashboard/briefs" element={<CaseBriefs />} />
            <Route path="/dashboard/compare" element={<CompareCases />} />
            <Route path="/dashboard/statutes" element={<ActsStatutes />} />
            <Route path="/dashboard/chat" element={<ChatResearch />} />
            <Route path="/dashboard/upload" element={<UploadDocument />} />
            <Route path="/dashboard/voice" element={<VoiceQuery />} />
            <Route path="/dashboard/history" element={<History />} />
            <Route path="/dashboard/reports" element={<SavedReports />} />
            <Route path="/dashboard/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
