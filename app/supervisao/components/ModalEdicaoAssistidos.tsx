import React, { useState } from 'react';

export interface Formulario {
  id: string;
  nomeCompleto: string;
  idade: string;
  sexo: string;
  idGenero: string;
  racaCor: string;
  spas: string;
  cadUnico: string;
}

interface ModalEdicaoProps {
  assistido: Formulario;
  onSalvar: (dadosAtualizados: Formulario) => Promise<void>;
  onFechar: () => void;
  salvando: boolean;
}

export function ModalEdicaoAssistido({
  assistido,
  onSalvar,
  onFechar,
  salvando,
}: ModalEdicaoProps) {
  const [formData, setFormData] = useState<Formulario>({ ...assistido });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl relative">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Editar Assistido (ID: {formData.id})
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
            <input
              type="text"
              name="nomeCompleto"
              value={formData.nomeCompleto || ''}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Idade</label>
              <input
                type="text"
                name="idade"
                value={formData.idade || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sexo</label>
              <input
                type="text"
                name="sexo"
                value={formData.sexo || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Raça/Cor</label>
              <input
                type="text"
                name="racaCor"
                value={formData.racaCor || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CadÚnico</label>
              <input
                type="text"
                name="cadUnico"
                value={formData.cadUnico || ''}
                onChange={handleChange}
                className="w-full border rounded p-2 mt-1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">SPAs</label>
            <input
              type="text"
              name="spas"
              value={formData.spas || ''}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={onFechar}
              disabled={salvando}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}