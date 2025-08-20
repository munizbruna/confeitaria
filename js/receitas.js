document.addEventListener('DOMContentLoaded', () => {
    const totalWeightInput = document.getElementById('total-weight');
    const itemCountInput = document.getElementById('item-count');
    const itemWeightInput = document.getElementById('item-weight');
    const ingredientsTableBody = document.getElementById('ingredients-table');
    const totalWeightDisplay = document.getElementById('total-weight-display');
    const recipeNameH1 = document.getElementById('recipe-name');
    const recipeImageParallaxEl = document.getElementById('recipe-image-parallax');
    const recipeDescriptionEl = document.getElementById('recipe-description');
    const observacoesSection = document.getElementById('observacoes');

    function populateRecipeData(recipeData) {
        if (!recipeData) {
            recipeNameH1.textContent = "Receita não encontrada!";
            return;
        }

        recipeNameH1.textContent = recipeData.name;
        document.title = `Receita de ${recipeData.name} - Confeitaria Criativa`;
        
        recipeImageParallaxEl.style.backgroundImage = `url('${recipeData.image}')`;

        if (recipeData.description) {
            recipeDescriptionEl.textContent = recipeData.description;
            observacoesSection.classList.remove('hidden');
        }

        ingredientsTableBody.innerHTML = '';
        recipeData.ingredients.forEach(ing => {
            const row = document.createElement('tr');
            row.className = 'border-b border-[var(--color-primary-dark)]/50';
            row.innerHTML = `
                <td class="py-3 px-4">${ing.name}</td>
                <td class="text-center py-3 px-4">${ing.percentage}</td>
                <td class="text-center py-3 px-4 font-medium" data-percentage="${String(ing.percentage).replace(',', '.')}">0 g</td>
            `;
            ingredientsTableBody.appendChild(row);
        });

        const methodList = document.getElementById('method-list');
        methodList.innerHTML = '';
        recipeData.method.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            methodList.appendChild(li);
        });
    }

    function updateIngredientWeights(totalWeightGrams) {
        const weightCells = ingredientsTableBody.querySelectorAll('[data-percentage]');
        let calculatedTotalWeight = 0;
        weightCells.forEach(cell => {
            const percentage = parseFloat(cell.dataset.percentage);
            const weight = (totalWeightGrams * percentage) / 100;
            calculatedTotalWeight += weight;
            cell.textContent = `${weight.toFixed(1).replace('.', ',')} g`;
        });
        totalWeightDisplay.textContent = `${calculatedTotalWeight.toFixed(1).replace('.', ',')} g`;
    }

    function handleInputLogic() {
        const totalWeightValue = parseFloat(totalWeightInput.value);
        const itemCountValue = parseFloat(itemCountInput.value);
        const itemWeightValue = parseFloat(itemWeightInput.value);
        let finalTotalWeightGrams = 0;

        if (totalWeightInput.value) {
            itemCountInput.disabled = true;
            itemWeightInput.disabled = true;
            if (!isNaN(totalWeightValue)) finalTotalWeightGrams = totalWeightValue * 1000;
        } else if (itemCountInput.value || itemWeightInput.value) {
            totalWeightInput.disabled = true;
            if (!isNaN(itemCountValue) && !isNaN(itemWeightValue)) {
                finalTotalWeightGrams = itemCountValue * itemWeightValue;
            }
        } else {
            totalWeightInput.disabled = false;
            itemCountInput.disabled = false;
            itemWeightInput.disabled = false;
        }
        updateIngredientWeights(finalTotalWeightGrams);
    }
    
    async function initializePage() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const recipeKey = urlParams.get('recipe');
            if (!recipeKey) throw new Error("Nenhuma receita especificada na URL.");

            const response = await fetch('receitas.json');
            if (!response.ok) throw new Error('Não foi possível carregar o arquivo de receitas.');
            
            const allRecipes = await response.json();
            const currentRecipe = allRecipes[recipeKey];
            populateRecipeData(currentRecipe);

        } catch (error) {
            console.error("Erro ao inicializar a página:", error);
            recipeNameH1.textContent = "Erro ao carregar receita.";
        }
    }

    [totalWeightInput, itemCountInput, itemWeightInput].forEach(input => {
        input.addEventListener('input', handleInputLogic);
    });

    initializePage().then(() => {
        lucide.createIcons();
    });
});