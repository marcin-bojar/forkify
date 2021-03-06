import { elements, renderLoader, clearLoader } from "./views/base";
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

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

  if (query) {
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
  } catch (error) {
    alert("Search failed. Try again");
    clearLoader();
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchPages.addEventListener("click", (e) => {
  const goToPage = parseInt(e.target.closest(".btn-inline").dataset.goto);
  searchView.clearResults();
  searchView.renderResList(state.search.result, goToPage);
});

/**** RECIPE CONTROLLER ****
 *****                 *****/

const controlRecipe = async () => {
  // Get the recipe ID from url
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI for recipe
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Create Recipe object
    state.recipe = new Recipe(id);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(state.recipe.id);

    try {
      // Get data from server and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //Calculate time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Display recipe in UI
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert("Error processing recipe. Try again.");
      console.log(error);
    }
  }
};

["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

//Handling recipe buttons
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    //Decrease servings amount
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIng(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    //Increase servings amount
    state.recipe.updateServings("inc");
    recipeView.updateServingsIng(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    //Add item to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    //Add recipe to like-list
    controlLikes();
  }
});

/**** LIST CONTROLLER ****
 *****                 *****/

const controlList = () => {
  //Create list object
  if (!state.list) state.list = new List();

  //Add items (ingredients) to list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    //Display item in UI
    listView.renderItem(item);
  });
};

//Handling shopping buttons
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    //Deleting item form UI list
    listView.deleteItem(id);

    //Removing item from state object
    state.list.removeItem(id);
  } else if (e.target.matches(".shopping__count-value")) {
    //Updating count values in list
    const val = parseFloat(e.target.value);
    state.list.updateCount(id, val);
  }
});

/**** LIKES CONTROLLER ****
 *****                 *****/

const controlLikes = () => {
  //Create likes object
  if (!state.likes) state.likes = new Likes();

  //Check if recipe is liked
  if (!state.likes.isLiked(state.recipe.id)) {
    //If recipe is not liked, add it to state object
    const newLike = state.likes.addLike(
      state.recipe.id,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Toggle the button
    likesView.toggleLikeBtn(true);

    // Add like item to UI
    likesView.renderLike(newLike);
  } else {
    //If recipe is liked, remove it from state object
    state.likes.removeLike(state.recipe.id);

    //Toggle the button
    likesView.toggleLikeBtn(false);

    // Remove like item from UI
    likesView.removeLike(state.recipe.id);
  }
  //Display or hide like menu icon (depending on whether there are or not menu items)
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener("load", () => {
  state.likes = new Likes();

  state.likes.readStorage();

  likesView.toggleLikeMenu(state.likes.getNumLikes());

  state.likes.likes.forEach((el) => {
    likesView.renderLike(el);
  });
});
