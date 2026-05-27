const baseUrl = import.meta.env.VITE_API_URL;

// Definir o tipo exato do objeto que o seu Back-end devolve para cada ordem
export type ServiceOrder = {
  id: number;
  title: string;
  description?: string;
  status: "open" | "done" | "in_progress" | "cancelled";
  priority: "low" | "medium" | "high";
  client_id: number;
  responsible_user_id?: number;
  created_at: string;
};

/**
 * Procura todas as ordens de serviço na API de forma autenticada.
 */
export async function listOrders(
  token: string,
  statusFilter?: string,
): Promise<ServiceOrder[]> {
  let url = `${baseUrl}/service-orders/`;
  if (statusFilter) {
    url += `?status=${statusFilter}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    try {
      const errorBody = await response.json();
      throw new Error(errorBody.detail || `Erro ${response.status} na API`);
    } catch {
      throw new Error(
        `Erro ao buscar ordens de serviço (Status ${response.status})`,
      );
    }
  }

  return response.json();
}

export type CreateOrderInput = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  client_id: number;
};

/**
 * Envia os dados de uma nova ordem de serviço para o Back-end.
 */
export async function createOrder(
  token: string,
  orderData: CreateOrderInput,
): Promise<ServiceOrder | null> {
  const response = await fetch(`${baseUrl}/service-orders/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    try {
      // Tenta ler o JSON de erro detalhado enviado pelo FastAPI antes de falhar
      const errorBody = await response.json();
      throw new Error(errorBody.detail || `Erro ${response.status}`);
    } catch {
      throw new Error(
        `Erro ao criar ordem de serviço (Status ${response.status})`,
      );
    }
  }

  const responseText = await response.text();
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return null;
  }
}

/**
 * Atualiza o status de uma ordem de serviço específica no Back-end.
 */
export async function updateOrderStatus(
  token: string,
  orderId: number,
  newStatus: "open" | "done" | "in_progress" | "cancelled",
): Promise<ServiceOrder> {
  const response = await fetch(`${baseUrl}/service-orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  });

  if (!response.ok) {
    try {
      const errorBody = await response.json();
      // O FastAPI vai retornar o erro se a transição de status for proibida
      throw new Error(errorBody.detail || "Erro ao atualizar status.");
    } catch (err) {
      if (err instanceof Error) throw err;
      throw new Error(`Erro na API (Status ${response.status})`, {
        cause: err,
      });
    }
  }

  return response.json();
}
