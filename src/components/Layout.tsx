import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: "#f8fafc",
  textDecoration: "none",
  fontWeight: "500",
  opacity: isActive ? 1 : 0.82,
  borderBottom: isActive ? "2px solid #38bdf8" : "2px solid transparent",
  paddingBottom: "2px",
});

export function Layout() {
  const auth = useAuth();

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: "18px 24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "20px",
                color: "#38bdf8",
                letterSpacing: "-0.02em",
              }}
            >
              ServiceOS
            </h1>
            <p style={{ margin: 0, fontSize: "12px", color: "#cbd5e1" }}>
              Gestão de ordens mais rápida e clara
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
            <NavLink to="/dashboard" style={navLinkStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/orders" style={navLinkStyle}>
              Ordens
            </NavLink>
            <NavLink to="/clients" style={navLinkStyle}>
              Clientes
            </NavLink>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <span style={{ fontSize: "14px", color: "#cbd5e1" }}>Conectado</span>
          <button
            onClick={auth.logoutContext}
            style={{
              padding: "10px 16px",
              backgroundColor: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Sair
          </button>
        </div>
      </nav>

      <main
        style={{ flex: 1, padding: "26px 24px", backgroundColor: "#f8fafc" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
