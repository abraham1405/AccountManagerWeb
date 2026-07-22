import React, { useState } from "react";
import { useAuth, type UserProfile } from "../context/AuthContext";
import { Input } from "../components/Input";
import {
  User,
  Lock,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { apiAuth, apiManager } from "../api/auth";

export const ProfileView: React.FC = () => {
  const { user, refreshUserProfile } = useAuth();

  const [formState, setFormState] = useState<UserProfile>(user!);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsUpdatingUser(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await apiManager.put("/Users/UpdateMyUser", formState);

      if (response.data && response.data.success === true) {
        refreshUserProfile();
        setSuccessMessage(response.data.message || "Perfil actualizado con éxito.");
      } else {
        setErrorMessage(response.data?.message || "No se pudieron guardar los cambios.");
      }

    } catch (error: any) {
      console.error("Error al actualizar el perfil:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al actualizar el perfil.",
      );
    } finally {
      setIsUpdatingUser(false);
    }
  };

  async function resetPassword(email: string, newPassword: string, confirmPassword: string) {
    try{
      const response = await apiManager.patch("/Users/ChangePassword", {
        Email: email,
        NewPassword: newPassword,
        ConfirmNewPassword: confirmPassword,
      });
      if (response.data.success) {
      console.log("Contraseña actualizada");
      setSuccessMessage("¡El cambio de contraseña ha sido un éxito!");
    } else {
      setErrorMessage(response.data?.message || "No se pudieron guardar los cambios.")
    }
    }catch(err: any){
      console.log(err.response?.data);
    
    const serverError = err.response?.data;
    if (serverError && serverError.errors) {
      const firstKey = Object.keys(serverError.errors)[0];
      setErrorMessage(serverError.errors[firstKey][0]);
    } else {
      setErrorMessage(serverError?.title || "Error al cambiar la contraseña");
    }
    }finally{
      setIsChangingPassword(false);
    }
  }

  const handleChangePassword = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las nuevas contraseñas no coinciden.");
      return;
    }

    setIsChangingPassword(true);
    const email = formState.email;

    try {
      const responseIsCurrentPassword = await apiAuth.post("/Auth/login", {
        email: email,
        password: currentPassword,
      });

      if (responseIsCurrentPassword.data.token.success === true){
        await resetPassword(formState.email, newPassword, confirmPassword);
        setSuccessMessage("Contraseña cambiada con éxito.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword(""); 
      } else{
        setErrorMessage(responseIsCurrentPassword?.data.token.message || "No coincide la contraseña");
      }

    } catch (err: any) {
      setErrorMessage(err.response?.data || "No coincide la contraseña");
    } finally {
      
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Configuración del Perfil
        </h1>
        <p className="text-sm text-slate-400">
          Gestiona la información de tu cuenta y la seguridad.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 rounded-xl text-sm">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 bg-rose-950/40 border border-rose-800 text-rose-400 p-4 rounded-xl text-sm">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <form
          onSubmit={handleUpdateProfile}
          className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl space-y-4"
        >
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <User className="h-4 w-4 text-sky-400" /> Datos Personales
          </h2>

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            icon={<Mail className="h-4 w-4" />}
          />

          <Input
            label="Nombre de usuario (Apodo)"
            type="text"
            name="userName"
            value={formState.userName}
            onChange={handleChange}
            placeholder="Username"
            icon={<User className="h-4 w-4" />}
          />

          <Input
            label="Nombre"
            type="text"
            name="firstName"
            value={formState.firstName}
            onChange={handleChange}
            placeholder="Tu nombre"
            icon={<User className="h-4 w-4" />}
          />
          
          <Input
            label="Apellidos"
            type="text"
            name="lastName"
            value={formState.lastName}
            onChange={handleChange}
            placeholder="Tus apellidos"
            icon={<User className="h-4 w-4" />}
          />

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-slate-300">Número de teléfono</label>
            <div className="relative flex items-center gap-2">
              <div className="relative flex items-center shrink-0">
                <select
                  value={formState.phoneExtension}
                  onChange={handleChange}
                  name="phoneExtension"
                  className="bg-slate-900/50 border border-slate-700 text-slate-100 text-sm rounded-lg p-2.5 outline-none transition-all focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none pr-8 pl-3"
                >
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+54">🇦🇷 +54</option>
                  <option value="+57">🇨🇴 +57</option>
                  <option value="+56">🇨🇱 +56</option>
                  <option value="+51">🇵🇪 +51</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="flex-1">
                <Input
                  label="" 
                  type="tel"
                  name="phoneNumber" 
                  value={formState.phoneNumber}
                  onChange={handleChange}
                  placeholder="600 000 000"
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdatingUser}
            className="w-full text-white bg-sky-600 hover:bg-sky-500 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-lg shadow-sky-600/10 disabled:opacity-50"
          >
            {isUpdatingUser ? "Guardando..." : "Actualizar Datos"}
          </button>
        </form>

        <form
          onSubmit={handleChangePassword}
          className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-6 rounded-2xl space-y-4"
        >
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-400" /> Seguridad
          </h2>

          <Input
            label="Contraseña Actual"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />

          <Input
            label="Nueva Contraseña"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />

          <Input
            label="Confirmar Nueva Contraseña"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full text-white bg-indigo-600 hover:bg-indigo-500 font-medium rounded-lg text-sm px-5 py-2.5 transition-colors shadow-lg shadow-indigo-600/10 disabled:opacity-50"
          >
            {isChangingPassword ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
};