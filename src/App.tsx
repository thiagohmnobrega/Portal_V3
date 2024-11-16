import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { withErrorBoundary } from './components/ErrorBoundary';
import Loading from './components/Loading';

// Eager loaded components
import Login from './pages/Login';
import Layout from './components/Layout';

// Lazy loaded components with proper error handling
const Apps = React.lazy(() => import('./pages/Apps').catch(() => ({ default: () => <div>Error loading Apps</div> })));
const RNCList = React.lazy(() => import('./pages/RNCList').catch(() => ({ default: () => <div>Error loading RNC List</div> })));
const RNCDetail = React.lazy(() => import('./pages/RNCDetail').catch(() => ({ default: () => <div>Error loading RNC Detail</div> })));
const RNCEdit = React.lazy(() => import('./pages/RNCEdit').catch(() => ({ default: () => <div>Error loading RNC Edit</div> })));
const Reports = React.lazy(() => import('./pages/Reports').catch(() => ({ default: () => <div>Error loading Reports</div> })));
const Team = React.lazy(() => import('./pages/Team').catch(() => ({ default: () => <div>Error loading Team</div> })));
const Settings = React.lazy(() => import('./pages/Settings').catch(() => ({ default: () => <div>Error loading Settings</div> })));
const RootCauseAnalysis = React.lazy(() => import('./pages/RootCauseAnalysis').catch(() => ({ default: () => <div>Error loading Root Cause Analysis</div> })));
const FiveWhysAnalysis = React.lazy(() => import('./pages/FiveWhysAnalysis').catch(() => ({ default: () => <div>Error loading Five Whys Analysis</div> })));
const FishboneAnalysis = React.lazy(() => import('./pages/FishboneAnalysis').catch(() => ({ default: () => <div>Error loading Fishbone Analysis</div> })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      suspense: true,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function LoadingFallback() {
  return <Loading />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/apps" element={
                  <PrivateRoute>
                    <Apps />
                  </PrivateRoute>
                } />

                <Route path="/quality" element={
                  <PrivateRoute>
                    <Layout />
                  </PrivateRoute>
                }>
                  <Route index element={<Navigate to="rnc" replace />} />
                  
                  <Route path="rnc" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <RNCList />
                    </Suspense>
                  } />
                  
                  <Route path="rnc/:id" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <RNCDetail />
                    </Suspense>
                  } />
                  
                  <Route path="rnc/:id/edit" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <RNCEdit />
                    </Suspense>
                  } />
                  
                  <Route path="rnc/:id/root-cause" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <RootCauseAnalysis />
                    </Suspense>
                  } />
                  
                  <Route path="rnc/:id/root-cause/five-whys" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <FiveWhysAnalysis />
                    </Suspense>
                  } />
                  
                  <Route path="rnc/:id/root-cause/fishbone" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <FishboneAnalysis />
                    </Suspense>
                  } />
                  
                  <Route path="reports" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Reports />
                    </Suspense>
                  } />
                  
                  <Route path="team" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Team />
                    </Suspense>
                  } />
                  
                  <Route path="settings" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Settings />
                    </Suspense>
                  } />
                </Route>

                <Route path="/" element={<Navigate to="/login" replace />} />
              </Routes>
            </Suspense>
          </Router>
          <Toaster position="top-right" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default withErrorBoundary(App);