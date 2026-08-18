export interface Equipe {
  id: string;
  nome: string;
  ativo: boolean;
  spreadsheetId: string;
  tipoFormulario: string;
  abas?: string[];
}