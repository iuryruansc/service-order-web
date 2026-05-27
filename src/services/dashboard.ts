const baseUrl = import.meta.env.VITE_API_URL;

export type DashboardMetrics = {
  total?: number;
  open?: number;
  in_progress?: number;
  done?: number;
  cancelled?: number;
  total_open?: number;
  total_in_progress?: number;
  total_done?: number;
  total_cancelled?: number;
  [key: string]: number | undefined;
};

export async function getDashboardMetrics(
  token: string,
): Promise<DashboardMetrics> {
  const response = await fetch(`${baseUrl}/dashboard/`, {
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
        `Erro ao buscar métricas do dashboard (Status ${response.status})`,
      );
    }
  }

  return response.json();
}
