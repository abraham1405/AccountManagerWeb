import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { HomeView } from "./views/HomeView";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProfileView } from "./views/ProfileView";

const AppRoutes = () => {
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginView /> : <Navigate to="/home" replace />
          }
        />

        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <RegisterView />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route element={<DashboardLayout />}>
          <Route path="/home" element={<HomeView />} />
          <Route path="/profile" element={<ProfileView />} />
        </Route>

        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/home" : "/login"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
