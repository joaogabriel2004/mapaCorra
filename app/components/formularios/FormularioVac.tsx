import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import SuggestionList from "@/app/components/SuggestionList";

type Props = {
  formData: any;
  handleChange: any;
  sugestoes: any[];
  selecionarPessoa: (pessoa: any) => void;
};

export default function FormularioVac({
  formData,
  handleChange,
  sugestoes,
  selecionarPessoa,
}: Props) {
  return (
    <div>

      <div className="relative mb-4">
        <Input
          label="Nome Completo"
          name="nomeCompleto"
          value={formData.nomeCompleto}
          onChange={handleChange}
        />

        <SuggestionList
          sugestoes={sugestoes}
          selecionarPessoa={selecionarPessoa}
        />
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
          options={[
            "M",
            "F",
            "NR",
          ]}
        />

        <Input
          label="Id. Gênero"
          name="identidadeGenero"
          value={formData.identidadeGenero}
          onChange={handleChange}
        />

        <Input
          label="Raça/Cor"
          name="racaCor"
          value={formData.racaCor}
          onChange={handleChange}
        />

        <Input
          label="Tipo do Assistido"
          name="tipoAssistido"
          value={formData.tipoAssistido}
          onChange={handleChange}
        />

        <Input
          label="Intervenção"
          name="intervencao"
          value={formData.intervencao}
          onChange={handleChange}
        />

        <Input
          label="Território"
          name="territorio"
          value={formData.territorio}
          onChange={handleChange}
        />

        <Input
          label="Insumos"
          name="insumos"
          value={formData.insumos}
          onChange={handleChange}
        />

        <Select
          label="Cad. Único"
          name="cadUnico"
          value={formData.cadUnico}
          onChange={handleChange}
          options={[
            "SIM",
            "NÃO",
            "NR",
            "NSA",
          ]}
        />

        <Input
          label="Resultado da Audiência"
          name="resultadoAudiencia"
          value={formData.resultadoAudiencia}
          onChange={handleChange}
        />

        <Input
          label="Contato"
          name="contato"
          value={formData.contato}
          onChange={handleChange}
        />
      </div>

    </div>
  );
}