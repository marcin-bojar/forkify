import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(error) {
            alert(error);
        }
    }

    calcTime() {
        // Assuming that we need 15min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const longUnits = ['cups', 'tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'pounds', 'pound', 'ounces', 'ounce'];
        const shortUnits = ['cup', 'tbsp', 'tbsp', 'tsp', 'tsp', 'lb', 'lb', 'oz', 'oz'];
        const units = [...shortUnits, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => { 
            //1. Change units to short version
            let ingredient = el.toLowerCase();
            longUnits.forEach((unit, i) => {
               ingredient = ingredient.replace(unit, shortUnits[i]);
            });   

            //2. Delete text in parentheses
            ingredient = ingredient.replace(/ \([\s\S]*?\)/g, '');

            
            //3. Parse ingredient to count, unit and ingredient
            const ingArr = ingredient.split(' ');
          
                //check if there is a unit
            const unitIndex = ingArr.findIndex(el2 => units.includes(el2));
           
            let objIng;
            
            if( unitIndex > -1) {
                //There is a unit
                const countArr = ingArr.slice(0, unitIndex);
                let count;
                
                if (countArr.length === 1) {
                    count = eval(countArr[0].replace('-', '+'));
                } else {
                    count = eval(countArr.join('+'));
                }

                objIng = {
                    count,
                    unit: ingArr[unitIndex],
                    ingredient: ingArr.slice(unitIndex+1)
                };

            } else if( parseInt(ingArr[0]) ) {
                //There is no unit but there is a count
                objIng = {
                    count: parseInt(ingArr[0]),
                    unit: '',
                    ingredient: ingArr.slice(1).join(' ')
                };

            } else if (unitIndex === -1) {
                //there is no unit and count
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                };
            }
        
           return objIng;
        });

        this.ingredients = newIngredients;
    }

}