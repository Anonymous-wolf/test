const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path'); 
const app = express();
const port = 4000;

const app_id = 'ef86a019'; 
const app_key = 'c70fa45d94af992121cd364bbe358bb3'; 

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/recipeFinder')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


app.use(express.static(path.join(__dirname)));


const recipeSchema = new mongoose.Schema({
    label: String,
    image: String,
    url: String,
    calories: Number,
    ingredients: [String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

app.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        const response = await axios.get(`https://api.edamam.com/search?q=${query}&app_id=${app_id}&app_key=${app_key}`);

        // Save each recipe to the database
        const recipes = response.data.hits.map(hit => {
            const recipe = new Recipe({
                label: hit.recipe.label,
                image: hit.recipe.image,
                url: hit.recipe.url,
                calories: hit.recipe.calories,
                ingredients: hit.recipe.ingredientLines
            });
            recipe.save(); // Save to MongoDB
            return recipe;
        });

        res.json({ recipes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/recipe/:id', (req, res) => {
    const id = req.params.id;
    const recipeUrl = `https://www.edamam.com/recipe/${id}`;
    res.redirect(recipeUrl);
});

app.get('/saved-recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Retrieve all recipes from MongoDB
        res.json({ recipes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
