import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listClients, createClient } from "../services/clients";
import type { Client } from "../services/clients";

export function ClientsPage() {
  const { token } = useAuth();

  // Estados para listagem
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o formulário de cadastro rápido (Modal/Painel Superior)
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Função para carregar a lista de clientes da API
  async function loadClients() {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const data = await listClients(token);
      setClients(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Não foi possível carregar a lista de clientes.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const authToken = token;
    if (!authToken) return;

    async function loadClientsOnMount(authToken: string) {
      try {
        setLoading(true);
        setError(null);
        const data = await listClients(authToken);
        setClients(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Não foi possível carregar a lista de clientes.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadClientsOnMount(authToken);
  }, [token]);

  // Função para cadastrar o cliente
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    try {
      setSubmitting(true);
      setFormError(null);

      await createClient(token, {
        name,
        email,
        phone: phone || undefined, // Evita enviar string vazia se for opcional
      });

      // Limpa os campos do formulário e fecha
      setName("");
      setEmail("");
      setPhone("");
      setShowForm(false);

      // Atualiza a tabela com o novo cliente adicionado
      await loadClients();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Erro ao tentar cadastrar o cliente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      {/* Cabeçalho da Página */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, color: "#1e293b" }}>👥 Gestão de Clientes</h2>
          <p style={{ margin: "8px 0 0 0", color: "#64748b" }}>
            {clients.length} cliente{clients.length === 1 ? "" : "s"} cadastrado
            {clients.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 16px",
            backgroundColor: showForm ? "#64748b" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {showForm ? "✖️ Fechar Formulário" : "➕ Novo Cliente"}
        </button>
      </div>

      {/* Formulário Retrátil para Adicionar Cliente */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            marginBottom: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <h4 style={{ margin: "0 0 16px 0", color: "#1e293b" }}>
            📝 Cadastrar Novo Cliente
          </h4>

          {formError && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              ⚠️ {formError}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              alignItems: "flex-end",
            }}
          >
            <div style={{ flex: "1 1 250px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Nome Completo:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: ACME Corporation"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#fff",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ flex: "1 1 250px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                E-mail de Contacto:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: contacto@acme.com"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#fff",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ flex: "1 1 200px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontWeight: "600",
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Telefone (Opcional):
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +351 912 345 678"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "#fff",
                  color: "#1e293b",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "9px 20px",
                backgroundColor: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                height: "38px",
              }}
            >
              {submitting ? "A guardar..." : "Salvar Cliente"}
            </button>
          </form>
        </div>
      )}

      {/* Alertas de Erro ou Loading da Lista */}
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
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            color: "#64748b",
            fontWeight: "500",
          }}
        >
          ⏳ A carregar lista de clientes...
        </div>
      ) : clients.length === 0 ? (
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
          Nenhum cliente cadastrado no sistema até ao momento.
        </div>
      ) : (
        /* Tabela de Listagem */
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
                    width: "80px",
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
                  Nome
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                  }}
                >
                  E-mail
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                  }}
                >
                  Telefone
                </th>
                <th
                  style={{
                    padding: "14px 16px",
                    color: "#475569",
                    fontWeight: "600",
                    width: "100px",
                  }}
                >
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#64748b",
                      fontWeight: "500",
                    }}
                  >
                    #{client.id}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#1e293b",
                      fontWeight: "600",
                    }}
                  >
                    {client.name}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569" }}>
                    {client.email}
                  </td>
                  <td style={{ padding: "14px 16px", color: "#475569" }}>
                    {client.phone || "—"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: client.is_active
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: client.is_active ? "#15803d" : "#991b1b",
                      }}
                    >
                      {client.is_active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
