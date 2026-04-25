// ⁘[ APP ~ ROUTER ]⁘

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguagePicker } from "@/components/ui/LanguagePicker";

// lazy load pages
const HomePage = lazy(() => import("@/pages/HomePage").then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const EstablishmentPage = lazy(() => import("@/pages/EstablishmentPage").then((m) => ({ default: m.EstablishmentPage })));
const ProfilePage = lazy(() => import("@/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })));
const FeedPage = lazy(() => import("@/pages/FeedPage").then((m) => ({ default: m.FeedPage })));
const ExplorePage = lazy(() => import("@/pages/ExplorePage").then((m) => ({ default: m.ExplorePage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));
const AddPlacePage = lazy(() => import("@/pages/AddPlacePage").then((m) => ({ default: m.AddPlacePage })));
const OwnerDashboardPage = lazy(() => import("@/pages/OwnerDashboardPage").then((m) => ({ default: m.OwnerDashboardPage })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguagePicker />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}><HomePage /></Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<PageLoader />}><LoginPage /></Suspense>
              }
            />
            <Route
              path="/establishment/:id"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}><EstablishmentPage /></Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/feed"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}><FeedPage /></Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/explore"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}><ExplorePage /></Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/add-place"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}><AddPlacePage /></Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="/owner"
              element={
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}><OwnerDashboardPage /></Suspense>
                </ErrorBoundary>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
