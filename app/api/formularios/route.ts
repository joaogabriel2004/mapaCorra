import { NextResponse } from "next/server";

const GET_URL =
  process.env.GET_API_URL!;

const POST_URL =
  process.env.POST_API_URL!;

const GET_HEADERS = {
  accessKey:
    process.env.GET_ACCESS_KEY!,

  secretKey:
    process.env.GET_SECRET_KEY!,
};

const POST_HEADERS = {
  accessKey:
    process.env.POST_ACCESS_KEY!,

  secretKey:
    process.env.POST_SECRET_KEY!,
};

export async function GET() {
  try {
    const response = await fetch(
      GET_URL,
      {
        method: "GET",
        headers: GET_HEADERS,
      }
    );

    const data =
      await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

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

    const response = await fetch(
      POST_URL,
      {
        method: "POST",
        headers: {
          ...POST_HEADERS,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    console.log(
      "STATUS:",
      response.status
    );

    // NÃO tenta ler json da API
    // porque ela pode devolver vazio

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "ERRO:",
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