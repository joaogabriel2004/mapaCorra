"use client";

import { Formulario } from "@/app/types/formulario";

interface TabelaAssistidosProps {
  assistidos: Formulario[];
  selecionados: Formulario[];
  onToggleSelecao: (pessoa: Formulario) => void;
  onEditar: (pessoa: Formulario) => void;
  loading: boolean;
  nomeTerritorio: string;
}

export function TabelaAssistidos({
  assistidos,
  selecionados,
  onToggleSelecao,
  onEditar,
  loading,
  nomeTerritorio,
}: TabelaAssistidosProps) {
  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 font-medium animate-pulse">
        Buscando dados de "{nomeTerritorio}"...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 rounded-2xl border border-gray-200 h-150">
      <table className="w-full text-left border-collapse min-w-[850px]">
        <thead>
          <tr className="bg-[#009640] text-white text-sm">
            <th className="p-3 text-center w-12">Sel.</th>
            <th className="p-3 w-20">ID</th>
            <th className="p-3">Nome</th>
            <th className="p-3 text-center w-20">Idade</th>
            <th className="p-3 text-center w-20">Sexo</th>
            <th className="p-3 text-center w-24">Gênero</th>
            <th className="p-3 text-center w-28">Raça/Cor</th>
            <th className="p-3 text-center">SPAs</th>
            <th className="p-3 text-center w-32">CAD-ÚNICO</th>
            <th className="p-3 text-center w-24">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
          {assistidos.length === 0 ? (
            <tr>
              <td colSpan={10} className="p-6 text-center text-gray-400">
                Nenhum assistido encontrado para este território.
              </td>
            </tr>
          ) : (
            assistidos.map((pessoa, idx) => {
              const estaSelecionado = selecionados.some(
                (item) => String(item.id) === String(pessoa.id)
              );

              return (
                <tr
                  key={`${pessoa.id}-${idx}`}
                  onClick={() => onToggleSelecao(pessoa)}
                  className={`cursor-pointer transition-colors ${
                    estaSelecionado
                      ? "bg-amber-100/80 font-semibold"
                      : "hover:bg-blue-50/50"
                  }`}
                >
                  <td className="p-3 text-center border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={estaSelecionado}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#ef7d00] rounded cursor-pointer"
                    />
                  </td>
                  <td className="p-3 border-r border-gray-200 font-mono text-xs">
                    {pessoa.id}
                  </td>
                  <td className="p-3 border-r border-gray-200">
                    {pessoa.nomeCompleto}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {pessoa.idade || "NR"}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {pessoa.sexo || "NR"}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {pessoa.identidadeGenero || "NR"}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {pessoa.racaCor || "NR"}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {pessoa.spas || "NR"}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {pessoa.cadUnico || "NR"}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita marcar a linha ao clicar no botão
                        onEditar(pessoa);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer shadow-sm h-8"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}