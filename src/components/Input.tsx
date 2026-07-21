import React from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  type,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const isPasswordType = type === "password";
  const inputType = isPasswordType ? (showPassword ? "text" : "password") : type;
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-slate-400">{icon}</div>}
        
        <input
          {...props}
          type={inputType}
          className={`w-full bg-slate-900/50 border ${
            error
              ? "border-rose-500 focus:ring-rose-500"
              : "border-slate-700 focus:ring-sky-500"
          } text-slate-100 placeholder-slate-500 text-sm rounded-lg block w-full ${
            icon ? "pl-10" : "pl-3"
          } ${
            isPasswordType ? "pr-10" : "pr-3" 
          } p-2.5 outline-none transition-all focus:ring-2 focus:border-transparent`}
        />

        
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded outline-none focus:ring-1 focus:ring-sky-500"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
    </div>
  );
};
