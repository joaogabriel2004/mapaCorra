"use client";

import { useState, useEffect } from "react";
import { Formulario } from "@/app/types/formulario";

type Props = {
  aberto: boolean;
  data: string;
  equipe: string;
  planilha: string;
  territorio?: string;
  formularios: Formulario[];
  onCancelar: () => void;
  onConfirmar: (dataEditada: string) => void;
};

export default function ModalConfirmacao({
  aberto,
  data,
  equipe,
  planilha,
  territorio,
  formularios,
  onCancelar,
  onConfirmar,
}: Props) {
  // Estado local para permitir a edição da data
  const [dataEnvio, setDataEnvio] = useState(data);

  // Garante que o estado local resete sempre que a modal abrir com uma nova data
  useEffect(() => {
    setDataEnvio(data);
  }, [data, aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="bg-[#009640] px-6 py-4 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">
            Confirmar envio
          </h2>
        </div>

        {/* CORPO DA MODAL */}
        <div className="p-6 space-y-5 overflow-y-auto flex-grow text-gray-800">
          
          {/* RESUMO E EDIÇÃO DE DATA */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            
            {/* Campo Editável de Data */}
            <div className="flex items-center justify-between gap-4">
              <label htmlFor="dataEnvio" className="font-semibold text-gray-700">
                Data do Registro:
              </label>
              <input
                id="dataEnvio"
                type="date"
                value={dataEnvio}
                onChange={(e) => setDataEnvio(e.target.value)}
                className="border-2 border-gray-300 rounded-xl px-3 py-1.5 font-bold text-gray-900 focus:outline-none focus:border-[#009640]"
              />
            </div>

            <div className="flex justify-between border-t pt-2 text-sm">
              <span className="font-semibold">Equipe:</span>
              <span>{equipe}</span>
            </div>
          </div>

          {/* LISTA DE PESSOAS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-gray-700">
                Pessoas a serem enviadas:
              </h3>
              <span className="bg-[#ef7d00] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {formularios.length}
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
              {formularios.map((item, index) => (
                <div key={item.id || index} className="p-2.5 text-sm flex justify-between items-center hover:bg-gray-50">
                  <span className="font-medium text-gray-800 truncate max-w-[220px]">
                    {index + 1}. {item.nomeCompleto || "Sem nome"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {item.idade ? `${item.idade} anos` : ""} {item.territorio ? `• ${item.territorio}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AVISO */}
          <div className="rounded-xl bg-yellow-50 border border-yellow-300 p-3 text-xs text-yellow-900">
            Confira a <strong>data</strong> antes de enviar. Em caso de erro, é possível editar nesta tela. em <strong>"Data do Registro".</strong>
          </div>

        </div>

        {/* RODAPÉ / AÇÕES */}
        <div className="flex justify-end gap-3 border-t p-4 flex-shrink-0">
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-xl border border-gray-300 px-5 py-2 font-medium bg-red-700 text-white hover:bg-red-800 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => onConfirmar(dataEnvio)}
            className="rounded-xl bg-[#ef7d00] px-5 py-2 font-semibold text-white hover:bg-[#d96f00] transition"
          >
            Confirmar envio
          </button>
        </div>

      </div>
    </div>
  );
}