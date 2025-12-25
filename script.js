document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu(); 
    
    if (document.body.id === 'index-body') {
        initSwiper();
    }
    
    if (document.body.id === 'catalog-body') {
        if (typeof products !== 'undefined') {
            renderProducts();
        }
        initCatalogModal();
    }

    initScrollAnimations();
});

// === ЛОГИКА МОБИЛЬНОГО МЕНЮ ===
function initMobileMenu() {
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const mainNav = document.getElementById('mainNav');
    if (!menuToggleBtn || !mainNav) return;

    const menuIcon = menuToggleBtn.querySelector('i');

    menuToggleBtn.addEventListener('click', () => {
        const isMenuOpen = mainNav.classList.toggle('active');
        // Исправлено: переключение иконок
        menuIcon.classList.toggle('fa-bars', !isMenuOpen);
        menuIcon.classList.toggle('fa-times', isMenuOpen);
        menuToggleBtn.setAttribute('aria-expanded', isMenuOpen);
    });
    
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuIcon.classList.add('fa-bars');
                menuIcon.classList.remove('fa-times');
                menuToggleBtn.setAttribute('aria-expanded', false);
            }
        });
    });
}

// === ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ТЕМЫ ===
function initThemeToggle() {
    const targetBody = document.getElementById('index-body') || document.getElementById('catalog-body') || document.body;
    const toggleButton = document.getElementById('themeToggle');
    const icon = toggleButton ? toggleButton.querySelector('i') : null;

    if (!targetBody || !toggleButton || !icon) return; 

    const currentTheme = localStorage.getItem('theme');

    const updateIcon = (isDark) => {
        icon.classList.remove('fa-sun', 'fa-moon');
        icon.classList.add(isDark ? 'fa-moon' : 'fa-sun');
    };

    if (currentTheme === 'dark') {
        targetBody.classList.add('dark-mode');
        updateIcon(true);
    }

    toggleButton.addEventListener('click', () => {
        const isDark = targetBody.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon(isDark);
    });
}

// === ЛОГИКА КАТАЛОГА ===
function createProductCard(product) {
    // Добавлен onclick для вызова модального окна
    return `
        <div class="product-card animate-on-scroll" data-product-id="${product.id}">
            <img src="${product.img}" alt="${product.name}">
            <div class="card-info">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <div class="card-footer">
                    <strong>${product.price} ₽</strong>
                    <button class="price-btn" onclick="openModal(${product.id})">Заказать</button>
                </div>
            </div>
        </div>
    `;
}

function renderProducts() {
    const outerwearGrid = document.getElementById('outerwear-grid');
    const regularWearGrid = document.getElementById('regular-wear-grid');
    if (!outerwearGrid || !regularWearGrid) return;
    
    outerwearGrid.innerHTML = '';
    regularWearGrid.innerHTML = '';

    const outerwearProducts = products.filter(p => p.group === 'outerwear');
    const regularWearProducts = products.filter(p => p.group === 'regular-wear');

    outerwearProducts.forEach(product => {
        outerwearGrid.innerHTML += createProductCard(product);
    });

    regularWearProducts.forEach(product => {
        regularWearGrid.innerHTML += createProductCard(product);
    });
}

function initCatalogModal() {
    const modal = document.getElementById('productModal');
    const closeModalBtn = document.querySelector('.close-btn');
    if (!modal || !closeModalBtn) return;

    window.openModal = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductChars').textContent = product.characteristics;

        const sizesContainer = document.getElementById('modalProductSizes');
        sizesContainer.innerHTML = '';
        
        product.sizes.forEach(size => {
            const sizeItem = document.createElement('span'); 
            sizeItem.className = 'size-item';
            sizeItem.textContent = size;
            sizesContainer.appendChild(sizeItem);
        });

        modal.style.display = 'flex'; // Используем flex для центрирования
    };

    closeModalBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (Scroll, Swiper) ===
function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    if (!('IntersectionObserver' in window)) return;

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => scrollObserver.observe(el));
}

function initSwiper() {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.swiper-container', {
            loop: true,
            autoplay: { delay: 3500 },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }
}
