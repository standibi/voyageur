import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  as?: "input" | "select" | "textarea";
  rows?: number;
  children?: React.ReactNode;
}

export default function FormField({ label, as = "input", children, className = "", ...props }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      {as === "input" && <input className={`w-full px-4 py-2 border border-slate-300 rounded-lg ${className}`} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />}
      {as === "select" && (
        <select className={`w-full px-4 py-2 border border-slate-300 rounded-lg ${className}`} {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}>
          {children}
        </select>
      )}
      {as === "textarea" && <textarea className={`w-full px-4 py-2 border border-slate-300 rounded-lg ${className}`} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />}
    </div>
  );
}