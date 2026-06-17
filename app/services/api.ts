import { Formulario } from "@/app/types/formulario";

export async function buscarFormularios(spreadsheetId: string) {
  const response = await fetch(
    `/api/formularios?spreadsheetId=${spreadsheetId}`
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar formulários");
  }

  return response.json();
}

export async function enviarFormularios(
  formularios: Formulario[],
  spreadsheetId: string,
  tipoFormulario: string
) {
  const response = await fetch("/api/formularios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      spreadsheetId,
      tipoFormulario,
      formularios,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar formulários");
  }

  return response.json();
}