// Este script controla a funcionalidade da página inicial (index.html)
const API_ENDPOINT = 'https://apiconfeitaria.azurewebsites.net/api';

document.addEventListener('DOMContentLoaded', () => {
    // Constantes para as URLs das outras páginas, facilitando a manutenção
    const RECIPE_PAGE_URL = 'receita.html';
    const CATEGORY_PAGE_URL = 'categoria.html';

    // Elementos do DOM que serão manipulados
    const dropdown = document.getElementById('recipes-dropdown');
    const popularGrid = document.getElementById('popular-recipes-grid');
    const categoriesGrid = document.getElementById('categories-grid');

    /**
     * Carrega as receitas do arquivo JSON e chama as funções para popular a página.
     */
    async function loadRecipes() {
        try {
            // CORREÇÃO: O caminho para o JSON foi ajustado para a estrutura de pastas correta.
            const response = await fetch(`${API_ENDPOINT}/Recipes`);
                
            if (!response.ok) {
                throw new Error('Falha ao carregar a API');
            }
            const recipes = await response.json();

            // Popula os diferentes componentes da página com os dados das receitas
            populateDropdown(recipes);
            //populatePopularRecipes(recipes);

        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
            popularGrid.innerHTML = '<p class="text-center col-span-full text-red-400">Não foi possível carregar as receitas.</p>';
            categoriesGrid.innerHTML = '<p class="text-center col-span-full text-red-400">Não foi possível carregar as categorias.</p>';
        }
    }
    async function loadCategories() {
        try {
            // CORREÇÃO: O caminho para o JSON foi ajustado para a estrutura de pastas correta.
            const response = await fetch(`${API_ENDPOINT}/Categories`);
            if (!response.ok) {
                throw new Error('Falha ao carregar a API');
            }
            const categories = await response.json();

            // Popula os diferentes componentes da página com os dados das receitas
            
            populateCategories(categories);

        } catch (error) {
            console.error('Erro ao carregar receitas:', error);
            popularGrid.innerHTML = '<p class="text-center col-span-full text-red-400">Não foi possível carregar as receitas.</p>';
            categoriesGrid.innerHTML = '<p class="text-center col-span-full text-red-400">Não foi possível carregar as categorias.</p>';
        }
    }
    

    /**
     * Popula o menu dropdown com todas as receitas.
     * @param {object} recipes - O objeto contendo todas as receitas.
     */
    function populateDropdown(recipes) {

        for (const key in recipes) {
            const recipe = recipes[key];
            const option = document.createElement('option');
            option.value = recipe.id;
            option.textContent = recipe.name;
            dropdown.appendChild(option);
        }

        // Adiciona um evento que redireciona o usuário ao selecionar uma receita
        dropdown.addEventListener('change', (event) => {
            const selectedKey = event.target.value;
            if (selectedKey) {
                window.location.href = `${RECIPE_PAGE_URL}?recipe=${selectedKey}`;
            }
        });
    }

    /**
     * Seleciona 4 receitas aleatórias e as exibe na seção "Populares".
     * @param {object} recipes - O objeto contendo todas as receitas.
     */
    function populatePopularRecipes(recipes) {

        popularGrid.innerHTML = ''; 
        const recipeKeys = Object.keys(recipes);

        console.log("===========teste RECEITAS");
        console.log(recipeKeys);

        // Embaralha as chaves das receitas para pegar 4 aleatórias
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
            card.href = `${RECIPE_PAGE_URL}?recipe=${recipe.id}`;
            card.className = "block bg-[var(--color-accent)]/30 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300";
            
            card.innerHTML = `
                <img src="${recipe.image}" alt="Foto de ${recipe.name}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/D9A679/260B01?text=Imagem+Indisponível';">
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-[var(--color-subtitle)] mb-2">${recipe.name}</h3>
                    <div class="flex items-center text-sm">
                        <span>${recipe.category}</span>
                    </div>
                </div>
            `;
            popularGrid.appendChild(card);
        });

    }

    /**
     * Extrai todas as categorias únicas das receitas e as exibe na seção "Categorias".
     * @param {object} recipes - O objeto contendo todas as receitas.
     */
    function populateCategories(lista) {
        categoriesGrid.innerHTML = '';
        const categories = new Set();
        for (const key in lista) {
            categories.add(lista[key].name);
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
            card.className = "card block bg-[var(--color-accent)]/60 p-6 rounded-xl text-center shadow-md transform hover:shadow-xl hover:bg-[var(--color-primary-dark)] hover:scale-105 transition-all duration-300";
            card.innerHTML = `
                <i data-lucide="${iconName}" class="w-12 h-12 mx-auto text-[var(--color-primary)] mb-4"></i>
                <h3 class="font-semibold text-lg text-[var(--color-subtitle)]">${category}</h3>
            `;
            categoriesGrid.appendChild(card);
        });
    }

    // Inicia o carregamento das receitas e depois renderiza os ícones.
    loadRecipes();
    loadCategories().then(() => {
         lucide.createIcons();
        });
    // loadRecipes() || loadCategories().then(() => {
        // lucide.createIcons();
    // });
});
