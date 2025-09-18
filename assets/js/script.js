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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('book-search-input');
    const searchButton = document.getElementById('book-search-button');
    const searchResults = document.getElementById('book-search-results');

    if (searchButton && searchInput && searchResults) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value;
            if (query) {
                fetchBooks(query);
            }
        });
    }

    async function fetchBooks(query) {
        searchResults.innerHTML = 'Carregando...';
        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
            const data = await response.json();
            displayBooks(data.docs);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            searchResults.innerHTML = 'Erro ao carregar livros. Tente novamente mais tarde.';
        }
    }

    function displayBooks(books) {
        searchResults.innerHTML = '';
        if (books.length === 0) {
            searchResults.innerHTML = '<p>Nenhum livro encontrado.</p>';
            return;
        }

        const ul = document.createElement('ul');
        books.forEach(book => {
            const li = document.createElement('li');
            const title = book.title || 'Título Desconhecido';
            const author = book.author_name ? book.author_name.join(', ') : 'Autor Desconhecido';
            const coverId = book.cover_i;
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/100x150?text=Sem+Capa';

            li.innerHTML = `
                <img src="${coverUrl}" alt="Capa de ${title}">
                <div>
                    <h3>${title}</h3>
                    <p>Autor(es): ${author}</p>
                    <p>Ano de Publicação: ${book.first_publish_year || 'Desconhecido'}</p>
                </div>
            `;
            ul.appendChild(li);
        });
        
        document.addEventListener('DOMContentLoaded', () => {
            const aiTextInput = document.getElementById('ai-text-input');
            const aiAnalyzeButton = document.getElementById('ai-analyze-button');
            const aiAnalysisResults = document.getElementById('ai-analysis-results');
        
            // Substitua 'YOUR_HUGGING_FACE_API_TOKEN' pelo seu token real da Hugging Face API
            const HUGGING_FACE_API_TOKEN = 'YOUR_HUGGING_FACE_API_TOKEN';
            const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english'; // Exemplo de modelo de análise de sentimento
        
            if (aiAnalyzeButton && aiTextInput && aiAnalysisResults) {
                aiAnalyzeButton.addEventListener('click', async () => {
                    const text = aiTextInput.value;
                    if (text) {
                        aiAnalysisResults.innerHTML = 'Analisando...';
                        try {
                            const response = await fetch(
                                HUGGING_FACE_API_URL,
                                {
                                    headers: { Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}` },
                                    method: 'POST',
                                    body: JSON.stringify({ inputs: text }),
                                }
                            );
                            const result = await response.json();
                            displayAiAnalysisResults(result);
                        } catch (error) {
                            console.error('Erro ao analisar texto com IA:', error);
                            aiAnalysisResults.innerHTML = 'Erro ao analisar texto. Verifique seu token de API e tente novamente.';
                        }
                    }
                });
            }
        
            function displayAiAnalysisResults(results) {
                aiAnalysisResults.innerHTML = '';
                if (!results || results.length === 0) {
                    aiAnalysisResults.innerHTML = '<p>Nenhum resultado de análise.</p>';
                    return;
                }
        
                const ul = document.createElement('ul');
                results[0].forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span>${item.label}:</span> ${(item.score * 100).toFixed(2)}%`;
                    ul.appendChild(li);
                });
                aiAnalysisResults.appendChild(ul);
            }
        });
        searchResults.appendChild(ul);
    }
});
