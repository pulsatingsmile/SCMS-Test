import { $ } from './utils.js';
import { Storage } from './storage.js'; // Import storage

export function renderNavbar(activePage) {
    // Check if logged in
    const isLoggedIn = Storage.get('scms-logged-in', false);

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
                            <span class="hidden sm:inline">News</span>
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

                    <div class="border-l border-gray-600 pl-4 ml-2 flex items-center gap-2">
                        ${isLoggedIn 
                            ? `<button onclick="window.doLogout()" class="text-white text-sm font-medium hover:text-gray-300">Logout</button>`
                            : `<a href="login.html" class="bg-white text-nav-primary px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-100">Login</a>`
                        }
                        
                        <button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none ml-2">
                            <img src="./assets/img/MoonWhite.svg" alt="Dark Mode" class="w-5 h-5 text-gray-300" id="theme-icon"></img>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
    
    const placeholder = $('#navbar-placeholder');
    if (placeholder) placeholder.innerHTML = html;

    // Add Logout function globally
    window.doLogout = () => {
        if(confirm('Are you sure you want to logout?')) {
            Storage.set('scms-logged-in', false);
            window.location.href = 'login.html';
        }
    };
}

// ... Keep existing Footer, Modal, Toast code ...
export function renderFooter() {
    // ... (your existing footer code)
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