# Nivo — contexto e orientações do projeto

## Comunicação

- Converse com Julia em português do Brasil, com linguagem clara e direta.
- Ao implementar uma solicitação, examine os arquivos existentes e faça as alterações no projeto.
- Explique brevemente o que mudou, quais arquivos foram alterados e como foi verificado.
- Pergunte quando uma decisão depender de uma informação essencial que não esteja no código ou no pedido.

## Produto

Nivo é um aplicativo de finanças. O contexto abaixo foi recuperado de uma conversa anterior chamada “Estruturação do App”. É um registro parcial e histórico; confira a implementação atual antes de assumir que ele ainda descreve o projeto.

## Contexto técnico recuperado

- Os exemplos da conversa utilizavam React, JSX e classes utilitárias no estilo Tailwind CSS.
- Foram citadas as páginas Accounts.jsx, Categories.jsx, Cards.jsx e Transactions.jsx.
- Foram citadas navegação com navigate e a rota /categories.
- Confirme a localização dos arquivos, as dependências, o backend, a persistência e os comandos pelo repositório. Esses detalhes não foram verificados nesta retomada.

## Fluxo discutido

Configuração inicial: Contas → Categorias → Cartões → Transações → Finalizar configuração.

- Na etapa de contas, foi discutido mostrar “Continuar para Categorias” quando o onboarding estivesse ativo e houvesse uma conta criada.
- Nas etapas intermediárias, os botões de avanço deveriam ser delicados, com verde suave, fundo translúcido, borda discreta e cantos arredondados.
- Foi discutido reservar o verde mais forte para “Finalizar configuração”.
- O último pedido recuperado foi dar mais espaço entre o conteúdo e o botão de avanço e centralizá-lo horizontalmente na página.
- Colocar o botão abaixo do card de progresso foi uma sugestão do assistente; não há confirmação recuperada de que Julia a aprovou ou implementou.

## Como trabalhar no código

- Preserve a estrutura, os componentes e as convenções existentes.
- Leia package.json, README e os arquivos relevantes antes de escolher comandos ou dependências.
- Não substitua telas inteiras quando uma alteração localizada resolver o pedido.
- Ao mexer na interface, considere telas pequenas, estados vazios, foco de teclado e legibilidade.
- Ao mexer em cálculos financeiros, confira precisão, arredondamento, datas e convenções monetárias já adotadas pelo projeto.
- Não altere dados financeiros reais ou credenciais como parte de ajustes visuais.
- Execute as verificações pertinentes disponíveis e informe qualquer limitação real.

## Primeira conversa no VS Code

Ao receber um pedido para retomar o Nivo, leia este arquivo, examine a estrutura atual e resuma o que encontrou. O contexto acima não é uma tarefa pendente a executar automaticamente: aguarde o pedido atual de Julia antes de implementar os ajustes históricos.
