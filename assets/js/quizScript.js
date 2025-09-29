// Garante que o script só será executado após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o formulário do quiz pelo ID
    const quizForm = document.getElementById('quiz-form');

    // Verifica se o formulário existe na página
    if (quizForm) {
        // Adiciona um event listener para o evento de 'submit' do formulário
        quizForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de recarregar a página ao submeter o formulário

            const form = event.target; // O formulário que disparou o evento
            const answers = {}; // Objeto para armazenar a contagem de cada tipo de resposta
            // Seleciona todos os inputs de rádio que estão marcados (selecionados)
            const radios = form.querySelectorAll('input[type="radio"]:checked');

            // Itera sobre os rádios selecionados para contar as respostas
            radios.forEach(radio => {
                const type = radio.value; // Obtém o valor do rádio (ex: 'visual', 'auditivo')
                answers[type] = (answers[type] || 0) + 1; // Incrementa a contagem para o tipo de resposta
            });

            let resultText = ''; // Variável para armazenar o texto do resultado
            let mostFrequentType = null; // Variável para armazenar o tipo de aprendizagem mais frequente
            let maxCount = 0; // Variável para armazenar a contagem máxima de um tipo

            // Itera sobre as respostas para encontrar o tipo mais frequente
            for (const type in answers) {
                if (answers[type] > maxCount) {
                    maxCount = answers[type]; // Atualiza a contagem máxima
                    mostFrequentType = type; // Atualiza o tipo mais frequente
                }
            }

            // Objeto que mapeia os tipos de aprendizagem para suas descrições
            const descriptions = {
                'visual': 'Seu estilo de aprendizagem é **Visual**. Você aprende melhor com gráficos, imagens, mapas mentais e vídeos.',
                'auditivo': 'Seu estilo de aprendizagem é **Auditivo**. Você assimila informações ouvindo, discutindo e explicando conceitos para outras pessoas.',
                'pratico': 'Seu estilo de aprendizagem é **Prático**. Você aprende fazendo, experimentando e resolvendo problemas na prática.',
                'organizacional': 'Seu estilo de aprendizagem é **Organizacional**. Você se beneficia de cronogramas, planejamento e métodos de estudo estruturados.'
            };
            
            // Define o texto do resultado com base no tipo mais frequente
            if (mostFrequentType) {
                resultText = descriptions[mostFrequentType] || 'Não foi possível determinar um estilo predominante. Tente responder novamente!';
            } else {
                resultText = 'Por favor, responda a todas as perguntas para ver o seu resultado.'; // Mensagem se nem todas as perguntas forem respondidas
            }

            // Exibe o resultado na página
            document.getElementById('result').innerHTML = resultText;
        });
    }
});