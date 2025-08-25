// Este script controla a funcionalidade da página de visualização de uma receita (receita.html)

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM para cálculo e exibição da receita
    const totalWeightInput = document.getElementById('total-weight');
    const itemCountInput = document.getElementById('item-count');
    const itemWeightInput = document.getElementById('item-weight');
    const ingredientsTableBody = document.getElementById('ingredients-table');
    const totalWeightDisplay = document.getElementById('total-weight-display');
    const recipeNameH1 = document.getElementById('recipe-name');
    const recipeImageParallaxEl = document.getElementById('recipe-image-parallax');
    const recipeDescriptionEl = document.getElementById('recipe-description');
    const observacoesSection = document.getElementById('observacoes');

    /**
     * Popula a página com os dados de uma receita específica.
     * @param {object} recipeData - O objeto da receita a ser exibida.
     */
    function populateRecipeData(recipeData) {
        if (!recipeData) {
            recipeNameH1.textContent = "Receita não encontrada!";
            return;
        }

        recipeNameH1.textContent = recipeData.name;
        document.title = `Receita de ${recipeData.name} - Confeitaria Criativa`;
        
        // Define a imagem de fundo para o efeito parallax
        recipeImageParallaxEl.style.backgroundImage = `url('${recipeData.image}')`;

        // Mostra a seção de observações apenas se houver descrição
        if (recipeData.description) {
            recipeDescriptionEl.textContent = recipeData.description;
            observacoesSection.classList.remove('hidden');
        }

        // Popula a tabela de ingredientes
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

        // Popula a lista do modo de preparo
        const methodList = document.getElementById('method-list');
        methodList.innerHTML = '';
        recipeData.method.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            methodList.appendChild(li);
        });
    }

    /**
     * Atualiza os pesos dos ingredientes com base no peso total calculado.
     * @param {number} totalWeightGrams - O peso total da receita em gramas.
     */
    function updateIngredientWeights(totalWeightGrams) {
        const weightCells = ingredientsTableBody.querySelectorAll('[data-percentage]');
        let calculatedTotalWeight = 0;
        weightCells.forEach(cell => {
            const percentage = parseFloat(cell.dataset.percentage);
            if (!isNaN(percentage)) {
                const weight = (totalWeightGrams * percentage) / 100;
                calculatedTotalWeight += weight;
                cell.textContent = `${weight.toFixed(1).replace('.', ',')} g`;
            }
        });
        totalWeightDisplay.textContent = `${calculatedTotalWeight.toFixed(1).replace('.', ',')} g`;
    }

    /**
     * Gerencia a lógica dos inputs de cálculo, desabilitando campos conforme o uso.
     */
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
    
    /**
     * Função principal que inicializa a página.
     */
    async function initializePage() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const recipeKey = urlParams.get('recipe');
            if (!recipeKey) throw new Error("Nenhuma receita especificada na URL.");

            // CORREÇÃO: O caminho para o JSON foi ajustado.
            const response = await fetch('https://apiconfeitaria.azurewebsites.net/index.html');
            if (!response.ok) throw new Error('Não foi possível carregar o arquivo de receitas.');
            
            const allRecipes = await response.json();
            const currentRecipe = allRecipes[recipeKey];
            populateRecipeData(currentRecipe);

        } catch (error) {
            console.error("Erro ao inicializar a página:", error);
            recipeNameH1.textContent = "Erro ao carregar receita.";
        }
    }

    // Adiciona os event listeners aos inputs de cálculo
    [totalWeightInput, itemCountInput, itemWeightInput].forEach(input => {
        input.addEventListener('input', handleInputLogic);
    });

    // Inicia a página e depois renderiza os ícones
    initializePage().then(() => {
        lucide.createIcons();
    });
});
