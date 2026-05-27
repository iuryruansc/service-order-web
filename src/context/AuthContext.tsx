import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

// 1. Definir o contrato do Contexto
type AuthContextType = {
  token: string | null;
  loginContext: (newToken: string) => void;
  logoutContext: () => void;
};

// 2. Criar o Contexto interno
const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// 3. O Provedor do Contexto
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("service_order_token");
  });

  function loginContext(newToken: string) {
    setToken(newToken);
    localStorage.setItem("service_order_token", newToken);
  }

  function logoutContext() {
    setToken(null);
    localStorage.removeItem("service_order_token");
  }

  return (
    <AuthContext.Provider value={{ token, loginContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para exportar a autenticação.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
