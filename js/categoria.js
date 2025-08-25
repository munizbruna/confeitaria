// Este script controla a funcionalidade da página de categorias (categoria.html)
const API_ENDPOINT = 'https://apiconfeitaria.azurewebsites.net/api';
document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM que serão manipulados
    const categoryNameEl = document.getElementById('category-name');
    const categoryDescriptionEl = document.getElementById('category-description');
    const recipesGridEl = document.getElementById('recipes-grid');

    // Objeto com descrições para cada categoria
    const categoryDescriptions = {
        'Bolos': 'Deliciosos bolos para todas as ocasiões, desde os mais simples até os mais elaborados.',
        'Pudins e Flans': 'Sobremesas cremosas e irresistíveis que derretem na boca.',
        'Tortas': 'Tortas doces incríveis, com massas crocantes e recheios variados.',
        'Doces Tradicionais': 'Os clássicos da confeitaria que trazem memórias afetivas e muito sabor.',
        'Biscoitos e Petit Fours': 'Pequenas delícias para acompanhar um café ou para presentear.',
        'Salgados': 'Opções deliciosas para festas, lanches ou qualquer momento.',
        'Pães e Massas Doces': 'Receitas fofinhas e saborosas para o café da manhã ou da tarde.',
        'Bombons e Trufas': 'Pequenos tesouros de chocolate com recheios surpreendentes.',
        'Massas Base': 'As receitas fundamentais para você começar a criar suas próprias sobremesas.',
        'Sobremesas Geladas': 'Refrescantes e saborosas, perfeitas para os dias mais quentes.',
        'Cremes e Recheios': 'A base para rechear e cobrir bolos, tortas e outros doces.',
        'Caldas e Coberturas': 'O toque final que transforma qualquer sobremesa em uma obra de arte.',
        'Montagem e Decoração': 'Inspire-se com técnicas e ideias para decorar suas criações.',
        'Preparações Base': 'Receitas essenciais que servem de ponto de partida para muitas outras.',
        'default': 'Descubra as melhores receitas desta categoria.'
    };

    /**
     * Carrega as receitas do JSON, filtra pela categoria da URL e as renderiza na página.
     */
    async function loadCategoryRecipes() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');

            if (!category) {
                categoryNameEl.textContent = 'Categoria não encontrada';
                recipesGridEl.innerHTML = '<p class="text-center col-span-full">Por favor, selecione uma categoria na página inicial.</p>';
                return;
            }

            // Decodifica o nome da categoria para lidar com caracteres como '%20' para espaços
            const decodedCategory = decodeURIComponent(category);

            document.title = `${decodedCategory} - Confeitaria Criativa`;
            categoryNameEl.textContent = decodedCategory;
            categoryDescriptionEl.textContent = categoryDescriptions[decodedCategory] || categoryDescriptions['default'];

            // CORREÇÃO: O caminho para o JSON foi ajustado.
            const response = await fetch(`${API_ENDPOINT}/Recipes/bycategory/${decodedCategory}`);

            if (!response.ok) {
                throw new Error('Falha ao carregar o arquivo de receitas.');
            }
            const allRecipes = await response.json();

            // Filtra as receitas para mostrar apenas as da categoria selecionada
            const filteredRecipes = Object.entries(allRecipes);

            renderRecipes(filteredRecipes);

        } catch (error) {
            console.error('Erro ao carregar receitas da categoria:', error);
            recipesGridEl.innerHTML = '<p class="text-center col-span-full text-red-400">Não foi possível carregar as receitas.</p>';
        }
    }

    /**
     * Renderiza os cards das receitas na grade.
     * @param {Array} recipes - Um array de receitas filtradas.
     */
    function renderRecipes(recipes) {
        recipesGridEl.innerHTML = '';

        if (recipes.length === 0) {
            recipesGridEl.innerHTML = '<p class="text-center col-span-full">Nenhuma receita encontrada nesta categoria.</p>';
            return;
        }

        recipes.forEach(([id, recipe]) => {
            const card = document.createElement('a');
            card.href = `receita.html?recipe=${recipe.id}`;
            card.className = "block bg-[var(--color-accent)]/30 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300";
            
            // Usa a imagem da receita; se não houver, usa um placeholder.
            const imageUrl = recipe.image || `https://placehold.co/600x400/${'D9A679'}/${'260B01'}?text=${encodeURIComponent(recipe.name)}`;

            card.innerHTML = `
                <img src="${imageUrl}" alt="Foto de ${recipe.name}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/600x400/D9A679/260B01?text=Imagem+Indisponível';">
                <div class="p-6">
                    <h3 class="text-2xl font-bold text-[var(--color-title)] mb-2">${recipe.name}</h3>
                </div>
            `;
            recipesGridEl.appendChild(card);
        });
    }

    // Inicia o carregamento e depois renderiza os ícones
    loadCategoryRecipes().then(() => {
        lucide.createIcons();
    });
});
