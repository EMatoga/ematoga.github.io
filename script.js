// ============================================
// KONFIGURACJA
// ============================================

const CONFIG = {
    defaultLanguage: 'pl',
    defaultTheme: 'light',
    imagePath: 'images/',
    galleryPath: 'images/gallery/'
};

// ============================================
// ZARZĄDZANIE MOTYWEM (jasny/ciemny)
// ============================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Aktualizacja meta tagu theme-color dla mobile
    updateThemeColor(newTheme);
}

function updateThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
    }
    const color = theme === 'dark' ? '#0f0f0f' : '#faf9f6';
    document.querySelector('meta[name="theme-color"]').setAttribute('content', color);
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme || (prefersDark ? 'dark' : CONFIG.defaultTheme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeColor(theme);
}

// ============================================
// ZARZĄDZANIE JĘZYKIEM
// ============================================

function setLanguage(lang) {
    if (!['pl', 'en'].includes(lang)) return;
    
    // Aktualizacja przycisków
    document.querySelectorAll('.nav-controls .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`btn-${lang}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Aktualizacja treści
    document.querySelectorAll('.lang-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(el => {
        el.classList.add('active');
    });
    
    // Aktualizacja nagłówków sekcji
    document.querySelectorAll('h2[data-pl]').forEach(h2 => {
        const text = h2.getAttribute(`data-${lang}`);
        if (text) {
            // Zachowaj strukturę z ::after przez ustawienie atrybutu
            h2.textContent = text;
        }
    });
    
    // Aktualizacja placeholderów i innych elementów z data-pl/data-en
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        if (el.hasAttribute(`data-${lang}`) && !el.classList.contains('lang-content')) {
            const text = el.getAttribute(`data-${lang}`);
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.innerHTML = text; // Używamy innerHTML dla <br>
            }
        }
    });
    
    // Aktualizacja HTML lang
    document.documentElement.lang = lang;
    
    // Zapisz preferencję
    localStorage.setItem('language', lang);
    
    // Aktualizacja tytułu strony
    updatePageTitle(lang);
}

function updatePageTitle(lang) {
    const titles = {
        pl: 'Portfolio Akademickie',
        en: 'Academic Portfolio'
    };
    document.title = titles[lang] || titles.pl;
}

function initLanguage() {
    const savedLang = localStorage.getItem('language') || CONFIG.defaultLanguage;
    if (savedLang !== CONFIG.defaultLanguage) {
        setLanguage(savedLang);
    }
}

// ============================================
// OBSŁUGA OBRAZKÓW
// ============================================

// Sprawdź czy obrazek istnieje, jeśli nie - pokaż placeholder
function checkProfileImage() {
    const img = new Image();
    img.onload = function() {
        // Obrazek istnieje - zamień placeholder na img
        const placeholder = document.getElementById('profile-placeholder');
        if (placeholder) {
            const container = placeholder.parentElement;
            container.innerHTML = `<img src="${CONFIG.imagePath}profile.jpg" alt="Zdjęcie profilowe" class="photo" id="profile-photo">`;
        }
    };
    img.onerror = function() {
        // Obrazek nie istnieje - zostaw placeholder
        console.log('Profilowe zdjęcie nie znalezione. Dodaj images/profile.jpg');
    };
    img.src = CONFIG.imagePath + 'profile.jpg';
}

// Lightbox dla galerii
function openLightbox(src, caption) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');
    
    img.src = src;
    cap.textContent = caption || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Blokuj scroll
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Przywróć scroll
    
    // Czyść po zamknięciu
    setTimeout(() => {
        document.getElementById('lightbox-img').src = '';
    }, 300);
}

// Inicjalizacja galerii - dynamiczne ładowanie (opcjonalnie)
function initGallery() {
    const gallery = document.getElementById('image-gallery');
    if (!gallery) return;
    
    // Dodaj obsługę kliknięcia dla istniejących elementów
    gallery.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const caption = this.querySelector('.gallery-caption')?.textContent || '';
            if (img) {
                openLightbox(img.src, caption);
            }
        });
    });
}

// Funkcja pomocnicza do dynamicznego dodawania zdjęć do galerii
function addGalleryItem(imageSrc, captionPl, captionEn) {
    const gallery = document.getElementById('image-gallery');
    const emptyMsg = gallery.querySelector('.gallery-empty');
    
    if (emptyMsg) {
        emptyMsg.remove();
    }
    
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
        <img src="${imageSrc}" alt="${captionPl}" loading="lazy">
        <div class="gallery-caption" data-pl="${captionPl}" data-en="${captionEn}">${captionPl}</div>
    `;
    
    item.addEventListener('click', () => {
        const currentLang = document.documentElement.lang || 'pl';
        const caption = currentLang === 'pl' ? captionPl : captionEn;
        openLightbox(imageSrc, caption);
    });
    
    gallery.appendChild(item);
}

// ============================================
// INICJALIZACJA
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicjalizacja motywu
    initTheme();
    
    // Inicjalizacja języka
    initLanguage();
    
    // Sprawdzenie zdjęcia profilowego
    checkProfileImage();
    
    // Inicjalizacja galerii
    initGallery();
    
    // Obsługa klawisza ESC dla lightboxa
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // Zapobiegaj zamykaniu lightboxa przy kliknięciu w obrazek
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    console.log('Portfolio załadowane. Motyw:', 
        document.documentElement.getAttribute('data-theme'), 
        '| Język:', document.documentElement.lang);
});

// Eksport funkcji dla użytku globalnego (opcjonalnie)
window.PortfolioApp = {
    setLanguage,
    toggleTheme,
    addGalleryItem,
    openLightbox,
    closeLightbox
};
