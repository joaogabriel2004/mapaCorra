"use client";

import { Formulario } from "@/app/types/formulario";

interface ModalMesclagemProps {
  aberto: boolean;
  onFechar: () => void;
  selecionados: Formulario[];
  registroFinal: Formulario;
  setRegistroFinal: React.Dispatch<React.SetStateAction<Formulario>>;
  onConfirmar: () => void;
  enviando: boolean;
}

export function ModalMesclagem({
  aberto,
  onFechar,
  selecionados,
  registroFinal,
  setRegistroFinal,
  onConfirmar,
  enviando,
}: ModalMesclagemProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-100">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Conferência & Mesclagem de Registros
            </h3>
            <p className="text-xs text-gray-500">
              Revise as linhas selecionadas e ajuste as informações finais que serão salvas.
            </p>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 1. SELEÇÃO */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            1. Registros Selecionados ({selecionados.length}):
          </h4>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 font-semibold">
                  <th className="p-2.5">ID</th>
                  <th className="p-2.5">Nome Completo</th>
                  <th className="p-2.5 text-center">Idade</th>
                  <th className="p-2.5 text-center">Sexo</th>
                  <th className="p-2.5 text-center">Gênero</th>
                  <th className="p-2.5 text-center">Raça/Cor</th>
                  <th className="p-2.5 text-center">SPAs</th>
                  <th className="p-2.5 text-center">CAD-Único</th>
                  {/* Adicionado o cabeçalho do Território para alinhar a tabela */}
                  <th className="p-2.5 text-center">Território</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {selecionados.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-100/80">
                    <td className="p-2.5 font-mono font-bold text-gray-900">
                      {item.id || "NR"}
                    </td>
                    <td className="p-2.5">{item.nomeCompleto || "NR"}</td>
                    <td className="p-2.5 text-center">{item.idade || "NR"}</td>
                    <td className="p-2.5 text-center">{item.sexo || "NR"}</td>
                    <td className="p-2.5 text-center">{item.identidadeGenero || "NR"}</td>
                    <td className="p-2.5 text-center">{item.racaCor || "NR"}</td>
                    <td className="p-2.5 text-center">{item.spas || "NR"}</td>
                    <td className="p-2.5 text-center">{item.cadUnico || "NR"}</td>
                    <td className="p-2.5 text-center">{item.territorio || "NR"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. FORMULÁRIO EDITÁVEL DA MESCLAGEM */}
        <div className="bg-amber-50/70 rounded-2xl p-4 border-2 border-amber-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-[#ef7d00] uppercase tracking-wider flex items-center gap-1.5">
              ✏️ 2. Resultado da Mesclagem (Editável)
            </h4>
            <span className="text-[11px] text-amber-800 font-medium">
              Informações consolidadas automaticamente. Você pode editar qualquer campo.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                IDs Mesclados (1ª Coluna):
              </label>
              <input
                type="text"
                value={registroFinal.id || ""}
                onChange={(e) =>
                  setRegistroFinal({ ...registroFinal, id: e.target.value })
                }
                placeholder="Ex: 104;2023;12481"
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm font-mono font-bold bg-white text-[#ef7d00] focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Nome Completo:
              </label>
              <input
                type="text"
                value={registroFinal.nomeCompleto || ""}
                onChange={(e) =>
                  setRegistroFinal({
                    ...registroFinal,
                    nomeCompleto: e.target.value,
                  })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm font-semibold bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Idade:
              </label>
              <input
                type="text"
                value={registroFinal.idade || ""}
                onChange={(e) =>
                  setRegistroFinal({ ...registroFinal, idade: e.target.value })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Sexo:
              </label>
              <input
                type="text"
                value={registroFinal.sexo || ""}
                onChange={(e) =>
                  setRegistroFinal({ ...registroFinal, sexo: e.target.value })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Identidade de Gênero:
              </label>
              <input
                type="text"
                value={registroFinal.identidadeGenero || ""}
                onChange={(e) =>
                  setRegistroFinal({
                    ...registroFinal,
                    identidadeGenero: e.target.value,
                  })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Raça / Cor:
              </label>
              <input
                type="text"
                value={registroFinal.racaCor || ""}
                onChange={(e) =>
                  setRegistroFinal({
                    ...registroFinal,
                    racaCor: e.target.value,
                  })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                SPAs (Substâncias):
              </label>
              <input
                type="text"
                value={registroFinal.spas || ""}
                onChange={(e) =>
                  setRegistroFinal({ ...registroFinal, spas: e.target.value })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Território de Referência:
              </label>
              <input
                type="text"
                value={registroFinal.territorio || ""}
                onChange={(e) =>
                  setRegistroFinal({
                    ...registroFinal,
                    territorio: e.target.value,
                  })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">
                Tem CadÚnico?:
              </label>
              <input
                type="text"
                value={registroFinal.cadUnico || ""}
                onChange={(e) =>
                  setRegistroFinal({
                    ...registroFinal,
                    cadUnico: e.target.value,
                  })
                }
                className="w-full border border-amber-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-600 focus:outline-none focus:border-[#ef7d00]"
              />
            </div>
          </div>
        </div>

        {/* BOTÕES DO MODAL */}
        <div className="flex justify-end items-center gap-3 border-t border-gray-200 pt-4">
          <button
            type="button"
            onClick={onFechar}
            disabled={enviando}
            className="px-5 py-2.5 rounded-xl border-2 border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition text-sm cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={enviando}
            className="bg-[#009640] hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-50 text-sm cursor-pointer shadow-md"
          >
            {enviando ? "Enviando para Mesclagem..." : "Confirmar & Enviar Mesclagem"}
          </button>
        </div>
      </div>
    </div>
  );
}