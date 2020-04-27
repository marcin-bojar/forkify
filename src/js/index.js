import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/* Global app state

- Search object
- Current recipe object
- Shopping list object
- Liked recipes 

*/

const state = {};


/**** SEARCH CONTROLLER ****
*****                 *****/

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
    try {
        // 4. Get results
        await state.search.getResults();
    
        // 5. Display results in UI
        clearLoader();
        searchView.renderResList(state.search.result);
    } catch(error) {
        alert('Search failed. Try again');
        clearLoader();
    }
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


/**** RECIPE CONTROLLER ****
*****                 *****/
const controlRecipe = async () => {

    // Get the recipe ID from url
    const id = window.location.hash.replace('#', '');

    if(id) {

        // Prepare UI for recipe
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Create Recipe object
        state.recipe = new Recipe(id);

        // Highlight selected search item
        if(state.search) 
        searchView.highlightSelected(state.recipe.id);
      
        try {   
            // Get data from server and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Display recipe in UI
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            
        } catch(error) {
            alert('Error processing recipe. Try again.')
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling servings changes 
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec'); 
            recipeView.updateServingsIng(state.recipe);
        }       
    }

    if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    }
    console.log(state.recipe);
});
