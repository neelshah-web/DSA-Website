import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/lib/theme';
import { Navbar } from '@/components/navbar';

// Pages
import HomePage from './pages/Index';
import ProblemsPage from './pages/Problems';
import ProblemDetailPage from './pages/ProblemDetail';
import DailyPuzzlesPage from './pages/DailyPuzzles';
import RoadmapsPage from './pages/Roadmaps';
import RoadmapDetailPage from './pages/RoadmapDetail';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import DiscussPage from './pages/Discuss';
import NotFoundPage from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="codecraft-theme">
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/problems/:id" element={<ProblemDetailPage />} />
                <Route path="/daily-puzzles" element={<DailyPuzzlesPage />} />
                <Route path="/roadmaps" element={<RoadmapsPage />} />
                <Route path="/roadmaps/:id" element={<RoadmapDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/discuss" element={<DiscussPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;