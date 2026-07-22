import React, { useState } from "react";
import { useLocation, Navigate, useNavigate, Link } from "react-router-dom";
import { Lock, KeyRound, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { apiManager } from "../api/auth";

interface LocationState {
  email?: string;
  code?: string;
}

export const ResetPasswordView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  const email = state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "La contraseña debe incluir al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiManager.patch("/Users/ChangePassword", {
        email: email,
        newPassword: password,
        confirmNewPassword: confirmPassword,
      });
      if (response.data.success === true) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      }
    } catch (err: any) {
      setErrorMessage("Ocurrió un error al restablecer la contraseña. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl z-10">
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              ¡Contraseña actualizada!
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Tu contraseña ha sido restablecida correctamente. Redirigiendo al
              inicio de sesión...
            </p>

            <Link
              to="/login"
              className="w-full mt-4 text-white bg-sky-600 hover:bg-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors block text-center"
            >
              Ir a Iniciar Sesión ahora
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center text-center gap-2 mb-8">
              <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-xl shadow-lg mb-1">
                <KeyRound className="h-6 w-6 text-white" />
              </div>

              <h1 className="text-2xl font-bold text-white tracking-tight">
                Nueva Contraseña
              </h1>

              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Ingresa y confirma la nueva contraseña para la cuenta{" "}
                <span className="text-sky-400 font-medium">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg flex items-center justify-center gap-2 text-center">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Nueva Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                required
              />

              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={
                  confirmPassword && password !== confirmPassword
                    ? "Las contraseñas no coinciden"
                    : undefined
                }
                icon={<Lock className="h-4 w-4" />}
                required
              />

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={
                  !password || !confirmPassword || password !== confirmPassword
                }
              >
                Restablecer Contraseña
              </Button>

              <div className="flex justify-center text-xs text-slate-400 mt-1">
                <Link
                  to="/login"
                  className="text-sky-400 hover:text-white transition-colors"
                >
                  Cancelar y volver al inicio de sesión
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
