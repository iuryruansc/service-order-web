import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listOrders, updateOrderStatus } from "../services/orders";
import type { ServiceOrder } from "../services/orders";

export function OrdersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para armazenar o filtro ativo (Vazio significa "Todas")
  const [statusFilter, setStatusFilter] = useState<ServiceOrder["status"] | "">(
    "",
  );

  // Carrega as ordens sempre que o token ou o filtro mudarem
  const loadOrdersData = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      // Passa o filtro ativo direto para o serviço que injeta via Query Params
      const data = await listOrders(token, statusFilter || undefined);
      setOrders(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao carregar ordens de serviço.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    async function loadOrdersOnMount() {
      await loadOrdersData();
    }

    void loadOrdersOnMount();
  }, [loadOrdersData]);

  // Função disparada quando o usuário muda o select de status de uma linha
  async function handleStatusChange(
    orderId: number,
    currentStatus: ServiceOrder["status"],
    newStatus: ServiceOrder["status"],
  ) {
    if (!token) return;
    if (currentStatus === newStatus) return;

    try {
      setError(null);
      await updateOrderStatus(token, orderId, newStatus);

      // Atualiza a listagem local para refletir a mudança
      await loadOrdersData();
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(`Ação não permitida: ${err.message}`);
      } else {
        alert("Não foi possível alterar o status desta ordem.");
      }
      // Força recarga para resetar o select visual ao valor correto do banco
      await loadOrdersData();
    }
  }

  // Helper para traduzir e colorir as badges de status
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "open":
        return { label: "Aberto", bg: "#fef3c7", text: "#d97706" };
      case "in_progress":
        return { label: "Em Andamento", bg: "#dbeafe", text: "#2563eb" };
      case "done":
        return { label: "Concluído", bg: "#dcfce7", text: "#15803d" };
      case "cancelled":
        return { label: "Cancelado", bg: "#fee2e2", text: "#991b1b" };
      default:
        return { label: status, bg: "#f1f5f9", text: "#475569" };
    }
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
      {/* Topo da página */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#1e293b" }}>
            🛠️ Painel de Ordens de Serviço
          </h2>
          {!loading && (
            <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>
              {orders.length} ordem{orders.length === 1 ? "" : "s"} carregada(s)
            </p>
          )}
        </div>
        <button
          onClick={() => navigate("/orders/new")}
          style={{
            padding: "10px 18px",
            backgroundColor: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ➕ Nova Ordem
        </button>
      </div>

      {/* Barra de Filtros rápidos */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setStatusFilter("")}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontWeight: "500",
            cursor: "pointer",
            backgroundColor: statusFilter === "" ? "#1e293b" : "#fff",
            color: statusFilter === "" ? "#fff" : "#475569",
          }}
        >
          Todas
        </button>
        <button
          onClick={() => setStatusFilter("open")}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontWeight: "500",
            cursor: "pointer",
            backgroundColor: statusFilter === "open" ? "#d97706" : "#fff",
            color: statusFilter === "open" ? "#fff" : "#475569",
          }}
        >
          Abertas
        </button>
        <button
          onClick={() => setStatusFilter("in_progress")}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontWeight: "500",
            cursor: "pointer",
            backgroundColor:
              statusFilter === "in_progress" ? "#2563eb" : "#fff",
            color: statusFilter === "in_progress" ? "#fff" : "#475569",
          }}
        >
          Em Andamento
        </button>
        <button
          onClick={() => setStatusFilter("done")}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontWeight: "500",
            cursor: "pointer",
            backgroundColor: statusFilter === "done" ? "#15803d" : "#fff",
            color: statusFilter === "done" ? "#fff" : "#475569",
          }}
        >
          Concluídas
        </button>
        <button
          onClick={() => setStatusFilter("cancelled")}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #cbd5e1",
            fontWeight: "500",
            cursor: "pointer",
            backgroundColor: statusFilter === "cancelled" ? "#991b1b" : "#fff",
            color: statusFilter === "cancelled" ? "#fff" : "#475569",
          }}
        >
          Canceladas
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "6px",
            marginBottom: "20px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
          ⏳ A carregar ordens de serviço...
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "40px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Nenhuma ordem de serviço encontrada para este filtro.
        </div>
      ) : (
        /* Tabela Operacional */
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                    width: "70px",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                  }}
                >
                  Título / Chamado
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                    width: "12px",
                  }}
                >
                  Prioridade
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                    width: "140px",
                  }}
                >
                  Status Atual
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                    width: "180px",
                  }}
                >
                  Alterar Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const badge = getStatusBadgeStyle(order.status);
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        color: "#64748b",
                        fontWeight: "500",
                      }}
                    >
                      #{order.id}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: "600", color: "#1e293b" }}>
                        {order.title}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          marginTop: "2px",
                        }}
                      >
                        {order.description || "Sem descrição."}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color:
                            order.priority === "high"
                              ? "#ef4444"
                              : order.priority === "medium"
                                ? "#f59e0b"
                                : "#10b981",
                        }}
                      >
                        {order.priority.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          backgroundColor: badge.bg,
                          color: badge.text,
                        }}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {/* Seletor dinâmico de status acoplado ao ciclo de vida */}
                      <select
                        value={order.status}
                        disabled={
                          order.status === "done" ||
                          order.status === "cancelled"
                        } // Trava se o fluxo já tiver encerrado
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            order.status,
                            e.target.value as ServiceOrder["status"],
                          )
                        }
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "#fff",
                          color: "#1e293b",
                          fontSize: "13px",
                          fontWeight: "500",
                          width: "100%",
                        }}
                      >
                        <option value="open">Aberto</option>
                        <option value="in_progress">Em Andamento</option>
                        <option value="done">Concluir</option>
                        <option value="cancelled">Cancelar</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
