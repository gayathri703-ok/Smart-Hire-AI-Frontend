import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Pages
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import DashboardPage      from './pages/DashboardPage';
import ResumePage         from './pages/ResumePage';
import AnalyzerPage       from './pages/AnalyzerPage';
import ResultsPage        from './pages/ResultsPage';
import ReportPage         from './pages/ReportPage';
import AnalyticsPage      from './pages/AnalyticsPage';
import JobBoardPage       from './pages/JobBoardPage';
import ApplicationsPage   from './pages/ApplicationsPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJobPage        from './pages/PostJobPage';
import MyJobsPage         from './pages/MyJobsPage';
import CandidatesPage     from './pages/CandidatesPage';
import AIFeedbackPage from './pages/AIFeedbackPage';

// Layout wrapper for protected pages
function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Candidate routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="candidate">
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/resume" element={
              <ProtectedRoute role="candidate">
                <AppLayout><ResumePage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/ai-feedback" element={
  <ProtectedRoute role="candidate">
    <AppLayout><AIFeedbackPage /></AppLayout>
  </ProtectedRoute>
}/>
            <Route path="/analyzer" element={
              <ProtectedRoute role="candidate">
                <AppLayout><AnalyzerPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/results" element={
              <ProtectedRoute role="candidate">
                <AppLayout><ResultsPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/report" element={
              <ProtectedRoute role="candidate">
                <AppLayout><ReportPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/jobs" element={
              <ProtectedRoute role="candidate">
                <AppLayout><JobBoardPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/applications" element={
              <ProtectedRoute role="candidate">
                <AppLayout><ApplicationsPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/analytics" element={
              <ProtectedRoute role="candidate">
                <AppLayout><AnalyticsPage /></AppLayout>
              </ProtectedRoute>
            }/>

            {/* Recruiter routes */}
            <Route path="/recruiter" element={
              <ProtectedRoute role="recruiter">
                <AppLayout><RecruiterDashboard /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/recruiter/post-job" element={
              <ProtectedRoute role="recruiter">
                <AppLayout><PostJobPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/recruiter/my-jobs" element={
              <ProtectedRoute role="recruiter">
                <AppLayout><MyJobsPage /></AppLayout>
              </ProtectedRoute>
            }/>
            <Route path="/recruiter/candidates" element={
              <ProtectedRoute role="recruiter">
                <AppLayout><CandidatesPage /></AppLayout>
              </ProtectedRoute>
            }/>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}