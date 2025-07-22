import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import MapExplorer from "./pages/MapExplorer";
import AddCatch from "./pages/AddCatch";
import Profile from "./pages/Profile";
import SpotDetails from "./pages/SpotDetails";
import About from "./pages/About";
import VerifySuccess from "./pages/VerifySuccess";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map-explorer" element={<MapExplorer />} />
          <Route path="/spot/:id" element={<SpotDetails />} />
          <Route path="/add-catch" element={<AddCatch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/verified-success" element={<VerifySuccess />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
