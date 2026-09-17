"use client";

import React from "react";
import { Formulario } from "@/app/types/formulario";

interface ModalEdicaoProps {
  aberto: boolean;
  onFechar: () => void;
  registro: Formulario | null;
  setRegistro: React.Dispatch<React.SetStateAction<Formulario | null>>;
  onSalvar: (e: React.FormEvent) => void;
  salvando: boolean;
  equipe?: any;
}

export function ModalEdicao({
  aberto,
  onFechar,
  registro,
  setRegistro,
  onSalvar,
  salvando,
  equipe,
}: ModalEdicaoProps) {
  if (!aberto || !registro) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-100">
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-5">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Editar Registro de Assistido
            </h3>
            <p className="text-xs text-gray-500">
              ID do registro: <span className="font-mono font-bold text-[#ef7d00]">{registro.id || "N/A"}</span>
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

        <form onSubmit={onSalvar} className="space-y-5">
          {/* BLOCO DO FORMULÁRIO */}
          <div className="bg-gray-50/70 rounded-2xl p-4 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Informações do Assistido
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* ID (Editável ou Somente Leitura se preferir) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  ID:
                </label>
                <input
                  type="text"
                  value={registro.id || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, id: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-mono font-bold bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                />
              </div>

              {/* Nome Completo */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={registro.nomeCompleto || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, nomeCompleto: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm font-semibold bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                  required
                />
              </div>

              {/* Idade */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Idade:
                </label>
                <input
                  type="text"
                  value={registro.idade || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, idade: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                />
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Sexo:
                </label>
                <input
                  type="text"
                  value={registro.sexo || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, sexo: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                />
              </div>

              {/* Identidade de Gênero */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Identidade de Gênero:
                </label>
                <input
                  type="text"
                  value={registro.identidadeGenero || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, identidadeGenero: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                />
              </div>

              {/* Raça / Cor */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Raça / Cor:
                </label>
                <input
                  type="text"
                  value={registro.racaCor || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, racaCor: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                />
              </div>

              {/* SPAs */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  SPAs (Substâncias):
                </label>
                <input
                  type="text"
                  value={registro.spas || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, spas: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                />
              </div>

              {/* Território condicional (se equipe for Centro de Referência ou Praça) */}
              {equipe && (equipe.nome === "Centro de Referência" || equipe.nome === "Praça") && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Território de Referência:
                  </label>
                  <input
                    type="text"
                    value={registro.territorio || ""}
                    onChange={(e) =>
                      setRegistro({ ...registro, territorio: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                  />
                </div>
              )}

              {/* CadÚnico */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">
                  Tem CadÚnico?:
                </label>
                <input
                  type="text"
                  value={registro.cadUnico || ""}
                  onChange={(e) =>
                    setRegistro({ ...registro, cadUnico: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:border-[#1FAEE3]"
                />
              </div>
            </div>
          </div>

          {/* BOTÕES DO MODAL */}
          <div className="flex justify-end items-center gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="px-5 py-2.5 rounded-xl border-2 border-gray-300 font-bold text-gray-600 hover:bg-gray-100 transition text-sm cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="bg-[#1FAEE3] hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-50 text-sm cursor-pointer shadow-md flex items-center gap-2"
            >
              {salvando ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}