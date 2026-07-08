export type Formulario = {
  id: string;
  data: string;
  nomeCompleto: string;
  idade: string;
  sexo: string;
  identidadeGenero: string;
  racaCor: string;
  spas: string;
  intervencao: string;
  territorio: string;
  insumos: string;
  cadUnico: string;

  kitHigiene?: string;
  territorioEspecifico?: string;
};

export const initialForm: Formulario = {
  id: "",
  data: "",
  nomeCompleto: "",
  idade: "",
  sexo: "",
  identidadeGenero: "",
  racaCor: "",
  spas: "",
  intervencao: "",
  territorio: "",
  insumos: "",
  cadUnico: "",

  kitHigiene: "",
  territorioEspecifico: "",
};