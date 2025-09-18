# Estude + Inteligente

## Visão Geral do Projeto

O projeto "Estude + Inteligente" é uma plataforma web desenvolvida para auxiliar estudantes a descobrir seu estilo de aprendizagem predominante e a encontrar recursos relevantes, como livros, para otimizar seus estudos. A aplicação oferece um quiz interativo para identificar o perfil de aprendizado (Visual, Auditivo, Prático ou Organizacional) e uma funcionalidade de busca de livros integrada com a Open Library API.

## Funcionalidades Principais

-   **Quiz de Estilo de Aprendizagem:** Um questionário dinâmico que ajuda o usuário a entender como ele aprende melhor.
-   **Resultados Personalizados:** Com base nas respostas do quiz, o usuário recebe uma descrição do seu estilo de aprendizagem e recomendações.
-   **Busca de Livros:** Integração com a Open Library API para permitir que os usuários pesquisem livros por título e visualizem informações como capa, autor e ano de publicação.
-   **Design Responsivo:** A interface é adaptada para oferecer uma boa experiência em diferentes dispositivos (desktops, tablets e smartphones).

## Processo de Desenvolvimento e Melhorias

O desenvolvimento deste projeto passou por algumas etapas importantes e desafios, especialmente no que diz respeito à organização do código e à experiência do usuário.

### Resolução do Erro `TypeError` e Refatoração do Quiz

Inicialmente, foi identificado um erro `Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` no arquivo `script.js`. Este erro ocorria porque o script tentava anexar um `eventListener` a um elemento (`quiz-form`) que não estava presente na página `index.html`, mas sim em `pages/quiz.html`.

Para resolver isso, o seguinte processo foi adotado:
1.  **Análise do Erro:** Verificação da mensagem de erro e da linha indicada em `script.js`.
2.  **Inspeção dos Arquivos:** Leitura de `script.js` e `index.html` para entender o contexto e confirmar a ausência do elemento `quiz-form` no `index.html`.
3.  **Refatoração da Lógica do Quiz:** A lógica completa do quiz foi extraída de `script.js` e movida para um novo arquivo dedicado, `assets/js/quizScript.js`.
4.  **Inclusão Condicional do Script:** O `quizScript.js` foi incluído apenas em `pages/quiz.html`, e a lógica foi encapsulada em um `DOMContentLoaded` listener para garantir que os elementos HTML estejam carregados antes da execução do script.
5.  **Limpeza do `script.js`:** A parte do código referente ao quiz foi removida de `script.js`, que agora se concentra exclusivamente na funcionalidade de busca de livros.

### Integração da Open Library API

A funcionalidade de busca de livros é um componente chave do projeto. Ela foi implementada utilizando a Open Library API para buscar informações sobre livros. O processo envolve:
-   Captura da entrada do usuário para o termo de busca.
-   Realização de uma requisição `fetch` para a API da Open Library.
-   Processamento da resposta JSON e exibição dos resultados de forma amigável na interface.
-   Tratamento de erros para casos de falha na requisição ou ausência de resultados.

### Melhorias de Design (CSS) e Limpeza de Código

Após a resolução do problema funcional, o foco foi direcionado para aprimorar a estética e a manutenibilidade do código:
1.  **Remoção de Comentários:** Todos os comentários em arquivos JavaScript e CSS foram removidos para manter o código mais limpo e conciso, seguindo a prática de "código auto-documentado".
2.  **Refatoração do CSS:** Os arquivos CSS (`style.css`, `quizStyle.css`, `resultado.css`) foram extensivamente revisados para um design mais profissional e dinâmico. Isso incluiu:
    *   **Uso de Variáveis CSS:** Definição de variáveis globais (`:root`) para cores, fontes e sombras, garantindo consistência e facilitando futuras alterações de tema.
    *   **Tipografia Aprimorada:** Ajustes em tamanhos de fonte, pesos e `line-height` para melhor legibilidade e hierarquia visual.
    *   **Layout e Espaçamento:** Otimização de margens, paddings e `gap` para um layout mais agradável e espaçado.
    *   **Interatividade:** Adição de transições suaves e efeitos de sombra em elementos interativos (botões, links, cards de livros, opções do quiz) para uma experiência de usuário mais engajadora.
    *   **Responsividade:** Revisão e aprimoramento das media queries para garantir que o site seja totalmente responsivo em diferentes tamanhos de tela.

## Versionamento e Organização do Código

Durante o desenvolvimento, o versionamento foi gerenciado com Git. Houve um momento em que as alterações relacionadas à correção do `TypeError` e as melhorias de CSS foram agrupadas em um único commit na branch `feat/CSS`. Idealmente, a correção do erro e as melhorias de design poderiam ter sido separadas em commits distintos para um histórico mais granular. No entanto, o commit atual reflete um conjunto coeso de melhorias que abordam tanto a funcionalidade quanto a estética do projeto.

A estrutura de arquivos e pastas foi organizada de forma lógica:
-   `assets/css/`: Contém todos os arquivos de estilo.
-   `assets/js/`: Contém os scripts JavaScript.
-   `assets/img/`: Armazena as imagens do projeto.
-   `pages/`: Contém as páginas HTML secundárias (quiz, técnicas).

## Como Rodar o Projeto

Para visualizar e interagir com o projeto:
1.  Clone o repositório para sua máquina local.
2.  Abra o arquivo `index.html` em seu navegador web.
3.  Navegue pelas páginas para explorar o quiz e a busca de livros.

## Tecnologias Utilizadas

-   HTML5
-   CSS3
-   JavaScript
-   Open Library API