import { NextResponse } from "next/server";
import { google } from "googleapis";

// Função para limpar o nome da aba e extrair o território (igual ao front-end)
function formatarNomeTerritorio(nomeAba: string): string {
  return nomeAba.replace(/^Lista de Presença\s*-\s*/i, "").trim();
}

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
  const equipe = searchParams.get("equipe");

  if (!spreadsheetId || !range) {
    return NextResponse.json(
      { error: "spreadsheetId e range são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const sheets = getGoogleSheetsClient();
    
    // Extrai o nome bruto da aba do range (ex: "Lista de Presença - Pituba!A5:I" -> "Lista de Presença - Pituba")
    const nomeAbaBruto = range.includes("!") 
      ? range.split("!")[0].replace(/[']/g, "").trim() 
      : "";
    
    // Aplica a mesma formatação do front-end para obter o território limpo
    const territorioFormatado = formatarNomeTerritorio(nomeAbaBruto);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values || [];

    const formularios = rows
      .filter((row) => row[1] && row[1].toString().trim() !== "") // Ignora linhas sem nome
      .map((row) => {
        if (equipe === "Extensão") {
          return {
            id: row[0] || "",
            nomeCompleto: row[1] || "",
            idade: row[2] || "",
            sexo: row[3] || "",
            identidadeGenero: row[4] || "",
            racaCor: row[5] || "",
            spas: row[6] || "",
            territorio: territorioFormatado, // <--- Aqui assume o território extraído da aba!
            cadUnico: row[7] || "",
          };
        }

        if (equipe === "Centro de Referência") {
          return {
            id: row[0] || "",
            nomeCompleto: row[1] || "",
            idade: row[2] || "",
            sexo: row[3] || "",
            identidadeGenero: row[4] || "",
            racaCor: row[5] || "",
            spas: row[6] || "",
            territorio: row[7] || "",
            cadUnico: row[8] || "", 
          };
        }

        if (equipe === "Praça") {
          return {
            id: row[0] || "",
            nomeCompleto: row[1] || "",
            idade: row[2] || "",
            sexo: row[3] || "",
            identidadeGenero: row[4] || "",
            racaCor: row[5] || "",
            spas: row[6] || "",
            cadUnico: row[7] || "",
            territorio: row[8] || "",
          };
        }

        if (equipe === "Mares") {
          return {
            id: row[0] || "",
            nomeCompleto: row[1] || "",
            idade: row[2] || "",
            sexo: row[3] || "",
            identidadeGenero: row[4] || "",
            racaCor: row[5] || "",
            spas: row[6] || "",
            cadUnico: row[7] || "",
            territorio: "",
          };
        }
      });

    return NextResponse.json(formularios);
  } catch (error: any) {
    console.error("Erro no Google Sheets GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Escreve a linha mesclada na aba "Mesclagem"
export async function POST(request: Request) {
  try {
    const { spreadsheetId, aba, dados, equipe } = await request.json();

    if (!spreadsheetId || !aba || !dados) {
      return NextResponse.json(
        { error: "Parâmetros incompletos para envio." },
        { status: 400 }
      );
    }

    const sheets = getGoogleSheetsClient();
    const equipeNome = equipe;

    // Converte os objetos de volta para matriz de valores (linhas x colunas)
    const values = dados.map((item: any) => {
      if (equipeNome === "Centro de Referência") {
        return [
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
        ];
      }

      if (equipeNome === "Extensão") {
        return [
          item.id,
          item.nomeCompleto,
          item.idade,
          item.sexo,
          item.identidadeGenero,
          item.racaCor,
          item.spas,
          item.cadUnico,
          item.territorio,
          item.data || new Date().toLocaleDateString("pt-BR"),
        ];
      }

      if (equipeNome === "Praça") {
        return [
          item.id,
          item.nomeCompleto,
          item.idade,
          item.sexo,
          item.identidadeGenero,
          item.racaCor,
          item.spas,
          item.cadUnico,
          item.territorio,
          item.data || new Date().toLocaleDateString("pt-BR"),
        ];
      }

      if (equipeNome === "Mares") {
        return [
          item.id,
          item.nomeCompleto,
          item.idade,
          item.sexo,
          item.identidadeGenero,
          item.racaCor,
          item.spas,
          item.cadUnico,
          item.data || new Date().toLocaleDateString("pt-BR"),
        ];
      }
    });

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