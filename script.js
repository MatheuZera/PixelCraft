// CONTROLE DO MENU RESPONSIVO MOBILE
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    const toggleIcon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('mobile-active');

        if (navLinks.classList.contains('mobile-active')) {
            toggleIcon.className = 'fa-solid fa-xmark';
        } else {
            toggleIcon.className = 'fa-solid fa-bars';
        }
    });

    // Fecha ao clicar em um link interno
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            toggleIcon.className = 'fa-solid fa-bars';
        });
    });

    // Fecha ao clicar na tela vazia (Mobile)
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('mobile-active');
            toggleIcon.className = 'fa-solid fa-bars';
        }
    });
}

// LÓGICA DE SPA (TROCA DE ABAS NA HOME)
function switchPage(pageId, event) {
    // Se o evento for passado, evite atualizar a URL
    if (event) {
        event.preventDefault();
    }

    // Desativa abas e links anteriores (somente no arquivo index.html)
    const pages = document.querySelectorAll('.page-section');
    if (pages.length > 0) {
        pages.forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

        const targetPage = document.getElementById(`page-${pageId}`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Atualiza estilo na navbar principal
        const targetNav = document.querySelectorAll('.nav-links .nav-item');
        targetNav.forEach(nav => {
            if (nav.getAttribute('onclick') && nav.getAttribute('onclick').includes(pageId)) {
                nav.classList.add('active');
            }
        });

        // Limpa o scroll no topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// LÓGICA DE ABAS LEGAIS (PÁGINA TERMS)
function toggleLegalTab(tabId) {
    const sections = document.querySelectorAll('.legal-content-section');
    if (sections.length > 0) {
        sections.forEach(section => section.classList.remove('active'));
        document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));

        const targetSection = document.getElementById(`legal-${tabId}`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        const currentLink = Array.from(document.querySelectorAll('.sidebar-link'))
            .find(link => link.getAttribute('href') === `#${tabId}`);
        if (currentLink) currentLink.classList.add('active');
    }
}

// GARANTE ANCORAGEM CORRETA NA PÁGINA TERMS AO CHEGAR DE OUTRA PÁGINA
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'termos' || hash === 'privacidade') {
        toggleLegalTab(hash);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const avatarContainers = document.querySelectorAll('.discord-avatar-auto');

    avatarContainers.forEach(async (container) => {
        const userId = container.getAttribute('data-discord-id');
        if (!userId) return;

        try {
            // Consulta a API pública do Lanyard (ferramenta padrão para ler presença/dados do Discord via ID)
            const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
            const data = await response.json();

            const imgElement = document.createElement('img');
            imgElement.classList.add('discord-avatar-img');
            imgElement.alt = 'Discord Avatar';

            if (data.success && data.data.discord_user.avatar) {
                const avatarHash = data.data.discord_user.avatar;
                // Se o hash começar com "a_", o avatar atual é um GIF animado
                const formato = avatarHash.startsWith('a_') ? 'gif' : 'png';

                imgElement.src = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${formato}?size=128`;
            } else {
                // Fallback automático caso o usuário não tenha avatar customizado
                const indexPadrao = Number(BigInt(userId) >> 22n % 6n);
                imgElement.src = `https://cdn.discordapp.com/embed/avatars/${indexPadrao}.png`;
            }

            container.innerHTML = '';
            container.appendChild(imgElement);

        } catch (error) {
            console.error(`Erro ao carregar avatar do usuário ${userId}:`, error);
            // Fallback de segurança em caso de falha na API
            container.innerHTML = `<img src="https://cdn.discordapp.com/embed/avatars/0.png" class="discord-avatar-img">`;
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuOverlay = document.getElementById('menuOverlay');

    const dropdown = document.querySelector('.dropdown');
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    // FUNÇÃO UNIFICADA: Controla o painel lateral e força o ícone correto
    function fecharSidebar() {
        navLinks.classList.remove('active');
        menuOverlay.classList.remove('active');

        // Garante que o ícone volte a ser o de 3 linhas (fa-bars)
        const icon = menuToggle.querySelector('i');
        icon.className = 'fa-solid fa-bars';
    }

    function abrirSidebar() {
        navLinks.classList.add('active');
        menuOverlay.classList.add('active');

        // Altera para o X (fa-xmark)
        const icon = menuToggle.querySelector('i');
        icon.className = 'fa-solid fa-xmark';
    }

    // Alterna baseado no estado atual
    function toggleSidebar() {
        if (navLinks.classList.contains('active')) {
            fecharSidebar();
        } else {
            abrirSidebar();
        }
    }

    // Ouvintes do botão principal e do fundo escuro
    menuToggle.addEventListener('click', toggleSidebar);
    menuOverlay.addEventListener('click', fecharSidebar);

    // EVENTO CRUCIAL: Fecha o menu e reseta o ícone ao clicar em qualquer link
    // Seleciona links comuns E links de dentro do dropdown de módulos
    const todosOsLinks = navLinks.querySelectorAll('.nav-item, .dropdown-menu a, li > a:not(.nav-item-drop)');

    todosOsLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                fecharSidebar(); // Fecha o menu lateral e bota o ícone de 3 linhas
            }
        });
    });

    // CLIQUE NO NOME "MÓDULOS": Abre/Fecha apenas a sanfona de sub-abas (não fecha o menu lateral)
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 992) {
                e.preventDefault(); // Evita recarregar a página ou pular
                dropdown.classList.toggle('active');
                dropdownMenu.classList.toggle('open');
            }
        });
    }
});

