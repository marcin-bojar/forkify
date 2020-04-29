import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchPages.innerHTML = '';
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    if( title.length > limit ) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length < limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0)
        
        return newTitle.join(' ') + ' ...';
    }

    return title;
};

export const highlightSelected = id => {
    const resArr = Array.from(document.querySelectorAll('.results__link'));
    resArr.forEach(el => el.classList.remove('results__link--active'));

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

// type = 'prev' or 'next'
const createButton = (page, type) => 
     `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'next' ? page+1 : page-1}>
        <span>Page ${type === 'next' ? page+1 : page-1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
        </svg>
    </button>
`;    

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    
    let button;
    if (page === 1 && pages > 1) {
        //Display only 'next' button
        button = createButton(page, 'next');

    } else if (page < pages) {
        //Display both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
            `;

    } else if (page === pages && pages > 1) {
        //Display only 'prev' button
        button = createButton(page, 'prev');
    }

    elements.searchPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResList = (recipes, page = 1, resPerPage = 10 ) => {
    //Display results' list
    const start = (page - 1) * resPerPage; 
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //Display pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};