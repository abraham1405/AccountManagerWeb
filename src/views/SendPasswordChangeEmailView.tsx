import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { apiManager } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export const SenPasswordChangeEmailView: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setEmailError(undefined);

    if (!email) {
      setEmailError("El correo electrónico es obligatorio.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiManager.post(
        `/Users/AskForPasswordReset?email=${encodeURIComponent(email)}`,
      );

      if (response.data.success == true) {
        navigate("/VerifyCode", {
          state: { email },
          replace: true,
        });
      }
    } catch {
      setError("Email no valido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl z-10">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-xl shadow-lg mb-1">
            <Send className="h-6 w-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            ¿Olvidaste tu contraseña?
          </h1>

          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            No te preocupes, escribe el correo de tu cuenta y te enviaremos un
            email con un código de verificación.
          </p>

          <p className="text-sm text-slate-400/80 max-w-sm leading-relaxed mt-1">
            Mira en tu bandeja principal o spam para ver el código.
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

          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <Link to="/register" className="hover:text-white transition-colors">
              Crea una cuenta
            </Link>

            <Link to="/login" className="hover:text-white transition-colors">
              Ir a Iniciar Sesión
            </Link>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Enviar código
          </Button>
        </form>
      </div>
    </div>
  );
};
