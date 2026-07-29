Com certeza! Um bom `README.md` valoriza muito o projeto, facilita para outros desenvolvedores e deixa a documentação super profissional.

Preparei um modelo completo baseado em toda a estrutura do **Corra Pro Abraço** (tecnologias, fluxo de autenticação, formulários por equipe, suporte a planilhas, etc.).

Basta criar um arquivo chamado `README.md` na raiz do seu projeto e colar o conteúdo abaixo:

---

```markdown
# 🤝 Corra Pro Abraço - Mapa de Campo

Sistema Web para gestão e coleta de dados de campo das equipes do **Programa Corra Pro Abraço**. A aplicação permite que técnicos realizem o preenchimento, edição e sincronização em lote dos formulários de atendimento de acordo com a especificidade de cada equipe.

---

## 🎨 Identidade Visual & Cores da Marca

O projeto segue estritamente a paleta oficial da identidade visual:

| Cor | Hexadecimal | Utilização |
| :--- | :--- | :--- |
| **Amarelo/Dourado** | `#F09A06` | Destaques, alertas de regra, ações primárias |
| **Azul Ciano** | `#1FAEE3` | Botões secundários, navegação |
| **Verde** | `#009640` | Sucesso, contadores e confirmações |
| **Fundo Principal** | `#F4F0E8` | Background geral da aplicação |

---

## 🚀 Funcionalidades Principais

* **🔐 Autenticação & Permissões:** Controle de acesso por e-mail e vínculo automático com a equipe e perfil do técnico logado.
* **📋 Formulários Dinâmicos por Equipe:** Renderização condicional baseada na equipe do técnico:
  * Centro de Referência
  * Praça
  * Extensão
  * Mares
  * VAC
* **🔍 Autocomplete Inteligente:** Busca rápida por nome para puxar dados pré-existentes da base de assistidos.
* **📝 Adição e Edição Local:** Tabela interativa em memória para gerenciamento dos atendimentos do dia antes do envio final.
* **📊 Sincronização em Lote:** Envio agrupado diretamente para a planilha Google Sheets/API referente à equipe selecionada.
* **🔔 Notificações Interativas:** Feedback visual com Toasts e Modais customizados para validação de campos e prevenção de registros duplicados.

---

## 🛠️ Tecnologias Utilizadas

* **Framework:** [Next.js](https://nextjs.org/) (App Router / React)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Notificações:** [React Hot Toast](https://react-hot-toast.com/)
* **Ícones / UI:** Lucide React / Heroicons

---

## 📦 Estrutura de Pastas

```text
MAPACORRA/
├── app/
│   ├── api/
│   │   └── formularios/
│   │       └── route.ts         # Endpoint de API para formulários
│   ├── components/
│   │   ├── formularios/        # Componentes de formulários por equipe
│   │   │   ├── FormularioCentro.tsx
│   │   │   ├── FormularioExtensao.tsx
│   │   │   ├── FormularioMares.tsx
│   │   │   ├── FormularioPraca.tsx
│   │   │   └── FormularioVac.tsx
│   │   ├── FormulariosTable.tsx  # Tabela com listagem de formulários
│   │   ├── Input.tsx             # Componente de Input customizado
│   │   ├── ModalConfirmacao.tsx  # Modal de confirmação para envio
│   │   ├── Select.tsx            # Componente de Select customizado
│   │   └── SuggestionList.tsx    # Lista de sugestões para autocomplete
│   ├── config/
│   │   └── formularios.ts        # Configurações e colunas dos formulários
│   ├── context/
│   │   └── AuthContext.tsx       # Contexto global de Autenticação
│   ├── login/
│   │   └── page.tsx              # Tela de Login da aplicação
│   ├── services/                 # Comunicação com APIs e Firebase
│   │   ├── api.ts
│   │   ├── equipes.ts
│   │   ├── firebase.ts
│   │   └── tecnicos.ts
│   ├── types/                    # Interfaces e definições de tipos TypeScript
│   │   ├── equipe.ts
│   │   └── formulario.ts
│   └── page.tsx                  # Tela principal (Home/Mapa de Campo)

```

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* Gerenciador de pacotes (**npm**, **yarn** ou **pnpm**)

### Passo a Passo

1. **Clonar o repositório:**
```bash
git clone [https://github.com/joaogabriel2004/mapaCorra](https://github.com/joaogabriel2004/mapaCorra)
cd mapaCorra

```


2. **Instalar as dependências:**
```bash
npm install

```


3. **Configurar as Variáveis de Ambiente:**
Crie um arquivo `.env.local` na raiz do projeto e configure suas chaves de API / Firebase / Endpoints


4. **Iniciar o servidor de desenvolvimento:**
```bash
npm run dev

```


5. **Acessar no navegador:**
Abra [http://localhost:3000](http://localhost:3000) para ver a aplicação rodando.

---

## 👥 Contribuição e Suporte

Desenvolvido por João Gabriel para otimizar a rotina de preenchimento de Mapas de Campo e Listas de Presença do **Programa Corra Pro Abraço**.

```