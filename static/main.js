let page = 1;
let isFetching = false;
let isSearching = false;
const articleContainer = document.getElementById('article-container');
const searchBar = document.getElementById('search-bar');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalSummary = document.getElementById('modal-summary');
const modalClose = document.getElementById('modal-close');
const modalBackdrop = document.getElementById('modal-backdrop');
const searchButton = document.getElementById('search-button');

// Load the first 16 articles on page load
window.addEventListener('load', () => {
    fetchArticles();
});

window.addEventListener('scroll', () => {
    if (!isFetching && !isSearching && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        fetchArticles();
    }
});

searchButton.addEventListener('click', () => {
    isSearching = true;
    articleContainer.innerHTML = ''; // Clear previous results
    searchArticles();
});
window.addEventListener("DOMContentLoaded", (event) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let interval = null;

    function startAnimation(target) {
        let iteration = 0;

        clearInterval(interval);

        interval = setInterval(() => {
            target.innerText = target.innerText
                .split("")
                .map((letter, index) => {
                    if(index < iteration) {
                        return target.dataset.value[index];
                    }

                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");
          
            if(iteration >= target.dataset.value.length){ 
                clearInterval(interval);
            }
          
            iteration += 1 ;
        }, 30);
    }

    const target = document.querySelector(".uppercase");
    target.dataset.value = target.innerText;  // Store original text

    startAnimation(target);

    target.addEventListener('mouseover', function() {
        startAnimation(this);
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
});

function fetchArticles() {
    isFetching = true;
    fetch('/articles/?page=' + page)
        .then(response => response.json())
        .then(data => {
            data.forEach(addArticleToDOM);
            page++;
            isFetching = false;
        });
}

// function searchArticles() {
//     fetch('/search/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ query: searchBar.value })
//     })
//         .then(response => response.json())
//         .then(data => {
//             data.forEach(addArticleToDOM);
//             isSearching = false;
//         });
// }

function searchArticles() {
    const query = searchBar.value; // Get the entered query from the search bar
    fetch('/search/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query }) // Send the query in the request body
    })
        .then(response => response.json())
        .then(data => {
            addArticleToDOM(data); // Add the search result to the DOM
            isSearching = false;
        });
}

function addArticleToDOM(article) {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('bg-gray-800', 'shadow-lg', 'rounded-lg', 'overflow-hidden', 'p-4', 'text-white', 'transition-colors', 'duration-200', 'hover:bg-gray-700', 'cursor-pointer');
    let displayTitle = article.title.length > 100 ? article.title.substr(0, 30) + '...' : article.title;
    let displaySummary = article.summary.length > 300 ? article.summary.substr(0, 300) + '...' : article.summary;
    articleDiv.innerHTML = `
        <h2 class="text-xl font-bold mb-4">${displayTitle}</h2>
        <p class="text-gray-300">${displaySummary}</p>
        <a href="${article.url}" target="_blank" class="mt-2 text-indigo-500 hover:text-indigo-400">Read the full article</a>
    `;
    const articleLink = articleDiv.querySelector('a');
    articleLink.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    articleDiv.addEventListener('click', () => openModal(article.id));
    articleContainer.appendChild(articleDiv);
}

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.classList.add('hidden');
    }
});

function openModal(articleId) {
    fetch(`/articles/${articleId}`)
        .then(response => response.json())
        .then(article => {
            modalTitle.textContent = article.title;
            modalSummary.innerHTML = `
                <p>${article.summary.replace(/\n/g, '<br>')}</p>
                <a href="${article.url}" target="_blank" class="mt-2 text-indigo-500 hover:text-indigo-400">Read the full article</a>
            `;
            modal.classList.remove('hidden');
        });
}



modalClose.addEventListener('click', () => {
    closeModal();
});

modalBackdrop.addEventListener('click', (event) => {
    if (event.target === modalBackdrop) {
        closeModal();
    }
});

// ...

function closeModal() {
    modal.classList.add('hidden');
}

// ...