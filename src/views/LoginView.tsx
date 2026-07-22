import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useAuth } from "../context/AuthContext";
import { apiAuth } from "../api/auth";
import { Link } from "react-router-dom";

export const LoginView: React.FC = () => {
  const { login } = useAuth();

  // Estados para el formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Estados de sesion rapida
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined,
  );

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!email) {
      setEmailError("El correo electrónico es obligatorio.");
      return;
    }
    if (!password) {
      setPasswordError("La contraseña es obligatoria.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiAuth.post("/auth/login", {
        email,
        password,
      });
      const tokenResult = response.data.token;

      if (tokenResult && tokenResult.success && tokenResult.data) {
        login(tokenResult.data, rememberMe);
      } else {

        console.log("La respuesta no pasó la validación:", tokenResult);
      }
    } catch (err: any) {
      const message = err.response?.data?.message;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl z-10">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-xl shadow-lg">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Bienvenido a AccountManager
          </h1>
          <p className="text-sm text-slate-400">
            Ingresa tus credenciales para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="nombre@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            icon={<Mail className="h-4 w-4" />}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            icon={<Lock className="h-4 w-4" />}
          />

          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-0 cursor-pointer"
              />
              <span>Recordarme</span>
            </label>
            <Link to="/register" className="hover:text-white transition-colors">
              Crea una cuenta
            </Link>
            <Link to="/sendPasswordChangeEmail" className="hover:text-white transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </div>
  );
};
