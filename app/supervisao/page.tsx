"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Formulario } from "@/app/types/formulario";
import { buscarFormularios, enviarFormularios } from "@/app/services/supervisaoService";
import { useAuth } from "@/app/context/AuthContext";
import { buscarTecnico } from "@/app/services/tecnicos";
import { buscarEquipe } from "@/app/services/equipes";

import { TabelaAssistidos } from "./components/TabelaAssistidos";
import { ModalMesclagem } from "./components/ModalMesclagem";

const formatarNomeTerritorio = (nomeAba: string) => {
  return nomeAba.replace(/^Lista de Presença\s*-\s*/i, "");
};

const gerarRegistroMescladoSugestao = (
  registros: Formulario[],
  territorioAtual: string
): Formulario => {
  if (registros.length === 0) {
    return {
      id: "",
      nomeCompleto: "",
      idade: "",
      sexo: "",
      identidadeGenero: "",
      racaCor: "",
      spas: "",
      cadUnico: "",
      territorio: territorioAtual,
      data: "",
      intervencao: "",
      insumos: "",
    };
  }

  const idsUnicos = Array.from(
    new Set(
      registros
        .map((r) => String(r.id || "").trim())
        .filter((id) => id !== "" && id.toUpperCase() !== "NR")
    )
  );
  const idConcatenado = idsUnicos.join(";");

  const contarCamposValidos = (item: Formulario) => {
    let count = 0;
    const chaves: (keyof Formulario)[] = [
      "nomeCompleto",
      "idade",
      "sexo",
      "identidadeGenero",
      "racaCor",
      "spas",
      "cadUnico",
    ];

    chaves.forEach((key) => {
      const val = item[key];
      if (val && String(val).trim() !== "" && String(val).toUpperCase() !== "NR") {
        count++;
      }
    });
    return count;
  };

  let linhaMaisCompleta = registros[0];
  let maxCampos = contarCamposValidos(registros[0]);

  registros.forEach((r) => {
    const qtd = contarCamposValidos(r);
    if (qtd > maxCampos) {
      maxCampos = qtd;
      linhaMaisCompleta = r;
    }
  });

  const pegarMelhorValor = (campo: keyof Formulario) => {
    const valMaisCompleta = linhaMaisCompleta[campo];
    if (
      valMaisCompleta &&
      String(valMaisCompleta).trim() !== "" &&
      String(valMaisCompleta).toUpperCase() !== "NR"
    ) {
      return String(valMaisCompleta);
    }

    for (const r of registros) {
      const val = r[campo];
      if (
        val &&
        String(val).trim() !== "" &&
        String(val).toUpperCase() !== "NR"
      ) {
        return String(val);
      }
    }

    return String(linhaMaisCompleta[campo] || "");
  };

  return {
    id: idConcatenado,
    nomeCompleto: pegarMelhorValor("nomeCompleto"),
    idade: pegarMelhorValor("idade"),
    sexo: pegarMelhorValor("sexo"),
    identidadeGenero: pegarMelhorValor("identidadeGenero"),
    racaCor: pegarMelhorValor("racaCor"),
    spas: pegarMelhorValor("spas"),
    cadUnico: pegarMelhorValor("cadUnico"),
    territorio: formatarNomeTerritorio(territorioAtual),
    data: pegarMelhorValor("data"),
    intervencao: pegarMelhorValor("intervencao"),
    insumos: pegarMelhorValor("insumos"),
  };
};

export default function Supervisao() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState<"lancar" | "mesclar">("mesclar");

  const [tecnicoLogado, setTecnicoLogado] = useState("");
  const [equipe, setEquipe] = useState<any>(null);
  const [dadosLoading, setDadosLoading] = useState(true);

  const [abaSelecionada, setAbaSelecionada] = useState<string>("");

  const [assistidos, setAssistidos] = useState<Formulario[]>([]);
  const [selecionados, setSelecionados] = useState<Formulario[]>([]);
  const [busca, setBusca] = useState("");
  const [loadingDados, setLoadingDados] = useState(false);
  const [enviando, setEnviando] = useState(false);

  // ESTADOS DE MESCLAGEM
  const [modalAberto, setModalAberto] = useState(false);
  const [registroFinal, setRegistroFinal] = useState<Formulario>({
    id: "",
    nomeCompleto: "",
    idade: "",
    sexo: "",
    identidadeGenero: "",
    racaCor: "",
    spas: "",
    cadUnico: "",
    territorio: "",
    data: "",
    intervencao: "",
    insumos: "",
  });

  // ESTADOS DE EDIÇÃO INDIVIDUAL
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [registroEmEdicao, setRegistroEmEdicao] = useState<Formulario | null>(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    async function carregarDadosSupervisor() {
      if (!user?.email) return;

      try {
        setDadosLoading(true);

        const tecnico = await buscarTecnico(user.email);

        if (!tecnico?.ativo) {
          toast.error("Usuário sem permissão.");
          await logout();
          return;
        }

        if (tecnico.funcao !== "admin") {
          toast.error("Acesso restrito à supervisão.");
          router.push("/");
          return;
        }

        setTecnicoLogado(tecnico.nome);

        const equipeEncontrada = await buscarEquipe(tecnico.equipeId);

        if (!equipeEncontrada) {
          toast.error("Equipe não encontrada.");
          await logout();
          return;
        }

        if (!equipeEncontrada.ativo) {
          toast.error("Equipe inativa.");
          await logout();
          return;
        }

        setEquipe(equipeEncontrada);

        const abasEquipe = (equipeEncontrada as any)?.abas as string[] | undefined;
        if (abasEquipe && abasEquipe.length > 0) {
          setAbaSelecionada(abasEquipe[0]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do supervisor:", error);
        toast.error("Erro ao carregar informações da equipe.");
      } finally {
        setDadosLoading(false);
      }
    }

    carregarDadosSupervisor();
  }, [user]);

  const carregarDadosDoTerritorio = async () => {
    if (!equipe || !equipe.spreadsheetId || !abaSelecionada) {
      setAssistidos([]);
      return;
    }

    try {
      setLoadingDados(true);
      setSelecionados([]);

      const range = `${abaSelecionada}!A5:H`;
      const res = await buscarFormularios(equipe.spreadsheetId, range);

      const respostaQualquer = res as any;
      const lista: Formulario[] = Array.isArray(respostaQualquer)
        ? respostaQualquer
        : respostaQualquer?.data || [];

      const dadosValidos = lista.filter(
        (p: Formulario) => p && p.nomeCompleto && p.nomeCompleto.trim() !== ""
      );

      setAssistidos(dadosValidos);
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao carregar dados do território "${abaSelecionada}".`);
      setAssistidos([]);
    } finally {
      setLoadingDados(false);
    }
  };

  useEffect(() => {
    if (equipe && abaSelecionada) {
      carregarDadosDoTerritorio();
    }
  }, [equipe, abaSelecionada]);

  const toggleSelecao = (pessoa: Formulario) => {
    setSelecionados((prev) => {
      const existe = prev.some((item) => String(item.id) === String(pessoa.id));
      if (existe) {
        return prev.filter((item) => String(item.id) !== String(pessoa.id));
      } else {
        return [...prev, pessoa];
      }
    });
  };

  // MESCLAGEM
  const handleAbrirModalMesclagem = () => {
    if (!equipe?.spreadsheetId) {
      toast.error("Configure o ID real da planilha de mesclagem no código.");
      return;
    }

    if (selecionados.length < 2) {
      toast.error("Selecione pelo menos 2 registros para mesclar.");
      return;
    }

    const sugestao = gerarRegistroMescladoSugestao(selecionados, abaSelecionada);
    setRegistroFinal(sugestao);
    setModalAberto(true);
  };

  const handleConfirmarEEnviarMesclagem = async () => {
    if (!registroFinal.nomeCompleto || registroFinal.nomeCompleto.trim() === "") {
      toast.error("O campo Nome Completo não pode estar vazio.");
      return;
    }

    setEnviando(true);

    try {
      await enviarFormularios(
        [registroFinal],
        equipe.spreadsheetId,
        "Mesclagem"
      );

      toast.success("Registro mesclado enviado com sucesso!");
      setSelecionados([]);
      setModalAberto(false);
      carregarDadosDoTerritorio();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar registro mesclado.");
    } finally {
      setEnviando(false);
    }
  };

  // EDIÇÃO INDIVIDUAL
  const handleAbrirModalEdicao = (pessoa: Formulario) => {
    setRegistroEmEdicao({ ...pessoa, territorio: formatarNomeTerritorio(abaSelecionada) });
    setModalEdicaoAberto(true);
  };

  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registroEmEdicao) return;

    if (!registroEmEdicao.nomeCompleto || registroEmEdicao.nomeCompleto.trim() === "") {
      toast.error("O campo Nome Completo não pode estar vazio.");
      return;
    }

    setSalvandoEdicao(true);

    try {
      await enviarFormularios(
        [registroEmEdicao],
        equipe.spreadsheetId,
        "Edicao"
      );

      toast.success("Informações atualizadas com sucesso!");
      setModalEdicaoAberto(false);
      setRegistroEmEdicao(null);
      carregarDadosDoTerritorio();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar edição do assistido.");
    } finally {
      setSalvandoEdicao(false);
    }
  };

  const assistidosFiltrados = assistidos.filter((p) =>
    p.nomeCompleto?.toLowerCase().includes(busca.toLowerCase())
  );

  const listaDeAbas: string[] = (equipe as any)?.abas || [];

  if (authLoading || dadosLoading) {
    return (
      <div className="min-h-screen bg-[#f4f0e8] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full text-center">
          <div className="w-16 h-16 mb-4">
            <div
              className="w-16 h-16 rounded-full border-4 border-gray-200 animate-spin"
              style={{
                borderTopColor: "#F09A06",
                borderRightColor: "#1FAEE3",
              }}
            />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Corra Pro Abraço
          </h2>
          <p className="text-sm font-medium text-gray-500 animate-pulse">
            Carregando supervisão...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f4f0e8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-[#ef7d00] rounded-3xl p-6 shadow-xl mb-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">Painel de Supervisão</h1>
            <p className="opacity-90 text-sm mt-1">
              Supervisão da equipe: <strong>{equipe?.nome}</strong> ({tecnicoLogado})
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-2xl font-bold transition text-sm cursor-pointer"
          >
            Sair
          </button>
        </div>

        {/* OPÇÕES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="bg-white p-6 rounded-3xl shadow-md border-2 border-transparent hover:border-[#1FAEE3] transition text-left flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="text-xs font-bold text-[#1FAEE3] uppercase tracking-wider">
                Opção 1
              </span>
              <h2 className="text-xl font-bold text-gray-800 mt-1">
                Lançar Mapas / Formulários
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Acessar a tela de preenchimento dos mapas de campo.
              </p>
            </div>
            <span className="text-2xl group-hover:translate-x-2 transition-transform">
              ➡️
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva("mesclar")}
            className={`p-6 rounded-3xl shadow-md text-left flex items-center justify-between border-2 transition cursor-pointer ${
              abaAtiva === "mesclar"
                ? "bg-white border-[#009640]"
                : "bg-white border-transparent hover:border-[#009640]"
            }`}
          >
            <div>
              <span className="text-xs font-bold text-[#009640] uppercase tracking-wider">
                Opção 2
              </span>
              <h2 className="text-xl font-bold text-gray-800 mt-1">
                Conferência & Mesclagem
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Visualizar registros consolidados e mesclar duplicados.
              </p>
            </div>
            <span className="text-2xl">📋</span>
          </button>
        </div>

        {/* CONTEÚDO */}
        {abaAtiva === "mesclar" && (
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            {/* INFORMAÇÃO DA EQUIPE E SELEÇÃO DE TERRITÓRIO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Equipe:
                </label>
                <input
                  type="text"
                  disabled
                  value={equipe?.nome || ""}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-gray-100 text-gray-700 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Território / Aba:
                </label>
                <select
                  value={abaSelecionada}
                  onChange={(e) => setAbaSelecionada(e.target.value)}
                  disabled={listaDeAbas.length === 0}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-800 focus:outline-none focus:border-[#009640] disabled:bg-gray-100"
                >
                  {listaDeAbas.length === 0 ? (
                    <option value="">Nenhum território cadastrado</option>
                  ) : (
                    listaDeAbas.map((nomeAba) => (
                      <option key={nomeAba} value={nomeAba}>
                        {formatarNomeTerritorio(nomeAba)}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* CONTROLES DE PESQUISA E MESCLAGEM */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Pesquisar assistido por nome..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full md:w-1/3 border-2 border-gray-200 rounded-2xl px-4 py-3 text-black focus:outline-none focus:border-[#009640]"
              />

              <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                <span className="text-sm font-semibold text-gray-600">
                  Selecionados:{" "}
                  <strong className="text-[#ef7d00]">
                    {selecionados.length}
                  </strong>
                </span>

                <button
                  type="button"
                  onClick={handleAbrirModalMesclagem}
                  disabled={selecionados.length < 2}
                  className="bg-[#009640] hover:opacity-90 text-white font-bold px-6 py-3 rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer shadow-md"
                >
                  Mesclar Registros
                </button>
              </div>
            </div>

            {/* TABELA DE DADOS */}
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <TabelaAssistidos
                assistidos={assistidosFiltrados}
                selecionados={selecionados}
                onToggleSelecao={toggleSelecao}
                onEditar={handleAbrirModalEdicao}
                loading={loadingDados}
                nomeTerritorio={formatarNomeTerritorio(abaSelecionada)}
              />
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE MESCLAGEM */}
      <ModalMesclagem
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        selecionados={selecionados}
        registroFinal={registroFinal}
        setRegistroFinal={setRegistroFinal}
        onConfirmar={handleConfirmarEEnviarMesclagem}
        enviando={enviando}
      />

      {/* MODAL DE EDIÇÃO INDIVIDUAL */}
      {modalEdicaoAberto && registroEmEdicao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Editar Assistido (ID: {registroEmEdicao.id})
            </h3>

            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={registroEmEdicao.nomeCompleto || ""}
                  onChange={(e) =>
                    setRegistroEmEdicao({ ...registroEmEdicao, nomeCompleto: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#1FAEE3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Idade
                  </label>
                  <input
                    type="text"
                    value={registroEmEdicao.idade || ""}
                    onChange={(e) =>
                      setRegistroEmEdicao({ ...registroEmEdicao, idade: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#1FAEE3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Sexo
                  </label>
                  <input
                    type="text"
                    value={registroEmEdicao.sexo || ""}
                    onChange={(e) =>
                      setRegistroEmEdicao({ ...registroEmEdicao, sexo: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#1FAEE3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Identidade de Gênero
                  </label>
                  <input
                    type="text"
                    value={registroEmEdicao.identidadeGenero || ""}
                    onChange={(e) =>
                      setRegistroEmEdicao({ ...registroEmEdicao, identidadeGenero: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#1FAEE3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    Raça / Cor
                  </label>
                  <input
                    type="text"
                    value={registroEmEdicao.racaCor || ""}
                    onChange={(e) =>
                      setRegistroEmEdicao({ ...registroEmEdicao, racaCor: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#1FAEE3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    SPAs
                  </label>
                  <input
                    type="text"
                    value={registroEmEdicao.spas || ""}
                    onChange={(e) =>
                      setRegistroEmEdicao({ ...registroEmEdicao, spas: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#1FAEE3]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                    CadÚnico
                  </label>
                  <input
                    type="text"
                    value={registroEmEdicao.cadUnico || ""}
                    onChange={(e) =>
                      setRegistroEmEdicao({ ...registroEmEdicao, cadUnico: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-black focus:outline-none focus:border-[#1FAEE3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setModalEdicaoAberto(false)}
                  disabled={salvandoEdicao}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvandoEdicao}
                  className="px-5 py-2.5 rounded-xl bg-[#1FAEE3] text-white font-bold hover:opacity-90 transition disabled:opacity-50 shadow-md"
                >
                  {salvandoEdicao ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </main>
  );
}