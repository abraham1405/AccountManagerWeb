import React, { useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (code: string) => void;
  disabled?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  disabled = false,
}) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Solo permitir números
    if (!/^[0-9]*$/.test(value)) return;

    // Tomar solo el último carácter ingresado
    const newDigit = value.slice(-1);
    const newCode = [...code];
    newCode[index] = newDigit;
    setCode(newCode);

    // Si escribió un número y no estamos en el último recuadro, pasar al siguiente
    if (newDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Verificar si el código está completo para emitirlo al componente padre
    const combinedCode = newCode.join("");
    if (combinedCode.length === length) {
      onComplete(combinedCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Si presiona borrar (Backspace) y la casilla actual está vacía, mover al cuadro anterior
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Validar que sean solo números y recortar a la longitud deseada (6)
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, length).split("");
    const newCode = [...code];

    digits.forEach((digit, i) => {
      newCode[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = digit;
      }
    });

    setCode(newCode);

    // Mover el foco al último input rellenado
    const focusIndex = Math.min(digits.length, length - 1);
    inputRefs.current[focusIndex]?.focus();

    if (newCode.join("").length === length) {
      onComplete(newCode.join(""));
    }
  };

  return (
    <div className="flex justify-between gap-2 max-w-xs mx-auto my-2">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {inputRefs.current[index] = el}}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-xl font-bold text-white bg-slate-900/60 border border-slate-700/80 rounded-xl focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all shadow-inner disabled:opacity-50"
        />
      ))}
    </div>
  );
};