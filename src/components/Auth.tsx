"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface AuthProps {
  onAuth: () => void;
}

export default function Auth({ onAuth }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("Проверьте почту — нажмите ссылку для подтверждения");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message);
      } else {
        onAuth();
      }
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    backgroundColor: "var(--background)",
    color: "var(--foreground)",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      backgroundColor: "var(--background)",
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 48, marginBottom: 8 }}>📝</p>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "var(--foreground)" }}>Записная книжка</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 8 }}>
            {isSignUp ? "Создайте аккаунт" : "Войдите в аккаунт"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 12, backgroundColor: "#fee2e2", color: "#991b1b", fontSize: 14 }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{ padding: "10px 14px", borderRadius: 12, backgroundColor: "#dcfce7", color: "#166534", fontSize: 14 }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              borderRadius: 12,
              backgroundColor: "var(--accent)",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "..." : isSignUp ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "12px",
            background: "none",
            border: "none",
            color: "var(--accent)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {isSignUp ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
        </button>
      </div>
    </div>
  );
}
