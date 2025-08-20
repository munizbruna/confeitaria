// Este script cria e insere componentes reutilizáveis e gere o seletor de tema.

// HTML do Cabeçalho com o novo botão de tema
const headerHTML = `
<nav class="container mx-auto px-6 py-4 flex justify-between items-center">
    <div class="text-2xl font-bold text-[var(--primary-accent)]">
        <a href="index.html">Fouet de Casa</a>
    </div>
    <div class="hidden md:flex space-x-6 items-center">
        <a href="index.html#populares" class="text-[var(--text-color)] hover:text-[var(--primary-accent)]">Populares</a>
        <a href="index.html#categorias" class="text-[var(--text-color)] hover:text-[var(--primary-accent)]">Categorias</a>
        <a href="enviar.html" class="bg-[var(--primary-accent)] text-white px-4 py-2 rounded-full hover:bg-[var(--secondary-accent)] transition-colors">Enviar Receita</a>
        
        <!-- Botão para alternar o tema -->
        <button id="theme-toggle-btn" class="text-[var(--primary-accent)] hover:text-[var(--secondary-accent)]">
            <i id="theme-icon" data-lucide="sun"></i>
        </button>
    </div>
    <div class="md:hidden">
        <button class="text-[var(--text-color)] hover:text-[var(--primary-accent)]">
            <i data-lucide="menu"></i>
        </button>
    </div>
</nav>
`;

// HTML do Rodapé
const footerHTML = `
<div class="container mx-auto px-6 py-8 text-center">
    <p>&copy; 2024 Fouet de Casa. Todos os direitos reservados.</p>
</div>
`;

/**
 * Configura o seletor de tema, aplicando o tema guardado e adicionando o evento de clique.
 */
function setupThemeSwitcher() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Função para aplicar o tema e atualizar o ícone
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            themeIcon.setAttribute('data-lucide', 'moon');
        } else {
            body.classList.remove('light-theme');
            themeIcon.setAttribute('data-lucide', 'sun');
        }
        lucide.createIcons(); // Recria o ícone para refletir a mudança
    };

    // Verifica o tema guardado no localStorage ao carregar a página
    const currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);

    // Adiciona o evento de clique ao botão
    themeToggleButton.addEventListener('click', () => {
        const isLightTheme = body.classList.contains('light-theme');
        const newTheme = isLightTheme ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}


// Adiciona um evento que será disparado quando o conteúdo do HTML for carregado.
document.addEventListener('DOMContentLoaded', function() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    }
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }

    // Após inserir os componentes, configura o seletor de tema e os ícones.
    setupThemeSwitcher();
    lucide.createIcons();
});
