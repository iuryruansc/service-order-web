import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleFormSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos corretamente.");
      return;
    }

    try {
      setLoading(true);
      const data = await login(email, password);
      auth.loginContext(data.access_token);
      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Erro desconhecido ao iniciar sessão.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "60px auto",
        padding: "28px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: 0, color: "#1e293b", fontSize: "28px" }}>
          Bem-vindo ao ServiceOS
        </h1>
        <p style={{ margin: "10px 0 0", color: "#64748b" }}>
          Faça login para acessar o dashboard e gerenciar ordens de serviço.
        </p>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div style={{ marginBottom: "18px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#0f172a",
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
              color: "#475569",
            }}
          >
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#f8fafc",
              color: "#0f172a",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: loading ? "#94a3b8" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 700,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {errorMessage && (
        <p style={{ color: "#dc2626", marginTop: "18px", fontWeight: 600 }}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
