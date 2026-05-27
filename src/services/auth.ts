// Importa a URL base da API do arquivo .env
const baseRule = import.meta.env.VITE_API_URL;

export async function login(email: string, password: string) {
  const bodyData = new URLSearchParams();
  bodyData.append("username", email);
  bodyData.append("password", password);

  const response = await fetch(`${baseRule}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyData,
  });

  // Se a API retornar qualquer status de erro (400, 401, 422, etc.)
  if (!response.ok) {
    try {
      const errorBody = await response.json();

      // Se 'detail' for um Array (lista de erros), pegamos a mensagem do primeiro erro da lista
      if (Array.isArray(errorBody.detail)) {
        const firstError = errorBody.detail[0];
        throw new Error(`${firstError.loc.join(".")} : ${firstError.msg}`);
      }

      // Se 'detail' for uma string simples (como no erro 401)
      throw new Error(
        errorBody.detail || "Credenciais inválidas ou erro na API.",
      );
    } catch (e: unknown) {
      if (e instanceof Error) {
        throw e; // Repassa o erro com o texto formatado acima
      }
      throw new Error(`Erro do servidor (Status ${response.status})`, {
        cause: e,
      });
    }
  }

  // Se deu tudo certo a API devolve um JSON contendo o token de acesso
  return response.json() as Promise<{
    access_token: string;
    token_type: string;
  }>;
}
