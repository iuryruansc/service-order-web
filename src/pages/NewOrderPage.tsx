import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orders";
import { listClients } from "../services/clients";
import type { Client } from "../services/clients";

export function NewOrderPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // Estados dos campos do formulário
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [clientId, setClientId] = useState("");

  // Estados de controle e dados externos
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega os clientes do banco assim que a página abre
  useEffect(() => {
    async function loadClientsData() {
      if (!token) return;
      try {
        setLoadingClients(true);
        const data = await listClients(token);
        setClients(data);

        if (data.length > 0) {
          setClientId(String(data[0].id));
        }
      } catch (err: unknown) {
        console.error(err);
        setError("Não foi possível carregar a lista de clientes.");
      } finally {
        setLoadingClients(false);
      }
    }

    loadClientsData();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !clientId) return;

    try {
      setSubmitting(true);
      setError(null);

      await createOrder(token, {
        title,
        description,
        priority,
        client_id: Number(clientId),
      });

      // Força o reset do estado antes de navegar para evitar congelamento visual
      setSubmitting(false);
      navigate("/orders");
    } catch (err: unknown) {
      setSubmitting(false); // Libera o botão em caso de erro
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao tentar salvar a ordem de serviço.");
      }
    }
  }

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <h3
        style={{ margin: "0 0 20px 0", color: "#1e293b", textAlign: "center" }}
      >
        ➕ Nova Ordem de Serviço
      </h3>

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            htmlFor="title"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#475569",
              fontSize: "14px",
            }}
          >
            Título do Chamado:
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Troca de tela do servidor"
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
              backgroundColor: "#ffffff",
              color: "#1e293b",
              fontSize: "15px",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: "600",
              color: "#475569",
              fontSize: "14px",
            }}
          >
            Descrição Detalhada:
          </label>
          <textarea
            id="description"
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o problema ou o serviço a ser feito..."
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
              fontFamily: "sans-serif",
              backgroundColor: "#ffffff",
              color: "#1e293b",
              fontSize: "15px",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <label
              htmlFor="priority"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Prioridade:
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#1e293b",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              <option value="low">Baixa (Low)</option>
              <option value="medium">Média (Medium)</option>
              <option value="high">Alta (High)</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label
              htmlFor="client-select"
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Cliente:
            </label>
            <select
              id="client-select"
              required
              value={clientId}
              disabled={loadingClients || clients.length === 0}
              onChange={(e) => setClientId(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
                color: "#1e293b",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              <option value="" disabled>
                {loadingClients
                  ? "Carregando clientes..."
                  : clients.length > 0
                    ? "Selecione um cliente"
                    : "Nenhum cliente cadastrado"}
              </option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/orders")}
            style={{
              padding: "10px 16px",
              backgroundColor: "#94a3b8",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={submitting || loadingClients || clients.length === 0}
            style={{
              padding: "10px 20px",
              backgroundColor: "#22c55e",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            {submitting ? "Salvando..." : "Criar Ordem"}
          </button>
        </div>
      </form>
      {!loadingClients && clients.length === 0 && (
        <div
          style={{
            marginTop: "18px",
            color: "#475569",
            backgroundColor: "#f8fafc",
            border: "1px solid #cbd5e1",
            padding: "14px 16px",
            borderRadius: "8px",
          }}
        >
          ⚠️ Não há clientes cadastrados. Cadastre um cliente antes de criar uma
          ordem.
        </div>
      )}
    </div>
  );
}
