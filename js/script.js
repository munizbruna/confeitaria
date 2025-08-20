document.addEventListener('DOMContentLoaded', () => {
    const RECIPE_PAGE_URL = 'receita.html';
    const CATEGORY_PAGE_URL = 'categoria.html'; // Nova página de categoria

    const dropdown = document.getElementById('recipes-dropdown');
    const popularGrid = document.getElementById('popular-recipes-grid');
    const categoriesGrid = document.getElementById('categories-grid');

    async function loadRecipes() {
        try {
            const response = await fetch('..\json\receitas.json');
            if (!response.ok) {
                throw new Error('Falha ao carregar o arquivo receitas.json');
            }
            const recipes = await response.json();

            populateDropdown(recipes);
            populatePopularRecipes(recipes);
            populateCategories(recipes);

        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
            popularGrid.innerHTML = '<p class="text-center col-span-full text-red-400">Não foi possível carregar as receitas.</p>';
            categoriesGrid.innerHTML = '<p class="text-center col-span-full text-red-400">Não foi possível carregar as categorias.</p>';
        }
    }

    function populateDropdown(recipes) {
        for (const key in recipes) {
            const recipe = recipes[key];
            const option = document.createElement('option');
            option.value = key;
            option.textContent = recipe.name;
            dropdown.appendChild(option);
        }

        dropdown.addEventListener('change', (event) => {
            const selectedKey = event.target.value;
            if (selectedKey) {
                window.location.href = `${RECIPE_PAGE_URL}?recipe=${selectedKey}`;
            }
        });
    }

    function populatePopularRecipes(recipes) {
        popularGrid.innerHTML = ''; 
        const recipeKeys = Object.keys(recipes);

        for (let i = recipeKeys.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [recipeKeys[i], recipeKeys[j]] = [recipeKeys[j], recipeKeys[i]];
        }

        const popularKeys = recipeKeys.slice(0, 4);

        if (popularKeys.length === 0) {
            popularGrid.innerHTML = '<p class="text-center col-span-full">Nenhuma receita popular encontrada.</p>';
            return;
        }

        popularKeys.forEach(key => {
            const recipe = recipes[key];
            const card = document.createElement('a');
            card.href = `${RECIPE_PAGE_URL}?recipe=${key}`;
            card.className = "block bg-[var(--color-accent)]/30 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300";
            
            card.innerHTML = `
                <img src="${recipe.image}" alt="Foto de ${recipe.name}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/D9A679/260B01?text=Imagem+Indisponível';">
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-white mb-2">${recipe.name}</h3>
                    <div class="flex items-center text-sm text-[var(--color-background-soft)]">
                        <i data-lucide="tag" class="w-4 h-4 mr-2 text-[var(--color-primary)]"></i>
                        <span>${recipe.category}</span>
                    </div>
                </div>
            `;
            popularGrid.appendChild(card);
        });
    }

    function populateCategories(recipes) {
        categoriesGrid.innerHTML = '';
        const categories = new Set();
        for (const key in recipes) {
            categories.add(recipes[key].category);
        }

        if (categories.size === 0) {
            categoriesGrid.innerHTML = '<p class="text-center col-span-full">Nenhuma categoria encontrada.</p>';
            return;
        }
        
        const sortedCategories = Array.from(categories).sort();

        const categoryIcons = {
            'Bolos': 'cake-slice',
            'Bombons e Trufas': 'gem',
            'Biscoitos e Petit Fours': 'cookie',
            'Caldas e Coberturas': 'blinds',
            'Cremes e Recheios': 'paintbrush',
            'Doces Tradicionais': 'candlestick-chart',
            'Massas Base': 'egg',
            'Montagem e Decoração': 'paintbrush',
            'Preparações Base': 'chef-hat',
            'Pudins e Flans': 'circle-dot',
            'Pães e Massas Doces': 'croissant',
            'Salgados': 'pizza',
            'Sobremesas Geladas': 'snowflake',
            'Tortas': 'pie-chart',
            'default': 'utensils-crossed'
        };

        sortedCategories.forEach(category => {
            const iconName = categoryIcons[category] || categoryIcons['default'];
            const card = document.createElement('a');
            card.href = `${CATEGORY_PAGE_URL}?category=${encodeURIComponent(category)}`;
            card.className = "block bg-[var(--color-accent)]/60 p-6 rounded-xl text-center shadow-md transform hover:shadow-xl hover:bg-[var(--color-primary-dark)] hover:scale-105 transition-all duration-300";
            card.innerHTML = `
                <i data-lucide="${iconName}" class="w-12 h-12 mx-auto text-[var(--color-primary)] mb-4"></i>
                <h3 class="font-semibold text-lg text-white">${category}</h3>
            `;
            categoriesGrid.appendChild(card);
        });
    }

    loadRecipes().then(() => {
        lucide.createIcons();
    });
});


/* Enviar Receita */

document.addEventListener("DOMContentLoaded", () => {
    const recipeForm = document.getElementById("recipe-form");
    const recipeNameInput = document.getElementById("recipe-name");
    const recipeCategorySelect = document.getElementById("recipe-category");
    const recipeImageInput = document.getElementById("recipe-image");
    const recipeDescriptionTextarea =
      document.getElementById("recipe-description");
    const ingredientsContainer = document.getElementById(
      "ingredients-container"
    );
    const addIngredientBtn = document.getElementById("add-ingredient-btn");
    const methodContainer = document.getElementById("method-container");
    const addMethodBtn = document.getElementById("add-method-btn");
    const jsonOutputTextarea = document.getElementById("json-output");
    const resultArea = document.getElementById("result-area");

    // Categorias existentes baseadas em receitas.json
    const categories = [
      "Pudins e Flans",
      "Bolos",
      "Tortas",
      "Doces Tradicionais",
      "Biscoitos e Petit Fours",
      "Salgados",
      "Pães e Massas Doces",
      "Bombons e Trufas",
      "Massas Base",
      "Sobremesas Geladas",
      "Cremes e Recheios",
      "Caldas e Coberturas",
      "Montagem e Decoração",
      "Preparações Base",
    ];

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      recipeCategorySelect.appendChild(option);
    });

    addIngredientBtn.addEventListener("click", () => {
      const newIngredient = document.createElement("div");
      newIngredient.className = "flex space-x-4";
      newIngredient.innerHTML = `
                <div class="w-2/3">
                    <label class="form-label">Nome do Ingrediente</label>
                    <input type="text" class="ingredient-name form-input" placeholder="Nome do Ingrediente">
                </div>
                <div class="w-1/3">
                    <label class="form-label">Porcentagem (%)</label>
                    <input type="number" step="0.1" class="ingredient-percentage form-input" placeholder="0.0">
                </div>
            `;
      ingredientsContainer.appendChild(newIngredient);
    });

    addMethodBtn.addEventListener("click", () => {
      const newStep = document.createElement("div");
      const stepCount = methodContainer.children.length + 1;
      newStep.innerHTML = `
                <div>
                    <label class="form-label">Passo ${stepCount}</label>
                    <textarea class="method-step form-input" rows="2"></textarea>
                </div>
            `;
      methodContainer.appendChild(newStep);
    });

    recipeForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const recipeName = recipeNameInput.value.trim();
      const recipeKey = recipeName
        .toLowerCase()
        .replace(/ç/g, "c")
        .replace(/ã/g, "a")
        .replace(/õ/g, "o")
        .replace(/\s+/g, "_");
      const category = recipeCategorySelect.value;
      const image = recipeImageInput.value.trim();
      const description = recipeDescriptionTextarea.value.trim();

      const ingredients = [];
      let totalPercentage = 0;
      const ingredientInputs =
        ingredientsContainer.querySelectorAll(".ingredient-name");
      ingredientInputs.forEach((input) => {
        const name = input.value.trim();
        const percentage =
          input.parentElement.nextElementSibling.querySelector(
            "input"
          ).value;
        if (name && percentage) {
          const parsedPercentage = parseFloat(percentage.replace(",", "."));
          ingredients.push({
            name: name,
            percentage: parsedPercentage.toFixed(1),
          });
          totalPercentage += parsedPercentage;
        }
      });

      const methods = [];
      const methodInputs = methodContainer.querySelectorAll(".method-step");
      methodInputs.forEach((input) => {
        const step = input.value.trim();
        if (step) {
          methods.push(step);
        }
      });

      // Validação
      if (totalPercentage > 100.1 || totalPercentage < 99.9) {
        alert(
          "A soma das porcentagens dos ingredientes deve ser aproximadamente 100%. A soma atual é " +
            totalPercentage.toFixed(1) +
            "%."
        );
        return;
      }

      if (ingredients.length === 0 || methods.length === 0) {
        alert(
          "Por favor, adicione pelo menos um ingrediente e um passo do modo de preparo."
        );
        return;
      }

      const newRecipe = {
        [recipeKey]: {
          name: recipeName,
          category: category,
          icon: "fa-solid fa-utensils",
          image:
            image ||
            "https://placehold.co/600x400/D9A679/260B01?text=Imagem+Indisponível",
          description: description,
          ingredients: ingredients.map((ing) => ({
            name: ing.name,
            percentage: String(ing.percentage).replace(".", ","),
          })),
          method: methods,
        },
      };

      jsonOutputTextarea.value = JSON.stringify(newRecipe, null, 4);
      resultArea.classList.remove("hidden");
      jsonOutputTextarea.select();
      alert(
        "Receita gerada! Copie o JSON e adicione-o ao seu arquivo receitas.json."
      );
    });

    lucide.createIcons();
  });