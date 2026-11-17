\# Arquitetura técnica — Rose Vendas Inteligentes



\## 1. Visão geral



O aplicativo é um MVP mobile desenvolvido em JavaScript, React Native e Expo.



Nesta versão, a interface, as regras de negócio e os dados demonstrativos estão concentrados no arquivo `App.js`.



O processamento e o armazenamento acontecem no aparelho. Não existe backend, autenticação ou sincronização com servidor.



\## 2. Tecnologias



Versões declaradas no `package.json`:



| Tecnologia | Versão | Finalidade |

| --- | --- | --- |

| React | `19.1.0` | Componentes e gerenciamento de estado |

| React Native | `0.81.4` | Interface e recursos nativos |

| Expo | `\~54.0.0` | Ambiente de desenvolvimento e execução |

| AsyncStorage | `2.2.0` | Armazenamento local |

| Babel Core | `^7.25.2` | Transformação do código JavaScript |

| Expo Status Bar | `\~3.0.0` | Dependência declarada, sem uso direto no `App.js` |



O componente `StatusBar` utilizado no aplicativo é importado do React Native.



\## 3. Estrutura dos arquivos



```text

rose/

├── App.js

├── app.json

├── package.json

├── package-lock.json

├── .gitignore

├── README.md

└── docs/

&#x20;   ├── modelo-de-dados.md

&#x20;   └── arquitetura.md

```



| Arquivo | Responsabilidade |

| --- | --- |

| `App.js` | Telas, componentes, estado, regras e persistência |

| `app.json` | Configuração do aplicativo Expo |

| `package.json` | Dependências e comandos de execução |

| `package-lock.json` | Registro da árvore de dependências |

| `.gitignore` | Exclusões do versionamento |

| `README.md` | Apresentação e instruções do projeto |

| `docs/` | Documentação complementar |



\## 4. Fluxo da aplicação



```mermaid

flowchart TD

&#x20;   A\[Inicialização] --> B\[Criar estado com dados demonstrativos]

&#x20;   B --> C\[Tentar ler AsyncStorage]

&#x20;   C --> D{Existem dados salvos?}

&#x20;   D -->|Sim| E\[Interpretar JSON e atualizar estado]

&#x20;   D -->|Não| F\[Manter demonstração]

&#x20;   E --> G\[Finalizar carregamento]

&#x20;   F --> G

&#x20;   G --> H\[Interação com as telas]

&#x20;   H --> I\[Atualizar estado React]

&#x20;   I --> J\[Recalcular informações exibidas]

&#x20;   I --> K\[Salvar JSON no AsyncStorage]

```



Se ocorrer uma falha de leitura ou interpretação do JSON, o aplicativo mostra um aviso e mantém a base demonstrativa.



A interface não possui uma tela específica de carregamento.



\## 5. Organização interna



\### Interface



O aplicativo utiliza componentes nativos, como:



\- `View` e `Text`.

\- `TextInput`.

\- `TouchableOpacity`.

\- `ScrollView`.

\- `Modal`.

\- `SafeAreaView`.

\- `StatusBar`.



Os estilos são definidos com `StyleSheet.create`.



\### Componentes reutilizáveis



| Componente | Responsabilidade |

| --- | --- |

| `AppButton` | Botões e suas variações visuais |

| `Field` | Campo de formulário com rótulo |

| `Pill` | Etiqueta visual de status |

| `SectionTitle` | Título de seção |

| `Metric` | Indicador do painel |



\### Telas



| Função | Área |

| --- | --- |

| `renderDashboard` | Painel |

| `renderClients` | Clientes |

| `renderOrders` | Pedidos |

| `renderContacts` | Contatos |



Essas funções retornam a interface da área selecionada. Não representam arquivos ou rotas independentes.



\## 6. Estado e navegação



O aplicativo usa `useState` para controlar:



\- Dados de clientes, produtos, pedidos e lembretes concluídos.

\- Aba selecionada.

\- Texto de pesquisa.

\- Abertura dos formulários.

\- Dados temporários dos formulários.

\- Cliente em edição.

\- Conclusão da tentativa de carregamento local.



A navegação inferior altera o estado `tab`, selecionando uma das quatro áreas:



```text

Painel | Clientes | Pedidos | Contatos

```



Não há biblioteca de navegação instalada. A troca de abas limpa o texto de pesquisa.



Os cadastros de clientes e pedidos são apresentados em modais.



\## 7. Regras de negócio



As regras são executadas no próprio `App.js`.



| Função ou cálculo | Responsabilidade |

| --- | --- |

| `makeInitialData` | Criar os dados demonstrativos |

| `saveClient` | Cadastrar ou atualizar cliente |

| `removeClient` | Excluir cliente e seus pedidos |

| `saveOrder` | Registrar pedido |

| `reminders` | Calcular previsões pendentes com `useMemo` |

| `monthOrders` | Selecionar pedidos concluídos no mês atual |

| `monthSales` | Somar as vendas concluídas do mês |

| `completeReminder` | Registrar a conclusão de um lembrete |

| `resetDemo` | Restaurar os dados demonstrativos |



Funções auxiliares formatam datas, valores monetários e calculam intervalos.



O detalhamento dos campos e relacionamentos está em \[Modelo de dados](modelo-de-dados.md).



\## 8. Persistência



Dois efeitos React, definidos com `useEffect`, controlam o armazenamento:



1\. Ao iniciar, o app tenta recuperar o JSON do AsyncStorage.

2\. Após a tentativa de carregamento, alterações no estado `data` disparam a gravação do objeto completo.



Chave utilizada:



```text

@rose\_vendas\_mvp\_v1

```



Não há gravação em banco SQL ou envio dos registros para um servidor pelo código analisado.



\### Limitações da persistência



\- Não há backup ou sincronização.

\- O conteúdo recuperado não passa por validação de estrutura.

\- Falhas de gravação são capturadas sem aviso ao usuário.

\- Não há mecanismo explícito de recuperação ou controle de concorrência das gravações.

\- A persistência deve ser validada em dispositivo.



\## 9. Compartilhamento de mensagens



A função `shareMessage` monta um texto com o primeiro nome do cliente e o produto relacionado ao lembrete.



Depois, chama:



```javascript

Share.share({ message });

```



O sistema operacional apresenta as opções de compartilhamento disponíveis.



\- O usuário escolhe o aplicativo de destino.

\- Não existe integração direta com a API do WhatsApp.

\- Não há envio automático ou confirmação de entrega.

\- O texto utiliza um modelo fixo, sem chamada a uma API de IA.

\- Concluir o lembrete é uma ação separada.



\## 10. Configuração Expo



O arquivo `app.json` declara:



| Configuração | Valor |

| --- | --- |

| Nome | Rose Vendas Inteligentes |

| Slug | `rose-vendas-inteligentes` |

| Versão | `1.0.0` |

| Orientação | Vertical |

| Aparência | Clara |

| Identificador Android | `com.rose.vendasinteligentes` |

| Suporte a tablet iOS | Habilitado na configuração |



Essas configurações não comprovam a existência de uma versão compilada, publicada nas lojas ou validada em tablets.



\## 11. Execução



Na pasta que contém `package.json`:



```bash

npm ci

npm start

```



Outros comandos declarados:



```bash

npm run android

npm run ios

npm run web

```



A execução exige ambiente compatível com o Expo SDK do projeto. O simulador iOS requer macOS e Xcode.



O comando web está declarado, mas o pacote fornecido não inclui `react-dom` e `react-native-web`. A execução web precisa de configuração e validação adicionais.



Não são exigidas variáveis de ambiente ou chaves de API pelo código atual.



\## 12. Evoluções propostas



As melhorias abaixo ainda não estão implementadas:



\- Separar telas e componentes em arquivos próprios.

\- Extrair regras de recompra e persistência para módulos.

\- Reforçar validação dos formulários e dos dados recuperados.

\- Apresentar erros de gravação e opções de recuperação.

\- Criar testes das regras de negócio.

\- Implementar backup e exportação.

\- Avaliar backend, autenticação e sincronização.

\- Preparar e validar uma forma de acesso online adequada à entrega do desafio.



\## 13. Base da análise



Documento elaborado a partir de `App.js`, `app.json` e `package.json` fornecidos no projeto.



A análise descreve a estrutura identificada no código. Não comprova execução em dispositivo, conclusão de testes ou publicação do aplicativo.

