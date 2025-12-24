import { $ } from './utils.js';
import { Storage } from './storage.js';

export function renderNavbar(activePage) {
    // Check if logged in
    const isLoggedIn = Storage.get('scms-logged-in', false);
    
    // --- UPDATED LOGIC: Get Profile for specific User ID ---
    const currentUserId = Storage.get('scms-user-id', null);
    
    // Try to get the specific profile for this user
    const userProfile = currentUserId 
        ? Storage.get(`scms-profile-${currentUserId}`, {}) 
        : {}; 

    const avatarSrc = userProfile.avatar; 
    const userName = Storage.get('scms-username', 'Student');
    const initial = userName.charAt(0).toUpperCase();

    const html = `
    <nav class="bg-nav-primary sticky top-0 z-50 shadow-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center cursor-pointer">
                    <a href="index.html" class="flex items-center">
                        <span class="text-white font-semibold poppins text-3xl">SCMS</span>
                    </a>   
                </div>

                <div class="flex items-center space-x-2 md:space-x-4">
                    <div class="flex items-center space-x-1 md:space-x-2">
                        <a href="index.html" class="nav-btn ${activePage === "Home" ? "active" : ""}">
                            <img src="assets/img/Home.svg" class="w-5 h-5" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'"/>
                            <span class="hidden sm:inline">Home</span>
                        </a>
                        <a href="dashboard.html" class="nav-btn ${activePage === "Dashboard" ? "active" : ""}">
                            <img src="assets/img/DashBoard.svg" class="w-5 h-5"/>
                            <span class="hidden sm:inline">Dashboard</span>
                        </a>
                        <a href="announcements.html" class="nav-btn ${activePage === "Announcement" ? "active" : ""}">
                            <img src="assets/img/MegaphoneWhite.svg" class="w-5 h-5"/>
                            <span class="hidden sm:inline">Announcements</span>
                        </a>
                        <a href="events.html" class="nav-btn ${activePage === "Events" ? "active" : ""}">
                            <img src="assets/img/CalendarWhite.svg" class="w-5 h-5"/>
                            <span class="hidden sm:inline">Events</span>
                        </a>
                        <a href="clubs.html" class="nav-btn ${activePage === "Clubs" ? "active" : ""}">
                            <img src="assets/img/PersonWhite.svg" class="w-5 h-5"/>
                            <span class="hidden sm:inline">Clubs</span>
                        </a>
                    </div>

                    <div class="border-l border-gray-600 pl-4 ml-2 flex items-center gap-3">
                        ${isLoggedIn 
                            ? `
                            <div class="relative group">
                                <button class="flex items-center gap-2 focus:outline-none transition-transform hover:scale-105">
                                    ${avatarSrc 
                                        ? `<img src="${avatarSrc}" class="w-9 h-9 rounded-full border-2 border-gray-400 object-cover bg-gray-800">`
                                        : `<div class="w-9 h-9 rounded-full border-2 border-gray-400 bg-gray-700 flex items-center justify-center text-white font-bold">${initial}</div>`
                                    }
                                </button>
                                <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div class="px-4 py-2 border-b border-gray-100">
                                        <p class="text-xs text-text-secondary">Signed in as</p>
                                        <p class="text-sm font-bold text-text-primary truncate">${userName}</p>
                                    </div>
                                    <a href="profile.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                        <i data-lucide="user" class="w-4 h-4"></i> My Profile
                                    </a>
                                    <a href="settings.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                        <i data-lucide="settings" class="w-4 h-4"></i> Settings
                                    </a>
                                    <div class="border-t border-gray-100 my-1"></div>
                                    <button onclick="window.doLogout()" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <i data-lucide="log-out" class="w-4 h-4"></i> Logout
                                    </button>
                                </div>
                            </div>
                            `
                            : `<a href="login.html" class="bg-white text-nav-primary px-4 py-1.5 rounded-md text-sm font-bold hover:bg-gray-100 transition-colors">Login</a>`
                        }
                        
                        <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none">
                            <img src="./assets/img/MoonWhite.svg" alt="Dark Mode" class="w-5 h-5 text-gray-300" id="theme-icon"></img>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
    
    const placeholder = $('#navbar-placeholder');
    if (placeholder) placeholder.innerHTML = html;

    // Helper for profile.js to auto-update navbar on save
    window.updateNavbarAvatar = () => renderNavbar(activePage);

    // Logout function
    window.doLogout = () => {
        if(confirm('Are you sure you want to logout?')) {
            Storage.set('scms-logged-in', false);
            Storage.set('scms-user-id', null); // Clear ID on logout
            window.location.href = 'login.html';
        }
    };
    
    // Initialize icons if on page load
    if(window.lucide) window.lucide.createIcons();
}

export function renderFooter() {
    const year = new Date().getFullYear();
    const html = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-footer-text">© ${year} Student Campus Management System. All rights reserved.</p>
    </div>`;
    
    const footer = $('footer');
    if (footer) footer.innerHTML = html;
}

export const Modal = {
    open(title, contentHTML) {
        const modal = $('#modal');
        $('#modal-title').textContent = title;
        $('#modal-body').innerHTML = contentHTML;
        modal.classList.add('active');
        document.body.style.overflow = "hidden";
        if(window.lucide) window.lucide.createIcons();
    },
    close() {
        $('#modal').classList.remove('active');
        document.body.style.overflow = "unset";
    }
};

export const Toast = {
    show(message) {
        $('#toast-message').textContent = message;
        const toast = $('#toast');
        toast.classList.add('active');
        if(window.lucide) window.lucide.createIcons();
        setTimeout(() => toast.classList.remove('active'), 3000);
    },
    close() {
        $('#toast').classList.remove('active');
    }
};