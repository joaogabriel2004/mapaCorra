export type TipoFormulario = "centro" | "praca" | "extensao";

export type ColunaFormulario = {
  campo: string;
  label: string;
};

export const CONFIG_FORMULARIOS: Record<
  TipoFormulario,
  {
    colunasEnvio: string[];
    colunasTabela: ColunaFormulario[];
  }
> = {
  centro: {
    colunasEnvio: [
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
    colunasTabela: [
      { campo: "id", label: "ID" },
      { campo: "data", label: "Data" },
      { campo: "nomeCompleto", label: "Nome Completo" },
      { campo: "idade", label: "Idade" },
      { campo: "sexo", label: "Sexo" },
      { campo: "identidadeGenero", label: "Id. Gênero" },
      { campo: "racaCor", label: "Raça/Cor" },
      { campo: "spas", label: "SPAs" },
      { campo: "intervencao", label: "Intervenção" },
      { campo: "territorio", label: "Território" },
      { campo: "insumos", label: "Insumos" },
      { campo: "cadUnico", label: "Cad. Único" },
    ],
  },

  praca: {
    colunasEnvio: [
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
    colunasTabela: [
      { campo: "id", label: "ID" },
      { campo: "data", label: "Data" },
      { campo: "nomeCompleto", label: "Nome Completo" },
      { campo: "idade", label: "Idade" },
      { campo: "sexo", label: "Sexo" },
      { campo: "identidadeGenero", label: "Id. Gênero" },
      { campo: "racaCor", label: "Raça/Cor" },
      { campo: "spas", label: "SPAs" },
      { campo: "intervencao", label: "Intervenção" },
      { campo: "territorio", label: "Território" },
      { campo: "insumos", label: "Insumos" },
      { campo: "cadUnico", label: "Cad. Único" },
      { campo: "kitHigiene", label: "Kit Higiene" },
    ],
  },

  extensao: {
    colunasEnvio: [
      "id",
      "data",
      "nomeCompleto",
      "idade",
      "sexo",
      "identidadeGenero",
      "racaCor",
      "spas",
      "intervencao",
      "insumos",
      "cadUnico",
      "territorioEspecifico",
      "territorio",
    ],
    colunasTabela: [
      { campo: "id", label: "ID" },
      { campo: "data", label: "Data" },
      { campo: "nomeCompleto", label: "Nome Completo" },
      { campo: "idade", label: "Idade" },
      { campo: "sexo", label: "Sexo" },
      { campo: "identidadeGenero", label: "Id. Gênero" },
      { campo: "racaCor", label: "Raça/Cor" },
      { campo: "spas", label: "SPAs" },
      { campo: "intervencao", label: "Intervenção" },
      { campo: "territorio", label: "Território" },
      { campo: "insumos", label: "Insumos" },
      { campo: "cadUnico", label: "Cad. Único" },
      { campo: "territorioEspecifico", label: "Território de Referência" },
    ],
  },
};