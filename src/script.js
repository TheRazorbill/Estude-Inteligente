// -------------------- VARIÁVEIS PRINCIPAIS --------------------
// índice da pergunta atual
indicePerguntaAtual = 0

// objeto que vai guardar a pontuação por categoria
pontos = { visual: 0, auditivo: 0, pratico: 0, organizacional: 0 }

// array de perguntas carregado do quiz.json
perguntas = []

// array de técnicas carregado do db.json
tecnicas = []


// -------------------- CARREGAR OS ARQUIVOS --------------------
// usar fetch() para buscar quiz.json e salvar em perguntas
// usar fetch() para buscar db.json e salvar em tecnicas
// quando terminar de carregar, chamar iniciarQuiz()


// -------------------- INICIAR QUIZ --------------------
função iniciarQuiz() {
    indicePerguntaAtual = 0
    resetarEstado()
    exibirPergunta()
}


// -------------------- EXIBIR PERGUNTA --------------------
função exibirPergunta() {
    pegar perguntaAtual = perguntas[indicePerguntaAtual]

    // colocar o texto da pergunta no <h2 id="pergunta">
    elementoPergunta.innerText = perguntaAtual.texto

    // para cada opção da pergunta:
    //  - colocar o texto no botão
    //  - associar um evento de clique que chama selecionarResposta(tipo)
}


// -------------------- RESETAR ESTADO --------------------
função resetarEstado() {
    // limpar botões anteriores
    // esconder botão "próxima"
}


// -------------------- SELECIONAR RESPOSTA --------------------
função selecionarResposta(tipoCategoria) {
    // incrementar pontos[tipoCategoria] += 1
    // desabilitar os botões
    // mostrar botão "próxima"
}


// -------------------- PRÓXIMA PERGUNTA --------------------
ao clicar no botão "próxima": {
    indicePerguntaAtual += 1
    se ainda existem perguntas:
        chamar exibirPergunta()
    senão:
        chamar exibirResultado()
}


// -------------------- EXIBIR RESULTADO --------------------
função exibirResultado() {
    // descobrir qual categoria tem mais pontos:
    // categoriaFinal = aquela com maior valor dentro de pontos

    // filtrar tecnicas do db.json que tenham categoriaFinal no array "categorias"

    // exibir no <div id="resultado">:
    //  - a categoria final
    //  - uma lista com as técnicas recomendadas (nome + resumo)
}
