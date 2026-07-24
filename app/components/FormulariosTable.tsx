import { Formulario } from "../types/formulario";
import { ColunaFormulario } from "../config/formularios";

type Props = {
  formularios: Formulario[];
  colunas: ColunaFormulario[];
  onRemove?: (index: number) => void;
  onEdit?: (index: number) => void; // <-- Nova prop para edição
};

export default function FormulariosTable({
  formularios,
  colunas,
  onRemove,
  onEdit,
}: Props) {
  if (formularios.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-[#ef7d00] mb-4">
        Pessoas adicionadas
      </h2>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[1200px] border-collapse bg-white text-sm">
          <thead className="bg-[#009640] text-white">
            <tr>
              {colunas.map((coluna) => (
                <th key={coluna.campo} className="p-3 text-left">
                  {coluna.label}
                </th>
              ))}

              <th className="p-3 text-center">Qnt</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {formularios.map((item, index) => (
              <tr key={index} className="border-t border-gray-200 text-gray-800 hover:bg-gray-50 transition">
                {colunas.map((coluna) => (
                  <td key={coluna.campo} className="p-3">
                    {String(item[coluna.campo as keyof Formulario] || "")}
                  </td>
                ))}

                <td className="p-3 text-center font-bold text-[#ef7d00]">
                  {index + 1}
                </td>
                
                {/* AÇÕES: EDITAR E REMOVER */}
                <td className="p-3 text-center space-x-3">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(index)}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Editar
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemove?.(index)}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-[#f4f0e8] text-left">
            <tr>
              <td colSpan={colunas.length + 2} className="p-4 text-left font-bold text-gray-800">
                Total de pessoas:{" "}
                <span className="font-black text-[#ef7d00]">
                  {formularios.length}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}