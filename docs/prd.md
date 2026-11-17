\# PRD — Rose Vendas Inteligentes



> Documento de Requisitos do Produto · Grupo 11 Nature  

> Versão: 1.0 · Status: rascunho para revisão da equipe



\## 1. Objetivo deste documento



Definir o problema, o público, a proposta de solução e os requisitos do MVP.



Este PRD foi elaborado após a criação da primeira versão do aplicativo, com base no código recebido e nas orientações das aulas 33, 34 e 35. Não representa um registro original do planejamento.



Responsável pelo produto (PO): a confirmar com a equipe.



\## 2. Contexto e problema



Rose é uma consultora Natura há oito anos, com uma carteira de 70 clientes registrados em um caderno.



O controle manual dificulta consultar o histórico de compras e acompanhar o momento de oferecer uma reposição. Com isso, oportunidades de recompra podem ser esquecidas.



\*\*Problema central:\*\* como ajudar Rose a identificar rapidamente quais clientes podem precisar de um novo contato?



\## 3. Persona



| Aspecto | Descrição |

| --- | --- |

| Nome | Rose |

| Atuação | Consultora de cosméticos Natura |

| Experiência | Oito anos |

| Carteira no cenário do desafio | 70 clientes |

| Organização atual | Anotações em caderno |

| Necessidade principal | Organizar compras e acompanhar oportunidades de recompra |



A persona faz parte do cenário educacional do desafio. Não foram apresentadas entrevistas ou pesquisas com uma consultora real.



\## 4. Proposta de solução



Um aplicativo mobile que centraliza clientes e pedidos e calcula previsões de recompra a partir de intervalos estimados por produto.



A consultora pode consultar as pendências, preparar uma mensagem e compartilhá-la manualmente pelo celular.



\*\*Proposta de valor:\*\* ajudar Rose a saber quem contatar, quando contatar e qual produto mencionar.



\## 5. Objetivos do MVP



\- Centralizar o cadastro dos clientes.

\- Registrar compras e consultar o histórico.

\- Identificar oportunidades estimadas de reposição.

\- Facilitar a preparação de mensagens de contato.

\- Oferecer uma navegação simples para a rotina da consultora.



\### Critério central do desafio



> Rose consegue saber em 10 segundos para quem ligar hoje?



Essa é uma meta de validação de usabilidade, ainda não medida.



O aplicativo atual ordena as previsões por data, mas inclui contatos futuros e não oferece um filtro específico para hoje. A equipe deve testar se essa apresentação atende à meta.



\## 6. Escopo e prioridades



\### Prioridade essencial



| ID | Requisito | Situação identificada no código |

| --- | --- | --- |

| RF01 | Cadastrar clientes | Implementado |

| RF02 | Editar, pesquisar e excluir clientes | Implementado |

| RF03 | Registrar pedidos | Implementado |

| RF04 | Consultar histórico de pedidos | Implementado |

| RF05 | Calcular previsões de recompra | Implementado |

| RF06 | Listar contatos pendentes por data prevista | Implementado |



\### Recursos de apoio



| ID | Requisito | Situação identificada no código |

| --- | --- | --- |

| RF07 | Exibir resumo no painel | Implementado |

| RF08 | Compartilhar mensagem com nome e produto | Implementado com modelo fixo |

| RF09 | Marcar lembrete como concluído | Implementado |

| RF10 | Manter os dados localmente entre sessões | Implementado com AsyncStorage |

| RF11 | Restaurar a base demonstrativa | Implementado com confirmação |



“Implementado” significa identificado no código analisado. Não significa que o requisito já foi aprovado em testes de execução.



\## 7. Histórias de usuário e critérios de aceitação



\### HU01 — Organizar clientes



Como consultora, quero cadastrar e atualizar clientes para consultar seus dados em um único lugar.



Critérios de aceitação:



\- Solicitar nome e telefone para salvar.

\- Permitir informar aniversário, preferências e observações.

\- Permitir pesquisar por nome ou telefone.

\- Permitir editar um cliente existente.

\- Solicitar confirmação antes da exclusão.

\- Informar que a exclusão também remove os pedidos relacionados.



\### HU02 — Registrar compras



Como consultora, quero registrar os pedidos para acompanhar o histórico de compras.



Critérios de aceitação:



\- Permitir selecionar cliente e produto.

\- Registrar quantidade, preço unitário, data e status.

\- Oferecer os status Concluído, Pendente e Cancelado.

\- Exibir o total calculado por quantidade multiplicada pelo preço.

\- Exibir os pedidos em ordem decrescente de data.

\- Permitir pesquisar o histórico pelo nome do cliente.



Cada pedido do MVP registra um produto, com sua quantidade.



\### HU03 — Acompanhar recompras



Como consultora, quero visualizar previsões de reposição para planejar meus contatos.



Critérios de aceitação:



\- Gerar previsões apenas para pedidos concluídos.

\- Somar o intervalo do produto à data da compra.

\- Ordenar as pendências pela data prevista.

\- Identificar previsões iguais ou anteriores ao dia atual como atingidas.

\- Permitir pesquisar por cliente ou produto.

\- Permitir concluir um lembrete e removê-lo da lista pendente.



As previsões são estimativas, não uma confirmação da necessidade de compra.



\### HU04 — Preparar um contato



Como consultora, quero uma mensagem com nome e produto para reduzir o trabalho de digitação.



Critérios de aceitação:



\- Preparar uma mensagem usando o primeiro nome do cliente e o produto.

\- Abrir o compartilhamento nativo do aparelho.

\- Manter o envio sob controle da consultora.

\- Não concluir o lembrete automaticamente ao abrir o compartilhamento.



O aplicativo não verifica envio, entrega ou resposta.



\### HU05 — Consultar o resumo



Como consultora, quero visualizar os principais números para acompanhar minha operação.



Critérios de aceitação:



\- Exibir o total de clientes.

\- Contar pedidos concluídos no mês e ano atuais.

\- Somar os valores desses pedidos.

\- Exibir o total de lembretes pendentes.

\- Apresentar próximos contatos e pedidos recentes.



O total de contatos pendentes inclui previsões futuras.



\### HU06 — Retomar o trabalho



Como consultora, quero reabrir o aplicativo e encontrar meus registros anteriores.



Critérios de aceitação:



\- Tentar carregar os dados salvos ao iniciar.

\- Persistir alterações localmente após o carregamento.

\- Solicitar confirmação antes de restaurar a demonstração.



A persistência precisa ser verificada em dispositivo. Não existe backup ou sincronização nesta versão.



\## 8. Jornada principal



```mermaid

flowchart LR

&#x20;   A\[Cadastrar cliente] --> B\[Registrar pedido concluído]

&#x20;   B --> C\[Calcular previsão de recompra]

&#x20;   C --> D\[Consultar contatos pendentes]

&#x20;   D --> E\[Compartilhar mensagem]

&#x20;   E --> F\[Concluir lembrete manualmente]

```



A consultora também pode concluir um lembrete sem compartilhar uma mensagem pelo aplicativo.



\## 9. Telas previstas no MVP



| Área | Finalidade |

| --- | --- |

| Painel | Mostrar indicadores, contatos e pedidos recentes |

| Clientes | Consultar a carteira e acessar cadastro, edição e exclusão |

| Pedidos | Consultar histórico e registrar compras |

| Contatos | Consultar previsões, compartilhar mensagens e concluir lembretes |



Os formulários de clientes e pedidos são apresentados em modais.



\## 10. Regras de negócio



\- O cadastro exige nome e telefone preenchidos.

\- Cada pedido referencia um cliente e um produto.

\- O total do pedido é quantidade multiplicada pelo preço unitário.

\- Apenas pedidos concluídos entram nas vendas mensais.

\- Apenas pedidos concluídos geram previsões de recompra.

\- O intervalo de recompra é fixo por produto.

\- A quantidade comprada não altera o intervalo.

\- Previsões com a mesma combinação de cliente, produto e data aparecem uma única vez.

\- Uma nova compra não elimina automaticamente previsões anteriores.

\- Concluir um lembrete não registra uma nova compra.

\- Excluir um cliente também remove seus pedidos.

\- Restaurar substitui os registros atuais pela base demonstrativa.



\## 11. Requisitos de qualidade



Os itens abaixo são critérios a verificar, sem aprovação registrada nesta etapa:



| ID | Requisito | Forma de verificação |

| --- | --- | --- |

| RQ01 | Navegação compreensível | Realizar a jornada principal sem orientação |

| RQ02 | Clareza das previsões | Verificar se o usuário entende que são estimativas |

| RQ03 | Persistência | Criar registros, fechar e reabrir o app |

| RQ04 | Legibilidade | Conferir textos, contraste e tamanhos em dispositivo |

| RQ05 | Formulários utilizáveis | Verificar teclado, rolagem e acesso aos botões |

| RQ06 | Proteção contra exclusão acidental | Conferir confirmações de exclusão e restauração |

| RQ07 | Identificação rápida de contato | Medir a tarefa proposta no limite de 10 segundos |



\## 12. Dados e privacidade



A demonstração utiliza 70 clientes fictícios, cinco produtos e cinco pedidos iniciais.



Os registros ficam no aparelho por meio de AsyncStorage. Não há autenticação, backup, sincronização ou camada própria de criptografia implementada no aplicativo.



Cuidados para o desafio:



\- Utilizar dados fictícios.

\- Não publicar dados de clientes reais no repositório.

\- Revisar o texto e o destinatário antes de compartilhar.

\- Não tratar o protótipo como pronto para operação com dados reais.



\## 13. Fora do escopo desta versão



| Recurso | Motivo |

| --- | --- |

| Login e múltiplas consultoras | O MVP demonstra uma operação local |

| Backend e sincronização | A primeira versão utiliza armazenamento no aparelho |

| IA integrada | As mensagens são montadas por um modelo fixo |

| Envio automático pelo WhatsApp | O contato permanece manual |

| Pagamentos e emissão fiscal | Não fazem parte do problema central |

| Controle de estoque | O foco é relacionamento e recompra |

| Cadastro de produtos pela interface | A demonstração usa catálogo fixo |

| Vários produtos no mesmo pedido | O modelo atual registra um produto por pedido |

| Edição e exclusão individual de pedidos | Não implementadas nesta versão |



\## 14. Limitações e pontos de atenção



Identificados por inspeção do código:



\- Datas e valores numéricos não possuem validação completa.

\- Falhas de gravação não são informadas ao usuário.

\- Não há validação da estrutura dos dados recuperados.

\- Lembretes antigos podem continuar pendentes após uma nova compra.

\- A lista não possui filtro exclusivo para contatos do dia.

\- A exclusão de clientes não limpa as chaves de lembretes concluídos.

\- O reaproveitamento de identificadores pode gerar coincidências com chaves antigas.



Esses pontos devem orientar a revisão técnica e os testes do grupo.



\## 15. Validação e evidências



Antes de considerar o MVP validado, a equipe deve:



\- Executar o aplicativo em um ambiente compatível.

\- Testar cadastro, edição, pesquisa e exclusão.

\- Conferir pedidos, totais e status.

\- Conferir as datas previstas de recompra.

\- Testar compartilhamento e conclusão de lembretes.

\- Verificar persistência após reabrir o app.

\- Medir a identificação de um contato em até 10 segundos.

\- Registrar resultados, problemas e correções.



Evidências recomendadas:



\- Dispositivo e ambiente utilizados.

\- Data e responsável pelo teste.

\- Resultado esperado e observado.

\- Capturas ou gravações sem dados reais.

\- Referência ao commit testado.



Nenhum resultado de execução é declarado como aprovado neste PRD.



\## 16. Entregáveis e pendências



| Item | Situação conhecida |

| --- | --- |

| Repositório GitHub | Criado |

| Branch develop | Criada e publicada |

| Código do MVP | Publicado na develop |

| README | Publicado |

| Modelo de dados | Publicado na develop |

| Arquitetura técnica | Publicada na develop |

| Prompt log do Tech Lead | Publicado na develop |

| PRD | Em elaboração, sujeito à revisão |

| Wireframes e documentação UI/UX | A confirmar com a equipe |

| Prompt mestre original | Não identificado no material recebido |

| Prompt logs dos demais integrantes | A confirmar com a equipe |

| Testes e evidências | A confirmar com a equipe |

| Acesso online para demonstração | A confirmar com a equipe |



A existência de um script web não comprova que há um deploy funcional. A forma de acesso para avaliação precisa ser definida e validada pelo grupo.



\## 17. Revisão da equipe



Antes da aprovação, confirmar:



\- Nome e responsabilidade de cada integrante.

\- Responsável pelo produto.

\- Concordância com prioridades e limites do escopo.

\- Resultados dos testes e ajustes necessários.

\- Forma de demonstração e acesso ao aplicativo.



\## 18. Documentos relacionados



\- \[Modelo de dados](modelo-de-dados.md)

\- \[Arquitetura técnica](arquitetura.md)

\- \[Prompt log do Tech Lead](prompt-log-tech-lead.md)

\- \[README do projeto](../README.md)

