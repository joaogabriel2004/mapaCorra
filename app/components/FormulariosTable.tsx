import { Formulario } from "../types/formulario";

type Props = {
  formularios: Formulario[];
};

export default function FormulariosTable({
  formularios,
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
              <th className="p-3 text-left">Nome</th>
              <th className="p-3 text-left">Idade</th>
              <th className="p-3 text-left">Sexo</th>
              <th className="p-3 text-left">Id. Gênero</th>
              <th className="p-3 text-left">Raça/Cor</th>
              <th className="p-3 text-left">SPAs</th>
              <th className="p-3 text-left">Intervenção</th>
              <th className="p-3 text-left">Território</th>
              <th className="p-3 text-left">Insumos</th>
              <th className="p-3 text-left">CadÚnico</th>
              <th className="p-3 text-center">Qnt</th>
            </tr>
          </thead>

          <tbody>
            {formularios.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 text-gray-800"
              >
                <td className="p-3">
                  {item.nomeCompleto}
                </td>

                <td className="p-3">
                  {item.idade}
                </td>

                <td className="p-3">
                  {item.sexo}
                </td>

                <td className="p-3">
                  {item.identidadeGenero}
                </td>

                <td className="p-3">
                  {item.racaCor}
                </td>

                <td className="p-3">
                  {item.spas}
                </td>

                <td className="p-3">
                  {item.intervencao}
                </td>

                <td className="p-3">
                  {item.territorio}
                </td>

                <td className="p-3">
                  {item.insumos}
                </td>

                <td className="p-3">
                  {item.cadUnico}
                </td>

                <td className="p-3 text-center font-bold text-[#ef7d00]">
                  {index + 1}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-[#f4f0e8] text-left">
            <tr>
              <td
                colSpan={11}
                className="p-4 text-left font-bold text-gray-800"
              >
                Total de pessoas: <span className="font-black text-[#ef7d00]">{formularios.length}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}