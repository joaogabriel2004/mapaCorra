import { Formulario } from "@/app/types/formulario";

type Props = {
  sugestoes: Formulario[];
  selecionarPessoa: (pessoa: Formulario) => void;
  tipoFormulario?: string; // Prop adicionada para identificar o contexto
};

export default function SuggestionList({
  sugestoes,
  selecionarPessoa,
  tipoFormulario,
}: Props) {
  if (sugestoes.length === 0) {
    return null;
  }

  // Verifica se o formulário pertence a uma das equipes que não devem exibir dados sensíveis/específicos
  const ocultarDetalhes =
    tipoFormulario === "vac" || tipoFormulario === "arteEducacao";

  return (
    <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-60 overflow-y-auto">
      {sugestoes.map((pessoa, index) => (
        <button
          key={pessoa.id || index}
          type="button"
          onClick={() => selecionarPessoa(pessoa)}
          className="w-full text-left px-4 py-3 hover:bg-gray-100 transition border-b last:border-b-0 border-gray-100 text-black"
        >
          <p className="font-semibold">{pessoa.nomeCompleto}</p>

          <p className="text-sm text-gray-500">
            {pessoa.idade} anos | {pessoa.territorio}
            {!ocultarDetalhes && pessoa.cadUnico && (
              <> | CadÚnico: {pessoa.cadUnico}</>
            )}
          </p>
        </button>
      ))}
    </div>
  );
}