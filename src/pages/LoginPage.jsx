import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import api from "../lib/axiosConfig";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", contrasenia: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.contrasenia.trim()) {
      setError("Completa todos los campos.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", {
        email: form.email.trim(),
        contrasenia: form.contrasenia,
      });
      const token = data?.data?.token;
      if (!token) throw new Error("Token no recibido");
      localStorage.setItem("accessToken", token);
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || "Credenciales incorrectas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1a1a2e" }}
    >
      {/* Destellos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #dc2626, transparent)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #dc2626, transparent)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl px-8 py-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="font-KiwiFruit text-5xl flex leading-none mb-3">
            <span className="text-red-600">Mix</span>
            <span className="text-gray-900">&amp;Match</span>
          </div>
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "#1a1a2e" }}
          >
            Panel Administrativo
          </span>
          <div className="mt-3 w-10 h-0.5 bg-red-600 rounded-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1 font-Poppins">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@ejemplo.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1 font-Poppins">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="contrasenia"
                value={form.contrasenia}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-lg text-sm font-Poppins focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-Poppins">
              {error}
            </p>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full py-2.5 text-white font-semibold rounded-lg text-sm font-Poppins transition-colors disabled:opacity-60"
            style={{ backgroundColor: loading ? "#f87171" : "#dc2626" }}
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6 font-Poppins">
          Solo acceso autorizado · Mix&amp;Match
        </p>
      </motion.div>
    </div>
  );
}
