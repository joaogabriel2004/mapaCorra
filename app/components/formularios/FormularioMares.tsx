import Input from "@/app/components/Input";
import Select from "@/app/components/Select";
import SuggestionList from "@/app/components/SuggestionList";

type Props = {
  formData: any;
  handleChange: any;
  sugestoes: any[];
  selecionarPessoa: (pessoa: any) => void;
};

export default function FormularioMares({
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
          label="SPAs"
          name="spas"
          value={formData.spas}
          onChange={handleChange}
        />

        <Input
          label="Atividade Externa"
          name="atividadeExterna"
          value={formData.atividadeExterna}
          onChange={handleChange}
        />        

        <Input
          label="Intervenção/Encaminhamento"
          name="intervencao"
          value={formData.intervencao}
          onChange={handleChange}
        />

        <Input
          label="Insumos"
          name="insumos"
          value={formData.insumos}
          onChange={handleChange}
        />

        <Select
          label="Sanitário"
          name="sanitario"
          value={formData.sanitario}
          onChange={handleChange}
          options={[
            "SIM",
            "NÃO",
            "NSA",
          ]}
        />

        <Select
          label="Banho"
          name="banho"
          value={formData.banho}
          onChange={handleChange}
          options={[
            "SIM",
            "NÃO",
            "NSA",
          ]}
        />

        <Select
          label="Kit Higiene"
          name="kitHigiene"
          value={formData.kitHigiene}
          onChange={handleChange}
          options={[
            "SIM",
            "NÃO",
            "NR",
            "NSA",
          ]}
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
      </div>

    </div>
  );
}