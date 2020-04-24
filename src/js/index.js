import Search from './models/Search';

/* Global app state

- Search object
- Current recipe object
- Shopping list object
- Liked recipes 

*/

const state = {};

const controlSearch = async () => {
    // 1. Get query from search input
    const query = 'pizza'  //Temporary value

    
    if(query) {
        // 2. Create Search object
         state.search = new Search(query);
    }

    // 3. Prepare UI for results


    // 4. Get results
    await state.search.getResults();

    // 5. Display results in UI
    console.log(state.search.result);
}

document.querySelector('.search').addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
}); 

