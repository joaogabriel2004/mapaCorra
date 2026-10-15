// src/app/components/Manutencao.tsx
import React from "react";

interface ManutencaoProps {
  titulo?: string;
  mensagem?: string;
  previsao?: string;
}

export default function Manutencao({
  titulo = "Sistema em Manutenção",
  mensagem = "Estamos realizando atualizações técnicas e melhorias para otimizar o registro de atendimentos. Por favor, retorne em breve.",
  previsao,
}: ManutencaoProps) {
  return (
    <main className="min-h-screen bg-[#f4f0e8] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        {/* Ícone / Ilustração com as cores da identidade visual */}
        <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-center shadow-sm">
          <span className="text-4xl">🛠️</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-2xl font-black text-gray-800 mb-2">
          {titulo}
        </h1>

        {/* Subtítulo da Marca */}
        <p className="text-sm font-bold text-[#ef7d00] uppercase tracking-wider mb-4">
          Corra Pro Abraço
        </p>

        {/* Mensagem descritiva */}
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          {mensagem}
        </p>

        {/* Previsão opcional */}
        {previsao && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 mb-6 text-amber-900 text-xs font-semibold">
            ⏰ Previsão de retorno: {previsao}
          </div>
        )}

        {/* Barra decorativa com as cores institucionais */}
        <div className="w-full flex h-2 rounded-full overflow-hidden">
          <div className="flex-1 bg-[#ef7d00]" />
          <div className="flex-1 bg-[#009640]" />
          <div className="flex-1 bg-[#1FAEE3]" />
        </div>
      </div>
    </main>
  );
}