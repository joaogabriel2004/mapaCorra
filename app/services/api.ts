import { Formulario } from "@/app/types/formulario";

export async function buscarFormularios() {
  const response = await fetch(
    "/api/formularios"
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao buscar formulários"
    );
  }

  return response.json();
}

export async function enviarFormulario(
  formulario: Formulario
) {
  const response = await fetch(
    "/api/formularios",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(formulario),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Erro ao enviar formulário"
    );
  }

  return response.json();
}

export async function enviarFormularios(
  formularios: Formulario[]
) {
  const response = await fetch("/api/formularios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formularios),
  });

  if (!response.ok) {
    throw new Error("Erro ao enviar formulários");
  }

  return response.json();
}