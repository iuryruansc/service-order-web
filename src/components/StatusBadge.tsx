// Tipo da propriedade
type StatusBadgeProps = {
  status: "open" | "done" | "in_progress" | "cancelled";
};

// Função para exibir o badge de status
export function StatusBadge({ status }: StatusBadgeProps) {
  let backgroundColor = "";
  let text = status;

  // Verifica o status e define o background color e o texto
  if (status === "open") {
    backgroundColor = "#fef08a";
    text = "open";
  } else if (status === "done") {
    backgroundColor = " #86efac";
    text = "done";
  } else if (status === "in_progress") {
    backgroundColor = "#93c5fd";
    text = "in_progress";
  } else if (status === "cancelled") {
    backgroundColor = "#e2e8f0";
    text = "cancelled";
  }

  // Retorna o JXS estilizado
  return (
    <span
      style={{
        backgroundColor,
        color: "#1e293b",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
        marginRight: "8px",
      }}
    >
      {text}
    </span>
  );
}
