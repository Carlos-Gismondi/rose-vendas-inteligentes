\# Modelo de dados — Rose Vendas Inteligentes



\## 1. Armazenamento



O aplicativo salva os dados localmente no aparelho usando AsyncStorage.



As informações são convertidas em JSON e armazenadas na chave:



```text

@rose\_vendas\_mvp\_v1

```



Não há banco SQL, backend ou sincronização entre aparelhos nesta versão.



\## 2. Estrutura principal



O objeto salvo contém quatro coleções:



| Coleção | Conteúdo |

| --- | --- |

| `clients` | Clientes cadastrados |

| `products` | Catálogo de produtos |

| `orders` | Pedidos registrados |

| `completedReminders` | Identificadores dos lembretes concluídos |



\## 3. Clientes — `clients`



| Campo | Tipo | Descrição |

| --- | --- | --- |

| `id` | Número | Identificador do cliente |

| `name` | Texto | Nome completo |

| `phone` | Texto | Telefone ou WhatsApp |

| `birthday` | Texto | Aniversário, informado em `AAAA-MM-DD` |

| `preferences` | Texto | Preferências e interesses |

| `notes` | Texto | Observações |

| `createdAt` | Texto | Data do cadastro em `AAAA-MM-DD` |



O formulário exige nome e telefone preenchidos. Os demais campos são opcionais.



\## 4. Produtos — `products`



| Campo | Tipo | Descrição |

| --- | --- | --- |

| `id` | Número | Identificador do produto |

| `name` | Texto | Nome |

| `category` | Texto | Categoria |

| `price` | Número | Preço inicial em reais |

| `interval` | Número | Intervalo estimado de recompra em dias |



O catálogo contém cinco produtos demonstrativos definidos no código. Não existe cadastro ou edição de produtos pela interface.



\## 5. Pedidos — `orders`



| Campo | Tipo | Descrição |

| --- | --- | --- |

| `id` | Número | Identificador do pedido |

| `clientId` | Número | Referência ao cliente |

| `productId` | Número | Referência ao produto |

| `quantity` | Número | Quantidade comprada |

| `price` | Número | Preço unitário registrado na compra |

| `date` | Texto | Data informada em `AAAA-MM-DD` |

| `status` | Texto | `Concluído`, `Pendente` ou `Cancelado` |



Cada pedido registra um produto, com sua quantidade.



O total é calculado por:



```text

Total = quantity × price

```



O preço do pedido é registrado separadamente do preço do catálogo.



\## 6. Relacionamentos



```mermaid

erDiagram

&#x20;   CLIENTES ||--o{ PEDIDOS : possui

&#x20;   PRODUTOS ||--o{ PEDIDOS : aparece\_em

```



\- Um cliente pode ter vários pedidos.

\- Um produto pode aparecer em vários pedidos.

\- Cada pedido referencia um cliente e um produto.

\- Excluir um cliente pela interface também remove seus pedidos.



Essas relações são controladas pelo código JavaScript, sem chaves estrangeiras de um banco relacional.



\## 7. Lembretes de recompra



Os lembretes pendentes são calculados a partir dos pedidos concluídos.



```text

Data prevista = data do pedido + intervalo do produto

```



Cada lembrete calculado contém:



| Campo | Tipo | Descrição |

| --- | --- | --- |

| `key` | Texto | Combinação de cliente, produto e data prevista |

| `clientId` | Número | Referência ao cliente |

| `productId` | Número | Referência ao produto |

| `dueDate` | Texto | Data prevista de recompra |



Formato da chave:



```text

clientId-productId-dueDate

```



Exemplo:



```text

1-1-2026-11-15

```



A coleção `completedReminders` guarda apenas as chaves dos lembretes marcados como concluídos.



\## 8. Regras implementadas



\- Apenas pedidos concluídos geram lembretes.

\- A quantidade comprada não altera o intervalo de recompra.

\- Lembretes com a mesma chave aparecem uma única vez.

\- A lista de contatos inclui previsões futuras e vencidas.

\- Concluir um lembrete oculta a pendência, sem criar outro pedido.

\- Uma nova compra não elimina automaticamente os lembretes anteriores.

\- Os indicadores mensais consideram apenas pedidos concluídos no mês e ano atuais.



\## 9. Dados de demonstração



Na primeira abertura sem dados salvos, o app utiliza:



\- 70 clientes fictícios.

\- 5 produtos.

\- 5 pedidos: 4 concluídos e 1 pendente.

\- Nenhum lembrete marcado como concluído.



As datas iniciais são calculadas em relação ao dia de criação da base.



A opção \*\*Restaurar\*\* substitui os dados atuais pela demonstração após confirmação.



\## 10. Limitações identificadas no código



\- Não há backup, exportação ou sincronização.

\- Datas e valores numéricos precisam de validação mais completa.

\- Falhas de gravação não são apresentadas ao usuário.

\- Os dados recuperados não passam por validação de estrutura.

\- A exclusão de clientes não limpa suas chaves em `completedReminders`.

\- Identificadores de clientes podem ser reutilizados após exclusões, o que pode causar coincidência com chaves antigas de lembretes.



\## 11. Base desta documentação



Documento elaborado por inspeção do arquivo `App.js` fornecido no projeto.



Os tipos descritos representam a estrutura esperada pelo código; não são garantidos por um esquema de banco ou por validação completa. Esta análise não substitui testes no aplicativo.

