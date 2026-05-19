"use client";

import { useEffect, useState } from "react";

import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import SuggestionList from "@/app/components/SuggestionList";
import FormulariosTable from "@/app/components/FormulariosTable";

import {
  buscarFormularios,
  enviarFormulario,
} from "@/app/services/api";

import {
  Formulario,
  initialForm,
} from "@/app/types/formulario";

export default function Home() {
  const [formData, setFormData] =
    useState<Formulario>(initialForm);

  const [formularios, setFormularios] =
    useState<Formulario[]>([]);

  const [dadosApi, setDadosApi] =
    useState<Formulario[]>([]);

  const [sugestoes, setSugestoes] =
    useState<Formulario[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

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
      data: new Date().toISOString(),
      nomeCompleto: pessoa.nomeCompleto || "",
      idade: String(pessoa.idade) || "",
      sexo: pessoa.sexo || "",
      identidadeGenero: pessoa.identidadeGenero || "",
      racaCor: pessoa.racaCor || "",
      spas: pessoa.spas || "",
      tecnico: pessoa.tecnico || "",
      intervencao: pessoa.intervencao || "",
      territorio: pessoa.territorio || "",
      insumos: pessoa.insumos || "",
      cadUnico: pessoa.cadUnico || "",
    });

    setSugestoes([]);
  };

  const adicionarFormulario = () => {
    const idGerado = (
      Date.now()
        .toString()
        .slice(-4) +
      Math.floor(
        Math.random() * 10
      )
    ).toString();

    const formularioComId = {
      ...formData,

      id:
        formData.id || idGerado,

      data:
        formData.data ||
        new Date().toLocaleDateString(
          "pt-BR"
        ),
    };

    setFormularios((prev) => [
      ...prev,
      formularioComId,
    ]);

    setFormData(initialForm);
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
      for (const formulario of formularios) {
        await enviarFormulario(
          formulario
        );
      }

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

  return (
    <main className="min-h-screen bg-[#f4f0e8] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#ef7d00] rounded-3xl p-8 shadow-xl mb-6">
          <h1 className="text-4xl font-black text-white">
            Corra Pro Abraço
          </h1>

          <p className="text-white mt-2 text-lg">
            Formulário de Atendimento
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow mb-6 border-l-8 border-[#009640]">
          <p className="text-lg font-semibold text-gray-800">
            Formulários adicionados:
            <span className="text-[#ef7d00] ml-2">
              {formularios.length}
            </span>
          </p>
        </div>

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
              type="number"
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
              label="Técnico"
              name="tecnico"
              value={formData.tecnico}
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
                "NR"
              ]}
            />
          </div>          

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

          <FormulariosTable formularios={formularios} />

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
          )};
        </div>
      </div>
    </main>
  );
}