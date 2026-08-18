import { Formulario } from "@/app/types/formulario";

// Busca os dados da aba/território especificado da planilha
export async function buscarFormularios(
  spreadsheetId: string,
  range: string
): Promise<Formulario[]> {
  const res = await fetch(
    `/api/supervisao?spreadsheetId=${spreadsheetId}&range=${encodeURIComponent(range)}`
  );

  if (!res.ok) {
    throw new Error("Falha ao carregar formulários da planilha.");
  }

  return res.json();
}

// Envia a linha mesclada para a aba especificada (ex: "Mesclagem")
export async function enviarFormularios(
  dados: Formulario[],
  spreadsheetId: string,
  aba: string
): Promise<void> {
  const res = await fetch("/api/supervisao", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      spreadsheetId,
      aba,
      dados,
    }),
  });

  if (!res.ok) {
    throw new Error("Erro ao salvar os dados mesclados na planilha.");
  }
}