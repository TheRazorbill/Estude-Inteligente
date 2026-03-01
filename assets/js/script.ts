// Garante que o script só será executado após o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa os ícones Feather Icons, substituindo os elementos <i> por SVGs
    feather.replace();

    // Inicializa a biblioteca AOS (Animate On Scroll) para animações
    AOS.init({
        duration: 800, // Duração da animação em milissegundos
        once: true, // As animações ocorrem apenas uma vez ao rolar para o elemento
    });

    // Lógica para aplicar o tema escuro/claro ao carregar a página
    const themeToggle = document.getElementById('theme-toggle'); // Botão de alternância de tema
    // Verifica se o tema 'dark' está salvo no localStorage ou se o sistema operacional prefere o tema escuro
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark'); // Adiciona a classe 'dark' ao elemento <html>
    }

    // Adiciona event listener ao botão de alternância de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark'); // Alterna a classe 'dark' no elemento <html>
            // Salva a preferência de tema no localStorage
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    // Lógica para o menu mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button'); // Botão do menu mobile
    const mobileMenu = document.getElementById('mobile-menu'); // O menu mobile em si
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); // Alterna a visibilidade do menu mobile
        });
    }

    // Elementos do DOM relacionados à pesquisa de livros
    const searchInput = document.getElementById('book-search-input'); // Campo de input para a pesquisa
    const searchButton = document.getElementById('book-search-button'); // Botão de busca
    const searchResults = document.getElementById('book-search-results'); // Área onde os resultados serão exibidos

    // Adiciona event listener ao botão de busca de livros
    if (searchButton && searchInput && searchResults) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim(); // Obtém o valor do input e remove espaços em branco
            if (query) {
                fetchBooks(query); // Chama a função para buscar livros se a query não estiver vazia
            }
        });
    }

    // Função assíncrona para buscar livros na Open Library API
    async function fetchBooks(query) {
        searchResults.innerHTML = '<p class="text-center text-text-light">Carregando...</p>'; // Exibe mensagem de carregamento
        try {
            // Faz a requisição à API da Open Library
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
            const data = await response.json(); // Converte a resposta para JSON
            displayBooks(data.docs); // Chama a função para exibir os livros
        } catch (error) {
            console.error('Erro ao buscar livros:', error); // Loga o erro no console
            searchResults.innerHTML = '<p class="text-center text-red-500">Erro ao carregar livros. Tente novamente mais tarde.</p>'; // Exibe mensagem de erro
        }
    }

    // Função para exibir os livros na interface
    function displayBooks(books) {
        searchResults.innerHTML = ''; // Limpa os resultados anteriores
        if (books.length === 0) {
            searchResults.innerHTML = '<p class="text-center text-text-light">Nenhum livro encontrado.</p>'; // Mensagem se nenhum livro for encontrado
            return;
        }

        // Cria um grid para exibir os cards dos livros
        const grid = document.createElement('div');
        grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'; // Classes Tailwind para o grid

        // Limita a exibição a 12 livros e itera sobre eles
        books.slice(0, 12).forEach(book => {
            const title = book.title || 'Título Desconhecido'; // Obtém o título do livro ou um valor padrão
            const author = book.author_name ? book.author_name.join(', ') : 'Autor Desconhecido'; // Obtém o(s) autor(es)
            const coverId = book.cover_i; // ID da capa do livro
            // Constrói a URL da capa ou usa uma imagem de placeholder
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/120x180?text=Sem+Capa';

            // Cria um card para cada livro
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg card-hover flex flex-col items-center text-center'; // Classes Tailwind para o card
            card.innerHTML = `
                <img src="${coverUrl}" alt="Capa de ${title}" class="w-28 h-44 object-cover rounded-md mb-4 shadow-md">
                <div class="flex-grow">
                    <h3 class="text-lg font-bold text-primary dark:text-purple-300">${title}</h3>
                    <p class="text-sm text-text-light dark:text-gray-400 mt-1">por ${author}</p>
                    <p class="text-xs text-gray-400 mt-2">Publicado em: ${book.first_publish_year || 'N/A'}</p>
                </div>
            `;
            grid.appendChild(card); // Adiciona o card ao grid
        });

        searchResults.appendChild(grid); // Adiciona o grid de cards à área de resultados
    }
});