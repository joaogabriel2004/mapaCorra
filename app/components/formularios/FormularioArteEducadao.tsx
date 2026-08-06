import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import SuggestionList from "@/app/components/SuggestionList";

type Props = {
  formData: any;
  handleChange: any;
  sugestoes: any[];
  selecionarPessoa: (pessoa: any) => void;
  tipoFormulario?: string;
};

export default function FormularioArteEducacao({
  formData,
  handleChange,
  sugestoes,
  selecionarPessoa,
  tipoFormulario, // Recebido nas props
}: Props) {
  // Define se deve exibir a lista de sugestões
  const exibirSugestoes =
    tipoFormulario === "vac" || tipoFormulario === "arteEducacao";

  return (
    <div>
      <div className="relative mb-4">
        <div className="mb-4">
          <Select
            label="Território"
            name="territorio"
            value={formData.territorio}
            onChange={handleChange}
            options={[
              "Centro de Referência",
              "Mares",
              "Aquidabã",
              "Itapuã",
            ]}
          />
        </div>

        <Input
          label="Nome Completo"
          name="nomeCompleto"
          value={formData.nomeCompleto}
          onChange={handleChange}
        />

        {/* Renderização condicional do SuggestionList */}
        {exibirSugestoes && (
          <SuggestionList
            sugestoes={sugestoes}
            selecionarPessoa={selecionarPessoa}
          />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Idade"
          name="idade"
          value={formData.idade}
          onChange={handleChange}
        />

        <Select
          label="Sexo"
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
          options={["M", "F", "NR"]}
        />

        <Input
          label="Id. Gênero"
          name="identidadeGenero"
          value={formData.identidadeGenero}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}