import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getOrder,
  getOrderHistory,
  updateOrderStatus,
  type OrderHistoryEntry,
  type ServiceOrder,
} from "../services/orders";

const statusLabels: Record<string, string> = {
  open: "Aberto",
  in_progress: "Em Andamento",
  done: "Concluído",
  cancelled: "Cancelado",
};

const statusOptions: Array<{ value: ServiceOrder["status"]; label: string }> = [
  { value: "open", label: "Aberto" },
  { value: "in_progress", label: "Em Andamento" },
  { value: "done", label: "Concluir" },
  { value: "cancelled", label: "Cancelar" },
];

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case "open":
      return { background: "#fef3c7", color: "#92400e" };
    case "in_progress":
      return { background: "#dbeafe", color: "#1d4ed8" };
    case "done":
      return { background: "#dcfce7", color: "#166534" };
    case "cancelled":
      return { background: "#fee2e2", color: "#991b1b" };
    default:
      return { background: "#f1f5f9", color: "#475569" };
  }
}

function formatDateTime(value?: string | null) {
  if (!value) return "Data desconhecida";

  const normalized =
    typeof value === "string" ? value.replace(" ", "T") : String(value);
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return "Data desconhecida";
  }

  return date.toLocaleString("pt-BR");
}

function getHistoryDate(entry: OrderHistoryEntry) {
  return entry.changed_at || entry.created_at || entry.timestamp || null;
}

export function OrderDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [history, setHistory] = useState<OrderHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    const currentToken = token;
    const orderId = Number(id);

    async function loadOrderDetail() {
      setLoading(true);
      setError(null);

      try {
        const [orderData, orderHistory] = await Promise.all([
          getOrder(currentToken, orderId),
          getOrderHistory(currentToken, orderId),
        ]);

        setOrder(orderData);
        setHistory(orderHistory);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro ao carregar detalhes da ordem.");
        }
      } finally {
        setLoading(false);
      }
    }

    void loadOrderDetail();
  }, [token, id]);

  async function handleStatusChange(newStatus: ServiceOrder["status"]) {
    if (!token || !order) return;
    if (order.status === newStatus) return;

    setSaving(true);
    setError(null);

    try {
      await updateOrderStatus(token, order.id, newStatus);
      const [orderData, orderHistory] = await Promise.all([
        getOrder(token, order.id),
        getOrderHistory(token, order.id),
      ]);
      setOrder(orderData);
      setHistory(orderHistory);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao atualizar o status.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return null;
  }

  return (
    <div style={{ maxWidth: "980px", margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#1e293b" }}>Detalhes da Ordem</h2>
          <p style={{ margin: "8px 0 0", color: "#64748b" }}>
            Veja o histórico e altere o status desta ordem.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/orders")}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: "#fff",
            color: "#1e293b",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Voltar para ordens
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          ⏳ Carregando detalhes da ordem...
        </div>
      ) : error ? (
        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      ) : !order ? (
        <div
          style={{
            padding: "20px",
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            color: "#475569",
          }}
        >
          Ordem não encontrada.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "1.2fr 0.8fr",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                padding: "24px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "#1e293b" }}>{order.title}</h3>
                <p style={{ margin: "10px 0 0", color: "#64748b" }}>
                  #{order.id} · Prioridade: {order.priority.toUpperCase()}
                </p>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#475569",
                  }}
                >
                  Descrição
                </strong>
                <p style={{ margin: 0, color: "#475569" }}>
                  {order.description || "Sem descrição disponível."}
                </p>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                <div>
                  <strong style={{ color: "#475569" }}>Criado em</strong>
                  <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    {formatDateTime(order.created_at)}
                  </p>
                </div>
                <div>
                  <strong style={{ color: "#475569" }}>Cliente</strong>
                  <p style={{ margin: "6px 0 0", color: "#64748b" }}>
                    {order.client_id}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "24px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
              }}
            >
              <div style={{ marginBottom: "18px" }}>
                <strong
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#475569",
                  }}
                >
                  Status atual
                </strong>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    fontSize: "14px",
                    backgroundColor: getStatusBadgeStyle(order.status)
                      .background,
                    color: getStatusBadgeStyle(order.status).color,
                  }}
                >
                  {statusLabels[order.status] ?? order.status}
                </span>
              </div>

              <label
                htmlFor="status-select"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#475569",
                }}
              >
                Alterar status
              </label>
              <select
                id="status-select"
                value={order.status}
                disabled={
                  saving ||
                  order.status === "done" ||
                  order.status === "cancelled"
                }
                onChange={(e) =>
                  handleStatusChange(e.target.value as ServiceOrder["status"])
                }
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  padding: "12px 14px",
                  fontSize: "15px",
                  color: "#0f172a",
                  backgroundColor: "#fff",
                  marginBottom: "18px",
                }}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              padding: "24px",
              backgroundColor: "#fff",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            }}
          >
            <h3 style={{ margin: 0, color: "#1e293b", marginBottom: "18px" }}>
              Histórico de alterações
            </h3>
            {history.length === 0 ? (
              <p style={{ margin: 0, color: "#64748b" }}>
                Ainda não há histórico de status para esta ordem.
              </p>
            ) : (
              <div style={{ display: "grid", gap: "16px" }}>
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      backgroundColor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#1e293b" }}>
                          {statusLabels[entry.status] ?? entry.status}
                        </strong>
                        <p
                          style={{
                            margin: "6px 0 0",
                            color: "#64748b",
                            fontSize: "14px",
                          }}
                        >
                          {formatDateTime(getHistoryDate(entry))}
                        </p>
                      </div>
                      <span style={{ color: "#475569", fontSize: "14px" }}>
                        {entry.changed_by || "Sistema"}
                      </span>
                    </div>
                    {entry.note && (
                      <p style={{ margin: "12px 0 0", color: "#475569" }}>
                        {entry.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
