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
    const submitButton = document.getElementById('submit-button');


    // !!! IMPORTANTE !!!
    // Este é o endereço da sua API. A URL que você forneceu parece ser a da documentação.
    // Você provavelmente precisará alterar o final desta URL para o endpoint correto.
    // Ex: 'https://apiconfeitaria.azurewebsites.net/api/receitas'
    const API_ENDPOINT = 'https://localhost:7077/api/';


    // --- CARREGAR CATEGORIAS ---

    /**
     * Carrega as categorias existentes do arquivo JSON e as popula no dropdown.
     */
    async function loadCategories() {
        try {
            const response = await fetch(`${API_ENDPOINT}/Categories`);
            if (!response.ok) {
                throw new Error('Falha ao carregar o arquivo de receitas para popular as categorias.');
            }
            const recipes = await response.json();

            const categories = new Set();
            for (const key in recipes) {
                categories.add(
                    {
                        id: recipes[key].id,
                        name: recipes[key].name
                    }
                );
            }
            const sortedCategories = Array.from(categories).sort();


            sortedCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
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
     * Lida com o envio do formulário, envia os dados para a API e exibe o feedback.
     * @param {Event} event - O evento de submissão do formulário.
     */
    async function handleFormSubmit(event) {
        event.preventDefault(); // Impede o recarregamento da página
        //submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        resultArea.classList.remove('hidden');
        jsonOutput.value = '';

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
            const percentage = ingredientPercentageInputs[index].value.trim().replace(',', '.'); // Garante que a porcentagem use ponto
            if (name && percentage) {
                ingredients.push({
                    name: name,
                    percentage: parseFloat(percentage) // Envia como número
                });
            }
        });

        // 3. Coletar modo de preparo
        const method = [];
        let order = 0;
        const methodStepTextareas = document.querySelectorAll('.method-step');
        methodStepTextareas.forEach(textarea => {
            const step = textarea.value.trim();
            if (step) {
                method.push({
                    step: step,
                    order: order++
                });
            }
        });

        // 4. Montar o objeto da receita para enviar à API
        const recipePayload = {
            name: recipeName,
            categoryId: recipeCategory,
            image: recipeImage,
            icon: 'recipeIcon',
            description: recipeDescription,
            ingredients: ingredients,
            method: method
        };


        // 5. Enviar para a API
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipePayload),
            });

            if (!response.ok) {
                // Se a resposta não for bem-sucedida (ex: erro 400, 500), lança um erro
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            // Sucesso!
            jsonOutput.value = `Receita "${result.name}" cadastrada com sucesso!\nID: ${result.id}`;
            form.reset(); // Limpa o formulário

        } catch (error) {
            // Falha
            console.error('Falha ao enviar receita:', error);
            jsonOutput.value = `Ocorreu um erro:\n${error.message}\n\nVerifique o console (F12) para mais detalhes.`;
        } finally {
            // Reabilita o botão, independentemente do resultado
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Receita';
        }
    }

    // --- EVENT LISTENERS ---
    addIngredientBtn.addEventListener('click', addIngredientField);
    addMethodBtn.addEventListener('click', addMethodStep);
    form.addEventListener('submit', handleFormSubmit);

    // --- INICIALIZAÇÃO ---
    loadCategories();
});