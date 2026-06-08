import { NextResponse } from "next/server";
import { google } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;

const privateKey = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const ABA_LEITURA = "Página5";

const ABA_ENVIO = "Formulario";

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

const COLUNAS_ENVIO = [
  "id",
  "data",
  "nomeCompleto",
  "idade",
  "sexo",
  "identidadeGenero",
  "racaCor",
  "spas",
  "tecnico",
  "intervencao",
  "territorio",
  "insumos",
  "cadUnico",
];

export async function GET() {
  try {
    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `'${ABA_LEITURA}'!A:I`,
      });

    const rows =
      response.data.values || [];

    const [, ...dados] = rows;

    const data = dados.map((row) => {
      const item: Record<
        string,
        string
      > = {};

      COLUNAS_LEITURA.forEach(
        (coluna, index) => {
          item[coluna] =
            row[index] || "";
        }
      );

      return item;
    });

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error(
      "ERRO GOOGLE SHEETS GET:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro ao buscar dados",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const formularios =
      Array.isArray(body)
        ? body
        : [body];

    const linhas =
      formularios.map(
        (formulario) =>
          COLUNAS_ENVIO.map(
            (coluna) =>
              formulario[coluna] ||
              ""
          )
      );

    // ENVIA TODAS AS LINHAS
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `'${ABA_ENVIO}'!A:M`,
      valueInputOption:
        "USER_ENTERED",
      insertDataOption:
        "INSERT_ROWS",
      requestBody: {
        values: linhas,
      },
    });

    // SALVA QUANTIDADE EM REFERENCIAS!J2
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range:
        "'Referencias'!J2",
      valueInputOption:
        "USER_ENTERED",
      requestBody: {
        values: [
          [formularios.length],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      total:
        formularios.length,
    });
  } catch (error) {
    console.error(
      "ERRO GOOGLE SHEETS POST:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro ao enviar dados",
      },
      {
        status: 500,
      }
    );
  }
}