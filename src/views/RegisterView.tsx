import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/Input";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  ShieldAlert,
  MailCheck,
} from "lucide-react";
import { apiAuth } from "../api/auth";
import { Button } from "../components/Button";

interface RegisterFormState {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState<RegisterFormState>({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (formState.password !== formState.confirmPassword) {
      setErrorMessage("Las constraseñas no coinciden");
      return;
    }

    if (formState.password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.\-_#])[A-Za-z\d@$!%*?&.\-_#]{8,}$/;
    if (!passwordRegex.test(formState.password)) {
      setErrorMessage(
        "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiAuth.post("/Auth/register", {
        email: formState.email,
        username: formState.userName,
        password: formState.password,
      });
      console.log("aqui es la respuesta del servidor: ", response.data);

      if (response.data.success === true) {
        setSuccessMessage("Cuenta creada con éxito. Redirigiendo al login...");
        setTimeout(() => navigate("/login"), 7000);
        setIsSubmitted(true);
      } else {
        setErrorMessage("error del servidor");
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Error al registrar la cuenta.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl z-10 text-center">
        {isSubmitted ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400">
              <MailCheck className="h-10 w-10" />
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              ¡Verifica tu correo!
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Hemos enviado un enlace de confirmación a{" "}
              <span className="text-sky-400 font-medium">
                {formState.email}
              </span>
              .
            </p>

            <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-xl text-xs text-slate-400 text-left space-y-2 mt-2 w-full">
              <p className="font-semibold text-slate-300">Pasos a seguir:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Abre el email recibido de AccountManager.</li>
                <li>Haz clic en el botón de confirmación.</li>
                <li>Si no lo ves, revisa tu carpeta de **Spam**.</li>
              </ul>
            </div>

            <Link
              to="/login"
              className="w-full mt-4 text-white bg-sky-600 hover:bg-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors block"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2 mb-8">
              <div className="p-3 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-xl shadow-lg">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Crear una cuenta
              </h1>
              <p className="text-sm text-slate-400">
                Regístrate para empezar a gestionar tu perfil
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="flex flex-col gap-5 text-left"
            >
              {errorMessage && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg flex items-center justify-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Input
                label="Nombre de usuario (Apodo)"
                type="text"
                name="userName"
                placeholder="Ej: tu_usuario"
                value={formState.userName}
                onChange={handleChange}
                icon={<User className="h-4 w-4" />}
                required
              />

              <Input
                label="Correo Electrónico"
                type="email"
                name="email"
                placeholder="nombre@gmail.com"
                value={formState.email}
                onChange={handleChange}
                icon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Contraseña"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formState.password}
                onChange={handleChange}
                icon={<Lock className="h-4 w-4" />}
                required
              />

              <Input
                label="Confirmar Contraseña"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formState.confirmPassword}
                onChange={handleChange}
                icon={<Lock className="h-4 w-4" />}
                required
              />

              <Button type="submit" isLoading={isLoading}>
                Registrarse
              </Button>

              <div className="flex justify-center text-xs text-slate-400 mt-1">
                <span>¿Ya tienes cuenta?&nbsp;</span>
                <Link
                  to="/login"
                  className="text-sky-400 hover:text-white transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
