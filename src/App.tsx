import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginView } from "./views/LoginView";
import { RegisterView } from "./views/RegisterView";
import { HomeView } from "./views/HomeView";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProfileView } from "./views/ProfileView";
import { SenPasswordChangeEmailView } from "./views/SendPasswordChangeEmailView";
import { VerifyCodeView } from "./views/VerifyCodeView";
import { ResetPasswordView } from "./views/ResetPasswordView";

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

        <Route
          path="/sendPasswordChangeEmail"
          element={
            !isAuthenticated ? (
              <SenPasswordChangeEmailView />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/VerifyCode"
          element={
            !isAuthenticated ? (
              <VerifyCodeView />
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />

        <Route
          path="/ResetPassword"
          element={
            !isAuthenticated ? (
              <ResetPasswordView />
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
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
