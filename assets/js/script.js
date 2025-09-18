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
        
        searchResults.appendChild(ul);
    }
});
