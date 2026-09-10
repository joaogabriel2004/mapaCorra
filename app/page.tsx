"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { toast, Toaster } from "react-hot-toast";

import FormulariosTable from "@/app/components/FormulariosTable";
import FormularioCentro from "@/app/components/formularios/FormularioCentro";
import FormularioPraca from "@/app/components/formularios/FormularioPraca";
import FormularioMares from "@/app/components/formularios/FormularioMares";
import FormularioExtensao from "@/app/components/formularios/FormularioExtensao";
import FormularioVac from "@/app/components/formularios/FormularioVac";
import FormularioArteEducacao from "@/app/components/formularios/FormularioArteEducadao";
import ModalConfirmacao from "@/app/components/ModalConfirmacao";

import { buscarTecnico } from "@/app/services/tecnicos";
import { buscarFormularios, enviarFormularios } from "@/app/services/api";
import { buscarEquipe } from "@/app/services/equipes";
import { Formulario, initialForm } from "@/app/types/formulario";
import { CONFIG_FORMULARIOS, TipoFormulario } from "@/app/config/formularios";

export default function Home() {
  const router = useRouter();

  const { user, loading: authLoading, logout } = useAuth();

  const [formData, setFormData] = useState<Formulario>(initialForm);
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [dadosApi, setDadosApi] = useState<Formulario[]>([]);
  const [sugestoes, setSugestoes] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(false);
  const [dadosLoading, setDadosLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [dataPreenchimento, setDataPreenchimento] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [tecnicoLogado, setTecnicoLogado] = useState("");
  const [tecnicoLogadoFuncao, setTecnicoLogadoFuncao] = useState("");
  const [equipe, setEquipe] = useState<any>(null);

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [indexEditando, setIndexEditando] = useState<number | null>(null);
  const [nomeOrigem, setNomeOrigem] = useState<string>("");

  // =========================
  // FUNÇÕES
  // =========================

  const carregarDados = async (spreadsheetId: string) => {
    try {
      const data = await buscarFormularios(spreadsheetId);

      if (data?.data) {
        setDadosApi(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // autocomplete nome
    if (name === "nomeCompleto") {
      if (value.length > 1) {
        const filtrados = dadosApi.filter((pessoa) =>
          pessoa.nomeCompleto.toLowerCase().includes(value.toLowerCase())
        );

        setSugestoes(filtrados);
      } else {
        setSugestoes([]);
      }
    }
  };

  const selecionarPessoa = (pessoa: Formulario) => {
    const jaAdicionado = formularios.some(
      (item) => String(item.id) === String(pessoa.id)
    );

    if (jaAdicionado) {
      toast(`A pessoa "${pessoa.nomeCompleto}" já está na lista!`, {
        icon: '⚠️',
        style: {
          border: '2 border #F09A06',
          background: '#FFFBEB',
          color: '#B45309',
        },
      });
      setSugestoes([]);
      return;
    }

    const tiposQueUsamTerritorioDoAssistido = ["centro", "vac"];
    const tipoFormulario = equipe?.tipoFormulario || "";
    setNomeOrigem(pessoa.nomeCompleto);

    let territorio = formData.territorio;

    if (tipoFormulario === "mares") {
      territorio = "Mares";
    } else if (tiposQueUsamTerritorioDoAssistido.includes(tipoFormulario)) {
      territorio = pessoa.territorio || "";
    }

    setFormData({
      id: String(pessoa.id),
      data: dataPreenchimento,
      nomeCompleto: pessoa.nomeCompleto || "",
      idade: String(pessoa.idade) || "",
      sexo: pessoa.sexo || "",
      identidadeGenero: pessoa.identidadeGenero || "",
      racaCor: pessoa.racaCor || "",
      spas: pessoa.spas || "",
      intervencao: "1",
      territorio,
      insumos: "2",
      cadUnico: pessoa.cadUnico || "",
      kitHigiene: "",
      territorioEspecifico: "",
      atividadeExterna: "NSA",
      sanitario: "",
      banho: "",
      tipoAssistido: pessoa.tipoAssistido || "",
      resultadoAudiencia: pessoa.resultadoAudiencia || "",
      contato: pessoa.contato || "",
    });

    setSugestoes([]);
  };

  const validarFormulario = () => {
    if (!equipe) return false;

    const tipoFormulario = equipe.tipoFormulario as TipoFormulario;

    const campos = CONFIG_FORMULARIOS[tipoFormulario].colunasTabela;

    const campoVazio = campos.find(({ campo }) => {
      if (campo === "id") return false;
      const valor = (formData as Record<string, unknown>)[campo];

      return (
        valor === undefined ||
        valor === null ||
        String(valor).trim() === ""
      );
    });

    if (campoVazio) {
      toast(`Preencha o campo "${campoVazio.label}"`, {
        icon: '⚠️',
        style: {
          border: '2 border #F09A06',
          background: '#FFFBEB',
          color: '#B45309',
        },
      });
      return false;
    }

    return true;
  };

  const limparFormulario = () => {
    const territorio = equipe?.tipoFormulario === "mares" ? "Mares" : equipe?.tipoFormulario === "praca" ? formData.territorio : equipe?.tipoFormulario === "extensao" ? formData.territorio : equipe?.tipoFormulario === "arteEducacao" ? formData.territorio : initialForm.territorio;

    setFormData({
      ...initialForm,
      territorio,
      data: dataPreenchimento,
      insumos: "2",
      intervencao: "1",
      atividadeExterna: "NSA",
    });

    setIndexEditando(null);
    setNomeOrigem("");
    setSugestoes([]);
  };

  const adicionarFormulario = () => {
    if (!validarFormulario()) return;

    if (indexEditando !== null) {
      setFormularios((prev) => {
        const listaAtualizada = [...prev];
        listaAtualizada[indexEditando] = formData;
        return listaAtualizada;
      });

      limparFormulario();
      return;
    }

    const jaExiste = formularios.some(
      (f) =>
        f.nomeCompleto.toLowerCase().trim() ===
        formData.nomeCompleto.toLowerCase().trim()
    );

    if (jaExiste) {
      toast(`A pessoa "${formData.nomeCompleto}" já está na lista atual.`, {
        icon: '⚠️',
        style: {
          border: '2 border #F09A06',
          background: '#FFFBEB',
          color: '#B45309',
        },
      });
      return;
    }

    const idGerado =
      Date.now().toString().slice(-4) +
      Math.floor(Math.random() * 10).toString();

    const formularioComId = {
      ...formData,
      id: formData.id || idGerado,
      data: formData.data || dataPreenchimento,
    };

    setFormularios((prev) => [...prev, formularioComId]);
    limparFormulario();
  };

  const editarFormulario = (index: number) => {
    setNomeOrigem(formularios[index].nomeCompleto);
    setFormData(formularios[index]);
    setIndexEditando(index);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const enviarTodos = async (dataFinal: string) => {
    if (formularios.length === 0) {
      toast.error("Nenhum formulário adicionado.");
      return;
    }

    setLoading(true);

    try {
      if (!equipe?.spreadsheetId) {
        toast.error("Planilha da equipe não encontrada.");
        return;
      }

      const formulariosComDataAtualizada = formularios.map((form) => ({
        ...form,
        data: dataFinal,
        spas: form.spas ? form.spas.replace(/,/g, ";") : form.spas,
      }));

      await enviarFormularios(
        formulariosComDataAtualizada,
        equipe.spreadsheetId,
        equipe.tipoFormulario
      );

      toast.success("Todos enviados com sucesso!");

      setFormularios([]);
      
      // LIMPA OS RASCUNHOS APÓS O ENVIO
      localStorage.removeItem("rascunho_formularios");
      localStorage.removeItem("rascunho_formData");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar");
    } finally {
      setLoading(false);
    }
  };

  const removerFormulario = (indexParaRemover: number) => {
    setFormularios((prev) =>
      prev.filter((_, index) => index !== indexParaRemover)
    );

    // Se estiver editando o mesmo item que foi removido, limpa a edição
    if (indexEditando === indexParaRemover) {
      limparFormulario();
    }
  };

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      data: dataPreenchimento,
      insumos: "2",
      intervencao: "1",
      atividadeExterna: "NSA",
    }));
  }, [dataPreenchimento]);

  useEffect(() => {
    async function carregarTecnico() {
      if (!user?.email) return;

      try {
        setDadosLoading(true); // Inicia o carregamento dos dados

        const tecnico = await buscarTecnico(user.email);

        if (!tecnico?.ativo) {
          toast.error("Usuário sem permissão.");
          await logout();
          return;
        }

        setTecnicoLogado(tecnico.nome);
        setTecnicoLogadoFuncao(tecnico.funcao);


        const equipeEncontrada = await buscarEquipe(tecnico.equipeId);
        setEquipe(equipeEncontrada);

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

        // Aguarda o carregamento dos dados da planilha/formulários
        await carregarDados(equipeEncontrada.spreadsheetId);        
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      } finally { 
        setDadosLoading(false); // Libera a tela apenas quando TUDO terminar
      }
    }

    carregarTecnico();
  }, [user]);

  // Define automaticamente o território "Mares" quando a equipe for carregada
  useEffect(() => {
    if (equipe?.tipoFormulario === "mares") {
      setFormData((prev) => ({
        ...prev,
        territorio: "Mares",
      }));
    }
  }, [equipe]);

  // =========================
  // RETURNS CONDICIONAIS
  // =========================

  if (authLoading || dadosLoading || isRedirecting) {
    return (
      <div className="min-h-screen bg-[#f4f0e8] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full text-center">
          {/* Spinner animado */}
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
            Carregando informações...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f4f0e8] p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-[#ef7d00] rounded-3xl p-8 shadow-xl mb-6">
          <h1 className="text-4xl font-black text-white">Corra Pro Abraço</h1>
          <p className="text-white mt-2 text-lg">
            Mapa de Campo da equipe {equipe?.nome}
          </p>
        </div>

        {/* DATA + LOGIN */}
        <div className="bg-white rounded-2xl p-4 shadow mb-6 flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
          <div>
            <label className="block mb-2 font-semibold text-gray-800">
              Data de preenchimento
            </label>
            <input
              type="date"
              value={dataPreenchimento}
              onChange={(e) => setDataPreenchimento(e.target.value)}
              className="border-2 border-gray-200 rounded-2xl px-4 py-3 text-black"
            />
          </div>

          <div>
            <p className="text-sm text-gray-500">Olá,</p>
            <p className="font-bold text-gray-800">
              {tecnicoLogado} - {equipe?.nome}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {tecnicoLogadoFuncao === "inativado, botar admin dps" && (
              <button
                type="button"
                onClick={() => router.push("/supervisao")}
                className="bg-[#009640] text-white px-5 py-3 rounded-2xl font-bold hover:opacity-90 transition cursor-pointer"
              >
              Supervisão
            </button>
            )}
            <button
              type="button"
              onClick={logout}
              className="bg-red-600 text-white px-5 py-3 rounded-2xl font-bold hover:opacity-90 transition cursor-pointer"
            >
              Sair
            </button>
          </div>
        </div>

        {/* CONTADOR */}
        <div className="bg-white rounded-2xl p-4 shadow mb-6 border-l-8 border-[#009640]">
          <p className="text-lg font-semibold text-gray-800">
            Formulários adicionados:
            <span className="text-[#ef7d00] ml-2">{formularios.length}</span>
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* BARRA DE AVISO: EDIÇÃO OU SELEÇÃO DE ID */}
          {(formData.id || indexEditando !== null) && (
            <div className="mb-6 flex items-center justify-between bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-amber-900">
              <span className="font-semibold text-sm">
                {indexEditando !== null
                  ? `✏️ Editando ${nomeOrigem} da lista`
                  : `👤 Pessoa selecionada: ${nomeOrigem}`}
              </span>

              <button
                type="button"
                onClick={limparFormulario}
                className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-1.5 rounded-xl text-xs transition"
              >
                Cancelar {indexEditando !== null ? "Edição" : "Seleção"}
              </button>
            </div>
          )}

          {equipe?.nome === "Centro de Referência" && (
            <FormularioCentro
              formData={formData}
              handleChange={handleChange}
              sugestoes={sugestoes}
              selecionarPessoa={selecionarPessoa}
            />
          )}

          {equipe?.nome === "Praça" && (
            <FormularioPraca
              formData={formData}
              handleChange={handleChange}
              sugestoes={sugestoes}
              selecionarPessoa={selecionarPessoa}
            />
          )}

          {equipe?.nome === "Extensão" && (
            <FormularioExtensao
              formData={formData}
              handleChange={handleChange}
              sugestoes={sugestoes}
              selecionarPessoa={selecionarPessoa}
            />
          )}

          {equipe?.nome === "Mares" && (
            <FormularioMares
              formData={formData}
              handleChange={handleChange}
              sugestoes={sugestoes}
              selecionarPessoa={selecionarPessoa}
            />
          )}

          {equipe?.nome === "VAC" && (
            <FormularioVac
              formData={formData}
              handleChange={handleChange}
              sugestoes={sugestoes}
              selecionarPessoa={selecionarPessoa}
            />
          )}

          {equipe?.nome === "Arte-Educação" && (
            <FormularioArteEducacao
              formData={formData}
              handleChange={handleChange}
              sugestoes={sugestoes}
              selecionarPessoa={selecionarPessoa}
              tipoFormulario={equipe?.tipoFormulario}
            />
          )}

          {/* BOTÕES DE ADICIONAR / SALVAR */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <button
              type="button"
              onClick={adicionarFormulario}
              className={`flex-1 font-bold py-4 rounded-2xl text-white transition ${
                indexEditando !== null
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-[#009640] hover:opacity-90"
              }`}
            >
              {indexEditando !== null
                ? "Salvar Alterações"
                : "Adicionar à Lista"}
            </button>
          </div>

          {/* TABELA */}
          <FormulariosTable
            formularios={formularios}
            colunas={
              equipe?.tipoFormulario
                ? CONFIG_FORMULARIOS[
                    equipe.tipoFormulario as TipoFormulario
                  ]?.colunasTabela || []
                : []
            }
            onRemove={removerFormulario}
            onEdit={editarFormulario}
          />

          {/* ENVIAR */}
          {formularios.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <button
                type="button"
                onClick={() => setMostrarConfirmacao(true)}
                disabled={loading}
                className="flex-1 bg-[#ef7d00] hover:opacity-90 text-white font-bold py-4 rounded-2xl transition disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar Todos"}
              </button>
            </div>
          )}
        </div>

        <ModalConfirmacao
          aberto={mostrarConfirmacao}
          data={dataPreenchimento}
          equipe={equipe?.nome || ""}
          planilha={equipe?.nomePlanilha || ""}
          territorio={formData.territorio}
          formularios={formularios}
          onCancelar={() => setMostrarConfirmacao(false)}
          onConfirmar={async (dataEditada) => {
            setMostrarConfirmacao(false);
            await enviarTodos(dataEditada);
          }}
        />
      </div>
      {/* CONTAINER DE NOTIFICAÇÕES */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "16px",
            background: "#333",
            color: "#fff",
            fontWeight: "bold",
          },
        }}
      />
    </main>
  );
}