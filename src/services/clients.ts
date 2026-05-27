const baseUrl = import.meta.env.VITE_API_URL;

export type Client = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
};

export type CreateClientInput = {
  name: string;
  email: string;
  phone?: string;
};

/**
 * Procura todos os clientes cadastrados no Back-end.
 */
export async function listClients(token: string): Promise<Client[]> {
  const response = await fetch(`${baseUrl}/clients/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao listar clientes (Status ${response.status})`);
  }

  return response.json();
}

/**
 * Envia os dados para cadastrar um novo cliente no sistema.
 */
export async function createClient(
  token: string,
  clientData: CreateClientInput,
): Promise<Client> {
  const response = await fetch(`${baseUrl}/clients/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    try {
      const errorBody = await response.json();
      throw new Error(errorBody.detail || "Erro ao cadastrar cliente.");
    } catch {
      throw new Error(`Erro na API (Status ${response.status})`);
    }
  }

  return response.json();
}
