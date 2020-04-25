import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import * as searchView from './views/searchView';

/* Global app state

- Search object
- Current recipe object
- Shopping list object
- Liked recipes 

*/

const state = {};

const controlSearch = async () => {
    // 1. Get query from search input
    const query = searchView.getInput();
    
    if(query) {
        // 2. Create Search object
         state.search = new Search(query);
    }

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResList);

    // 4. Get results
    await state.search.getResults();

    // 5. Display results in UI
    clearLoader();
    searchView.renderResList(state.search.result);
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
}); 

elements.searchPages.addEventListener('click', e => {
    const goToPage = parseInt(e.target.closest('.btn-inline').dataset.goto);
    searchView.clearResults();
    searchView.renderResList(state.search.result, goToPage);
});

