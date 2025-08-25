// Este script controla a funcionalidade da página de envio de receitas (enviar.html)

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const form = document.getElementById('recipe-form');
    const recipeCategorySelect = document.getElementById('recipe-category');
    const ingredientsContainer = document.getElementById('ingredients-container');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const methodContainer = document.getElementById('method-container');
    const addMethodBtn = document.getElementById('add-method-btn');
    const resultArea = document.getElementById('result-area');
    const jsonOutput = document.getElementById('json-output');

    // --- CARREGAR CATEGORIAS ---

    /**
     * Carrega as categorias existentes do arquivo JSON e as popula no dropdown.
     */
    async function loadCategories() {
        try {
            const response = await fetch('https://apiconfeitaria.azurewebsites.net/index.html');
            if (!response.ok) {
                throw new Error('Falha ao carregar o arquivo de receitas para popular as categorias.');
            }
            const recipes = await response.json();
            const categories = new Set();
            for (const key in recipes) {
                categories.add(recipes[key].category);
            }
            const sortedCategories = Array.from(categories).sort();
            sortedCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                recipeCategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            const option = document.createElement('option');
            option.textContent = "Não foi possível carregar as categorias";
            option.disabled = true;
            recipeCategorySelect.appendChild(option);
        }
    }

    // --- FUNÇÕES DE ADIÇÃO DINÂMICA ---

    /**
     * Adiciona um novo par de campos para nome e porcentagem do ingrediente.
     */
    function addIngredientField() {
        const newField = document.createElement('div');
        newField.className = 'flex space-x-4';
        newField.innerHTML = `
            <div class="w-2/3">
                <input type="text" class="ingredient-name form-input" placeholder="Leite condensado" />
            </div>
            <div class="w-1/3">
                <input type="number" step="0.1" class="ingredient-percentage form-input" placeholder="40.5" />
            </div>
        `;
        ingredientsContainer.appendChild(newField);
    }

    /**
     * Adiciona um novo campo de texto para um passo do modo de preparo.
     */
    function addMethodStep() {
        const stepCount = methodContainer.children.length + 1;
        const newStep = document.createElement('div');
        newStep.innerHTML = `
            <label class="form-label">Passo ${stepCount}</label>
            <textarea class="method-step form-input" rows="2"></textarea>
        `;
        methodContainer.appendChild(newStep);
    }

    // --- LÓGICA DO FORMULÁRIO ---

    /**
     * Lida com o envio do formulário, gera e exibe o JSON.
     * @param {Event} event - O evento de submissão do formulário.
     */
    function handleFormSubmit(event) {
        event.preventDefault(); // Impede o recarregamento da página

        // 1. Coletar informações básicas
        const recipeName = document.getElementById('recipe-name').value;
        const recipeCategory = recipeCategorySelect.value;
        const recipeImage = document.getElementById('recipe-image').value;
        const recipeDescription = document.getElementById('recipe-description').value;

        // 2. Coletar ingredientes
        const ingredients = [];
        const ingredientNameInputs = document.querySelectorAll('.ingredient-name');
        const ingredientPercentageInputs = document.querySelectorAll('.ingredient-percentage');
        ingredientNameInputs.forEach((input, index) => {
            const name = input.value.trim();
            const percentage = ingredientPercentageInputs[index].value.trim();
            if (name && percentage) {
                ingredients.push({
                    name: name,
                    percentage: percentage
                });
            }
        });

        // 3. Coletar modo de preparo
        const method = [];
        const methodStepTextareas = document.querySelectorAll('.method-step');
        methodStepTextareas.forEach(textarea => {
            const step = textarea.value.trim();
            if (step) {
                method.push(step);
            }
        });

        // 4. Montar o objeto da receita
        const recipeObject = {
            name: recipeName,
            category: recipeCategory,
            image: recipeImage,
            description: recipeDescription,
            ingredients: ingredients,
            method: method
        };

        // 5. Gerar a chave da receita (ex: "Bolo de Fubá" -> "bolo_de_fuba")
        const recipeKey = recipeName.toLowerCase()
                                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
                                .replace(/\s+/g, '_') // Substitui espaços por underscores
                                .replace(/[^\w-]+/g, ''); // Remove caracteres não alfanuméricos

        // 6. Montar o JSON final no formato para adicionar ao arquivo
        const finalJson = {
            [recipeKey]: recipeObject
        };

        // 7. Exibir o resultado
        // O `null, 4` formata o JSON para ser mais legível
        jsonOutput.value = JSON.stringify(finalJson, null, 4);
        resultArea.classList.remove('hidden');
    }

    // --- EVENT LISTENERS ---
    addIngredientBtn.addEventListener('click', addIngredientField);
    addMethodBtn.addEventListener('click', addMethodStep);
    form.addEventListener('submit', handleFormSubmit);

    // --- INICIALIZAÇÃO ---
    loadCategories();
});