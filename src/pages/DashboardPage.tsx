import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "../services/dashboard";

const metricLabels: Record<string, string> = {
  total: "Total de Ordens",
  open: "Abertas",
  in_progress: "Em Andamento",
  done: "Concluídas",
  cancelled: "Canceladas",
  total_open: "Abertas",
  total_in_progress: "Em Andamento",
  total_done: "Concluídas",
  total_cancelled: "Canceladas",
};

const metricColors: Record<string, { bg: string; text: string }> = {
  total: { bg: "#e2e8f0", text: "#0f172a" },
  open: { bg: "#fef3c7", text: "#92400e" },
  in_progress: { bg: "#dbeafe", text: "#1d4ed8" },
  done: { bg: "#dcfce7", text: "#166534" },
  cancelled: { bg: "#fee2e2", text: "#991b1b" },
  total_open: { bg: "#fef3c7", text: "#92400e" },
  total_in_progress: { bg: "#dbeafe", text: "#1d4ed8" },
  total_done: { bg: "#dcfce7", text: "#166534" },
  total_cancelled: { bg: "#fee2e2", text: "#991b1b" },
};

function formatMetricKey(key: string) {
  return (
    metricLabels[key] ??
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export function DashboardPage() {
  const { token } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardMetrics(token);
        setMetrics(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Não foi possível carregar o dashboard.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  const entries = Object.entries(metrics).filter(
    ([, value]) => typeof value === "number",
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#1e293b" }}>📊 Dashboard</h2>
          <p style={{ margin: "8px 0 0 0", color: "#475569" }}>
            Resumo das ordens de serviço com métricas reais da API.
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "14px",
            borderRadius: "8px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          ⏳ A carregar métricas do dashboard...
        </div>
      ) : entries.length === 0 ? (
        <div
          style={{
            padding: "40px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            color: "#475569",
            textAlign: "center",
          }}
        >
          Nenhuma métrica disponível para exibir no dashboard.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "18px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {entries.map(([key, value]) => {
            const color = metricColors[key] ?? {
              bg: "#f8fafc",
              text: "#0f172a",
            };
            return (
              <div
                key={key}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    marginBottom: "14px",
                    color: color.text,
                  }}
                >
                  {formatMetricKey(key)}
                </div>
                <div
                  style={{
                    fontSize: "38px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
