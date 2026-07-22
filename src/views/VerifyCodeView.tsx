import React, { useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { Mail, ShieldAlert } from "lucide-react";
import { OtpInput } from "../components/OtpInput";
import { Button } from "../components/Button";
import { apiManager } from "../api/auth";

export const VerifyCodeView: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email as string | undefined;

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setErrorMessage("Por favor ingresa los 6 dígitos del código.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await apiManager.post("Users/AuthCode", {
        email: email,
        code: code,
      });
      console.log(response.data);
      if(response.data.success == true){
        navigate("/ResetPassword", { state: { email } });

      }

    } catch (error: any) {
      setErrorMessage("El código de verificación no es válido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl z-10 text-center">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-xl shadow-lg mb-1">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Ingresa el código
          </h1>
          <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
            Hemos enviado un código de 6 dígitos a{" "}
            <span className="text-sky-400 font-medium">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-6">
          {errorMessage && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg flex items-center justify-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <OtpInput
            length={6}
            disabled={isLoading}
            onComplete={(completedCode) => setCode(completedCode)}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            disabled={code.length < 6}
          >
            Verificar Código
          </Button>
        </form>
      </div>
    </div>
  );
};
