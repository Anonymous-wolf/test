document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('query').value;
    fetch(`/search?query=${query}`)
        .then(response => response.json())
        .then(data => {
            const recipesContainer = document.getElementById('recipes');
            recipesContainer.innerHTML = '';
            data.recipes.forEach(recipe => {
                const recipeItem = document.createElement('div');
                recipeItem.classList.add('recipe-item');
                recipeItem.innerHTML = `
                    <img src="${recipe.image}" alt="${recipe.label}">
                    <h2>${recipe.label}</h2>
                    <p>Calories: ${Math.round(recipe.calories)}</p>
                    <a href="${recipe.url}" target="_blank">View Details</a>
                `;
                recipesContainer.appendChild(recipeItem);
            });
        })
        .catch(error => console.error('Error:', error));
});
