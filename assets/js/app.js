import { renderNavbar, renderFooter, Modal, Toast } from './core/components.js';
import { Storage } from './core/storage.js';
import { $, getPageName } from './core/utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const pageName = getPageName();
    
    // Initialize UI
    renderNavbar(pageName);
    renderFooter();
    
    // Initialize Theme
    let isDark = Storage.get(Storage.KEYS.THEME, false);
    applyTheme(isDark);

    const themeBtn = $('#theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            isDark = !isDark;
            Storage.set(Storage.KEYS.THEME, isDark);
            applyTheme(isDark);
        });
    }

    // Global Modal/Toast Handlers
    window.closeModal = Modal.close;
    window.closeToast = Toast.close;
    
    // Track Last Visited Page
    if (pageName && pageName !== 'Dashboard') {
        Storage.set(Storage.KEYS.LAST_VISITED, pageName + ' Page');
    }

    // Initialize Lucide Icons
    if(window.lucide) window.lucide.createIcons();
});

function applyTheme(isDark) {
    const body = document.body;
    const icon = $('#theme-icon');
    
    if (isDark) {
        body.classList.add('dark-mode');
        if(icon) {
            icon.setAttribute('data-lucide', 'sun');
            icon.classList.replace('text-gray-300', 'text-yellow-300');
        }
    } else {
        body.classList.remove('dark-mode');
        if(icon) {
            icon.setAttribute('data-lucide', 'moon');
            icon.classList.replace('text-yellow-300', 'text-gray-300');
        }
    }
    if(window.lucide) window.lucide.createIcons();
}