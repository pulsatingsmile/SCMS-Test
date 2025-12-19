import { announcements } from '../../../data/mock-data.js';
import { $, $$ } from '../core/utils.js';
import { Modal, Toast } from '../core/components.js';
import { Storage } from '../core/storage.js';

let currentCategory = "All";

function render() {
    const container = $('#announcements-container');
    const searchVal = $('#announcement-search').value.toLowerCase();

    const filtered = announcements.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchVal) || item.description.toLowerCase().includes(searchVal);
        const matchesCat = currentCategory === "All" || item.category === currentCategory;
        return matchesSearch && matchesCat;
    });

    container.innerHTML = filtered.map(item => `
        <div class="card p-6">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div class="flex-1">
                    <div class="flex items-start gap-3 mb-2 flex-wrap">
                        <h3 class="text-text-primary flex-1 poppins">${item.title}</h3>
                        <span class="badge badge-${item.category.toLowerCase()}">${item.category}</span>
                    </div>
                    <p class="text-text-secondary mb-2">${item.description}</p>
                    <p class="text-text-secondary text-sm">${item.date}</p>
                </div>
                <div class="flex sm:flex-col gap-2">
                    <button onclick="window.handleSave(${item.id})" class="btn btn-secondary btn-sm flex-1 sm:flex-none">
                        <img src="./assets/img/BookMarkBlack.svg" alt="Save" class="w-5 h-5 mr-2"></img>Save
                    </button>
                    <button onclick="window.handleView(${item.id})" class="btn btn-primary btn-sm flex-1 sm:flex-none">
                        <img src="./assets/img/EyeWhite.svg" alt="See" class="w-5 h-5 mr-2"></img>View Details
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    if(window.lucide) window.lucide.createIcons();
}

// Global handlers for HTML onclicks
window.handleSave = (id) => {
    const item = announcements.find(a => a.id === id);
    if(Storage.addItem(Storage.KEYS.SAVED_ANNOUNCEMENTS, id)) {
        Toast.show(`Saved: ${item.title}`);
    } else {
        Toast.show(`Already saved: ${item.title}`);
    }
};

window.handleView = (id) => {
    const item = announcements.find(a => a.id === id);
    const content = `
        <div class="space-y-4">
            <div class="flex items-center gap-2 flex-wrap">
                <span class="badge badge-${item.category.toLowerCase()}">${
      item.category
    }</span>
                <span class="text-text-secondary text-sm">${item.date}</span>
            </div>
            <p class="text-text-primary leading-relaxed">${item.fullContent}</p>
            <div class="pt-4 border-t border-gray-200">
                <button onclick="saveAnnouncement(${
                  item.id
                }); closeModal();" class="btn btn-primary w-full">
                    <img src="./assets/img/BookMarkWhite.svg" alt="Save" class="w-5 h-5 mr-2"></img>
                    Save Announcement
                </button>
            </div>
        </div>`;
    Modal.open(item.title, content);
};

// Filtering
window.filterByCategory = (cat) => {
    currentCategory = cat;
    $$('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === cat);
    });
    render();
};

window.filterAnnouncements = render;

// Init
document.addEventListener('DOMContentLoaded', render);