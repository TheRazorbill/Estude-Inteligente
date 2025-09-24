document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    AOS.init({
        duration: 800,
        once: true,
    });

    const themeToggle = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
    }

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const searchInput = document.getElementById('book-search-input');
    const searchButton = document.getElementById('book-search-button');
    const searchResults = document.getElementById('book-search-results');

    if (searchButton && searchInput && searchResults) {
        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                fetchBooks(query);
            }
        });
    }

    async function fetchBooks(query) {
        searchResults.innerHTML = '<p class="text-center text-text-light">Carregando...</p>';
        try {
            const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            displayBooks(data.docs);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
            searchResults.innerHTML = '<p class="text-center text-red-500">Erro ao carregar livros. Tente novamente mais tarde.</p>';
        }
    }

    function displayBooks(books) {
        searchResults.innerHTML = '';
        if (books.length === 0) {
            searchResults.innerHTML = '<p class="text-center text-text-light">Nenhum livro encontrado.</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid md:grid-cols-2 lg:grid-cols-3 gap-8';

        books.slice(0, 12).forEach(book => { 
            const title = book.title || 'Título Desconhecido';
            const author = book.author_name ? book.author_name.join(', ') : 'Autor Desconhecido';
            const coverId = book.cover_i;
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : 'https://via.placeholder.com/120x180?text=Sem+Capa';

            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg card-hover flex flex-col items-center text-center';
            card.innerHTML = `
                <img src="${coverUrl}" alt="Capa de ${title}" class="w-28 h-44 object-cover rounded-md mb-4 shadow-md">
                <div class="flex-grow">
                    <h3 class="text-lg font-bold text-primary dark:text-purple-300">${title}</h3>
                    <p class="text-sm text-text-light dark:text-gray-400 mt-1">por ${author}</p>
                    <p class="text-xs text-gray-400 mt-2">Publicado em: ${book.first_publish_year || 'N/A'}</p>
                </div>
            `;
            grid.appendChild(card);
        });

        searchResults.appendChild(grid);
    }
});