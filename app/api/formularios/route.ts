import { NextResponse } from "next/server";
import { google } from "googleapis";

const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const ABA_LEITURA = "Registro";
const ABA_ENVIO = "Formulario";
const ABA_REFERENCIAS = "Referencias";

const COLUNAS_LEITURA = [
  "id",
  "nomeCompleto",
  "idade",
  "sexo",
  "identidadeGenero",
  "racaCor",
  "spas",
  "territorio",
  "cadUnico",
];

const COLUNAS_ENVIO: Record<string, string[]> = {
  centro: [
    "id",
    "data",
    "nomeCompleto",
    "idade",
    "sexo",
    "identidadeGenero",
    "racaCor",
    "spas",
    "intervencao",
    "territorio",
    "insumos",
    "cadUnico",
  ],

  praca: [
    "id",
    "data",
    "nomeCompleto",
    "idade",
    "sexo",
    "identidadeGenero",
    "racaCor",
    "spas",
    "intervencao",
    "territorio",
    "cadUnico",
    "insumos",
    "kitHigiene",
  ],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const spreadsheetId = searchParams.get("spreadsheetId");

    if (!spreadsheetId) {
      return NextResponse.json({ error: "spreadsheetId não informado" }, { status: 400 });
    }

    console.log(
      "SERVICE ACCOUNT:",
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    );

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${ABA_LEITURA}'!A:I`,
    });

    const rows = response.data.values || [];
    const [, ...dados] = rows;

    const data = dados.map((row) => {
      const item: Record<string, string> = {};

      COLUNAS_LEITURA.forEach((coluna, index) => {
        item[coluna] = row[index] || "";
      });

      return item;
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("ERRO GOOGLE SHEETS GET:", error);
    return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const spreadsheetId = body.spreadsheetId;
    const tipoFormulario = body.tipoFormulario;
    const formularios = body.formularios;

    if (!spreadsheetId) {
      return NextResponse.json({ error: "spreadsheetId não informado" }, { status: 400 });
    }

    if (!tipoFormulario) {
      return NextResponse.json({ error: "tipoFormulario não informado" }, { status: 400 });
    }

    if (!formularios || !Array.isArray(formularios)) {
      return NextResponse.json({ error: "Lista de formulários inválida" }, { status: 400 });
    }

    const colunasEnvio = COLUNAS_ENVIO[tipoFormulario];

    if (!colunasEnvio) {
      return NextResponse.json({ error: "Tipo de formulário inválido" }, { status: 400 });
    }

    const linhas = formularios.map((formulario: any) =>
      colunasEnvio.map((coluna) => formulario[coluna] || "")
    );

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${ABA_ENVIO}'!A:Z`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: linhas,
      },
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${ABA_REFERENCIAS}'!J2`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[formularios.length]],
      },
    });

    return NextResponse.json({
      success: true,
      total: formularios.length,
    });
  } catch (error) {
    console.error("ERRO GOOGLE SHEETS POST:", error);
    return NextResponse.json({ error: "Erro ao enviar dados" }, { status: 500 });
  }
}