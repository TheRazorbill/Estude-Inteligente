document.getElementById('quiz-form').addEventListener('submit', function(event) {
            event.preventDefault();

            const form = event.target;
            const answers = {};
            const radios = form.querySelectorAll('input[type="radio"]:checked');

            radios.forEach(radio => {
                const type = radio.value;
                answers[type] = (answers[type] || 0) + 1;
            });

            let resultText = '';
            let mostFrequentType = null;
            let maxCount = 0;

            for (const type in answers) {
                if (answers[type] > maxCount) {
                    maxCount = answers[type];
                    mostFrequentType = type;
                }
            }

            const descriptions = {
                'visual': 'Seu estilo de aprendizagem é **Visual**. Você aprende melhor com gráficos, imagens, mapas mentais e vídeos.',
                'auditivo': 'Seu estilo de aprendizagem é **Auditivo**. Você assimila informações ouvindo, discutindo e explicando conceitos para outras pessoas.',
                'pratico': 'Seu estilo de aprendizagem é **Prático**. Você aprende fazendo, experimentando e resolvendo problemas na prática.',
                'organizacional': 'Seu estilo de aprendizagem é **Organizacional**. Você se beneficia de cronogramas, planejamento e métodos de estudo estruturados.'
            };
            
            if (mostFrequentType) {
                resultText = descriptions[mostFrequentType] || 'Não foi possível determinar um estilo predominante. Tente responder novamente!';
            } else {
                resultText = 'Por favor, responda a todas as perguntas para ver o seu resultado.';
            }

            document.getElementById('result').innerHTML = resultText;
        });
