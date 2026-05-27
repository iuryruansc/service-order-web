import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute() {
  const auth = useAuth();

  // Se NÃO houver token, redireciona o utilizador imediatamente para a página de login
  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  // Se o utilizador estiver autenticado, o <Outlet /> diz ao React Router para renderizar a página interna correspondente
  return <Outlet />;
}
