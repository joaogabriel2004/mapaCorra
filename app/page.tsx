"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import SuggestionList from "@/app/components/SuggestionList";
import FormulariosTable from "@/app/components/FormulariosTable";

import { buscarTecnico } from "@/app/services/tecnicos";

import { buscarFormularios, enviarFormularios, } from "@/app/services/api";

import { Formulario, initialForm, } from "@/app/types/formulario";

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

  // =========================
  // FUNÇÕES
  // =========================

  const carregarDados = async () => {
    try {
      const data =
        await buscarFormularios();

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
    });

    setSugestoes([]);
  };

  const adicionarFormulario = () => {
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
      data: dataPreenchimento,
      insumos: "2",
      intervencao: "1",

    });
  };

  const enviarTodos = async () => {
    if (formularios.length === 0) {
      alert(
        "Nenhum formulário adicionado."
      );

      return;
    }

    setLoading(true);

    try {
      await enviarFormularios(formularios);

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
    carregarDados();
  }, []);

  useEffect(() => {
    async function carregarTecnico() {
      if (!user?.email) return;
      
      const tecnico =
        await buscarTecnico(
          user.email!
        );

      if (!tecnico?.ativo) {

        alert(
          "Usuário sem permissão."
        );

        await logout();

        return;
      }

      setTecnicoLogado(
        tecnico.nome
      );
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
            Formulário de Atendimento
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
              Técnico logado
            </p>

            <p className="font-bold text-gray-800">
              {tecnicoLogado}
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

          <div className="relative mb-4">
            <Input
              label="Nome Completo"
              name="nomeCompleto"
              value={
                formData.nomeCompleto
              }
              onChange={
                handleChange
              }
            />

            <SuggestionList
              sugestoes={sugestoes}
              selecionarPessoa={
                selecionarPessoa
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <Input
              label="Idade"
              name="idade"
              value={formData.idade}
              onChange={handleChange}
            />

            <Select
              label="Sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              options={[
                "M",
                "F",
                "NR",                
              ]}
            />

            <Input
              label="Id. Gênero"
              name="identidadeGenero"
              value={
                formData.identidadeGenero
              }
              onChange={handleChange}
            />

            <Input
              label="Raça/Cor"
              name="racaCor"
              value={formData.racaCor}
              onChange={handleChange}
            />

            <Input
              label="SPAs"
              name="spas"
              value={formData.spas}
              onChange={handleChange}
            />

            <Input
              label="Território"
              name="territorio"
              value={
                formData.territorio
              }
              onChange={handleChange}
            />

            <Input
              label="Intervenção"
              name="intervencao"
              value={
                formData.intervencao
              }
              onChange={handleChange}
            />

            <Input
              label="Insumos"
              name="insumos"
              value={formData.insumos}
              onChange={handleChange}
            />

            <Select
              label="Cad. Único"
              name="cadUnico"
              value={formData.cadUnico}
              onChange={handleChange}
              options={[
                "Sim",
                "Não",
                "NR",
                "NSA",
              ]}
            />
          </div>

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
          />

          {/* ENVIAR */}
          {formularios.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 mt-8">

              <button
                type="button"
                onClick={enviarTodos}
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