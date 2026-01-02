import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { RealtimeProvider } from './contexts/RealtimeProvider'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import AppLayout from './components/AppLayout'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import About from './pages/About'
import Comparison from './pages/Comparison'
import Documentation from './pages/Documentation'
import Support from './pages/Support'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Dashboard from './pages/Dashboard'
import Learning from './pages/Learning'
import Jobs from './pages/Jobs'
import Recruiters from './pages/Recruiters'
import Projects from './pages/Projects'
import Content from './pages/Content'
import Goals from './pages/Goals'
import Analytics from './pages/Analytics'
import Calendar from './pages/Calendar'
import WeeklyReview from './pages/WeeklyReview'
import Profile from './pages/Profile'
import Notes from './pages/Notes'

const queryClient = new QueryClient()

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <RealtimeProvider>
              <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/about" element={<About />} />
              <Route path="/comparison" element={<Comparison />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="learning" element={<Learning />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="recruiters" element={<Recruiters />} />
                <Route path="projects" element={<Projects />} />
                <Route path="content" element={<Content />} />
                <Route path="goals" element={<Goals />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="review" element={<WeeklyReview />} />
                <Route path="notes" element={<Notes />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </RealtimeProvider>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App

