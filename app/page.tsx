  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";
  import { useAuth } from "@/app/context/AuthContext";

  import FormulariosTable from "@/app/components/FormulariosTable";
  import  FormularioCentro  from "@/app/components/formularios/FormularioCentro";
  import  FormularioPraca  from "@/app/components/formularios/FormularioPraca";

  import { buscarTecnico } from "@/app/services/tecnicos";

  import { buscarFormularios, enviarFormularios, } from "@/app/services/api";
  import { buscarEquipe } from "@/app/services/equipes";

  import { Formulario, initialForm, } from "@/app/types/formulario";

  import { CONFIG_FORMULARIOS, TipoFormulario } from "@/app/config/formularios";
import FormularioExtensao from "./components/formularios/FormularioExtensao";

  export default function Home() {
    const router = useRouter();

    const { user, loading: authLoading, logout, } = useAuth();

    const [formData, setFormData] = useState<Formulario>(initialForm);

    const [formularios, setFormularios] = useState<Formulario[]>([]);

    const [dadosApi, setDadosApi] = useState<Formulario[]>([]);

    const [sugestoes, setSugestoes] = useState<Formulario[]>([]);

    const [loading, setLoading] = useState(false);

    const [dataPreenchimento, setDataPreenchimento] = useState( new Date().toISOString().split("T")[0]);

    const [tecnicoLogado, setTecnicoLogado] = useState("");
    const [equipe, setEquipe] = useState<any>(null);

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
        HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
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
          const filtrados =
            dadosApi.filter((pessoa) =>
              pessoa.nomeCompleto
                .toLowerCase()
                .includes(
                  value.toLowerCase()
                )
            );

          setSugestoes(filtrados);
        } else {
          setSugestoes([]);
        }
      }
    };

    const selecionarPessoa = (
      pessoa: Formulario
    ) => {
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

        territorio: pessoa.territorio || "",

        insumos: "2",

        cadUnico: pessoa.cadUnico || "",

        kitHigiene: "",
      });

      setSugestoes([]);
    };

    const adicionarFormulario = () => {
      if( !formData.nomeCompleto ) {
        return;
      }

      const idGerado = (Date.now().toString().slice(-4) + Math.floor(Math.random() * 10)).toString();

      const formularioComId = {
        ...formData,

        id: formData.id || idGerado,

        data: formData.data ||dataPreenchimento,
      };

      setFormularios((prev) => [
        ...prev,
        formularioComId,
      ]);

      setFormData({
        ...initialForm,
        territorio: formData.territorio,
        data: dataPreenchimento,
        insumos: "2",
        intervencao: "1",

      });
    };

    const enviarTodos = async (spreadsheetId: string) => {
      if (formularios.length === 0) {
        alert(
          "Nenhum formulário adicionado."
        );

        return;
      }

      setLoading(true);

      try {
        if (!equipe?.spreadsheetId) {
          alert("Planilha da equipe não encontrada.");
          return;
        }

        await enviarFormularios(
          formularios,
          equipe.spreadsheetId,
          equipe.tipoFormulario
        );

        alert(
          "Todos enviados com sucesso!"
        );

        setFormularios([]);
      } catch (error) {
        console.error(error);

        alert("Erro ao enviar");
      } finally {
        setLoading(false);
      }
    };

    const removerFormulario = (indexParaRemover: number) => {
      setFormularios((prev) =>
        prev.filter((_, index) => index !== indexParaRemover)
      );
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
      }));
    }, [
      dataPreenchimento,
    ]);

    useEffect(() => {
      async function carregarTecnico() {
        if (!user?.email) return;

        const tecnico = await buscarTecnico(user.email);

        if (!tecnico?.ativo) {
          alert("Usuário sem permissão.");
          await logout();
          return;
        }

        setTecnicoLogado(tecnico.nome);

        const equipeEncontrada = await buscarEquipe(tecnico.equipeId);
        setEquipe(equipeEncontrada);

        if (!equipeEncontrada) {
          alert("Equipe não encontrada.");
          await logout();
          return;
        }

        if (!equipeEncontrada.ativo) {
          alert("Equipe inativa.");
          await logout();
          return;
        }

        await carregarDados(equipeEncontrada.spreadsheetId);
      }

      carregarTecnico();
    }, [user]);

    // =========================
    // RETURNS CONDICIONAIS
    // =========================

    if (authLoading) {
      return (
        <p className="p-6">
          Carregando...
        </p>
      );
    }

    if (!user) return null;

    return (
      <main className="min-h-screen bg-[#f4f0e8] p-6">
        <div className="max-w-4xl mx-auto">

          {/* HEADER */}
          <div className="bg-[#ef7d00] rounded-3xl p-8 shadow-xl mb-6">
            <h1 className="text-4xl font-black text-white">
              Corra Pro Abraço
            </h1>

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
                onChange={(e) =>
                  setDataPreenchimento(
                    e.target.value
                  )
                }
                className="border-2 border-gray-200 rounded-2xl px-4 py-3 text-black"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Olá,
              </p>

              <p className="font-bold text-gray-800">
                {tecnicoLogado} - {equipe?.nome}
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="bg-red-600 text-white px-5 py-3 rounded-2xl font-bold"
            >
              Sair
            </button>
          </div>

          {/* CONTADOR */}
          <div className="bg-white rounded-2xl p-4 shadow mb-6 border-l-8 border-[#009640]">
            <p className="text-lg font-semibold text-gray-800">
              Formulários adicionados:

              <span className="text-[#ef7d00] ml-2">
                {formularios.length}
              </span>
            </p>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

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
                formData={formData }
                handleChange={handleChange}
                sugestoes={sugestoes}
                selecionarPessoa={selecionarPessoa}
              />
              )}

            {/* BOTÕES */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">

              <button
                type="button"
                onClick={
                  adicionarFormulario
                }
                className="flex-1 bg-[#009640] hover:opacity-90 text-white font-bold py-4 rounded-2xl transition"
              >
                Adicionar à Lista
              </button>

            </div>

            {/* TABELA */}
            <FormulariosTable
              formularios={formularios}
              colunas={
                equipe?.tipoFormulario
                  ? CONFIG_FORMULARIOS[equipe.tipoFormulario as TipoFormulario]?.colunasTabela || []
                  : []
              }
              onRemove={removerFormulario}
            />

            {/* ENVIAR */}
            {formularios.length > 0 && (
              <div className="flex flex-col md:flex-row gap-4 mt-8">

                <button
                  type="button"
                  onClick={() => enviarTodos(equipe.spreadsheetId)}
                  disabled={loading}
                  className="flex-1 bg-[#ef7d00] hover:opacity-90 text-white font-bold py-4 rounded-2xl transition disabled:opacity-50"
                >
                  {loading
                    ? "Enviando..."
                    : "Enviar Todos"}
                </button>

              </div>
            )}

          </div>
        </div>
      </main>
    );
  }