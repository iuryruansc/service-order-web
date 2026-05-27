const baseUrl = import.meta.env.VITE_API_URL;

export async function getHealth() {
  // Faz a requisição HTTP do tipo GET para a raiz da API
  const response = await fetch(`${baseUrl}`);

  if (!response.ok) {
    throw new Error("Falha ao conectar com a API");
  }

  return response.json();
}
