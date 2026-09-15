import { NextResponse } from "next/server";
import { google } from "googleapis";

// Configuração de autenticação com a conta de serviço do Google
function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// GET: Lê dados da aba/território
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spreadsheetId = searchParams.get("spreadsheetId");
  const range = searchParams.get("range");

  if (!spreadsheetId || !range) {
    return NextResponse.json(
      { error: "spreadsheetId e range são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const sheets = getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];

    // Mapeia as colunas recebidas (A5:I) para a interface Formulario
    const formularios = rows.map((row) => ({
      id: row[0] || "",
      nomeCompleto: row[1] || "",
      idade: row[2] || "",
      sexo: row[3] || "",
      identidadeGenero: row[4] || "",
      racaCor: row[5] || "",
      spas: row[6] || "",
      territorio: row[7] || "",
      cadUnico: row[8] || "",
    }));

    return NextResponse.json(formularios);
  } catch (error: any) {
    console.error("Erro no Google Sheets GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Escreve a linha mesclada na aba "Mesclagem"
export async function POST(request: Request) {
  try {
    const { spreadsheetId, aba, dados } = await request.json();

    if (!spreadsheetId || !aba || !dados) {
      return NextResponse.json(
        { error: "Parâmetros incompletos para envio." },
        { status: 400 }
      );
    }

    const sheets = getGoogleSheetsClient();

    // Converte os objetos de volta para matriz de valores (linhas x colunas)
    const values = dados.map((item: any) => [
      item.id,
      item.nomeCompleto,
      item.idade,
      item.sexo,
      item.identidadeGenero,
      item.racaCor,
      item.spas,
      item.territorio,
      item.cadUnico,
      item.data || new Date().toLocaleDateString("pt-BR"),
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${aba}!A:J`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro no Google Sheets POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}