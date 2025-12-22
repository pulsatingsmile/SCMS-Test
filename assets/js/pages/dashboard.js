import { Storage } from "../core/storage.js";
import { announcements, events, clubs } from "../../../data/mock-data.js";
import { $ } from "../core/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- Security Check ---
  const isLoggedIn = Storage.get('scms-logged-in', false);
  if (!isLoggedIn) {
      window.location.href = 'login.html';
      return; 
  }

  // --- Dynamic Username ---
  const username = Storage.get('scms-username', 'Student');
  $('h1').textContent = `Welcome, ${username}`;

  // 1. Last Visited
  const lastPage = Storage.get(Storage.KEYS.LAST_VISITED, "Home Page");
  $("#last-visited").textContent = `Last visited: ${lastPage}`;

  // --- NEW: Demo Data Seeder (Auto-fills the dashboard) ---
  seedDemoData();

  // 2. Saved Announcements
  const savedAnnIds = Storage.get(Storage.KEYS.SAVED_ANNOUNCEMENTS, []);
  const savedAnnList = announcements.filter((a) => savedAnnIds.includes(a.id));
  renderList(
    "saved-announcements-list",
    savedAnnList,
    (item) => `
        <div class="p-3 bg-background rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
            <div class="flex items-start justify-between">
                <p class="text-text-primary font-medium text-sm line-clamp-1">${item.title}</p>
                <span class="badge badge-${item.category.toLowerCase()} text-[10px] scale-90 origin-right">${item.category}</span>
            </div>
            <p class="text-text-secondary text-xs mt-1">${item.date}</p>
        </div>
    `,
    "No saved announcements."
  );

  // 3. Registered Events
  const regEventIds = Storage.get(Storage.KEYS.REGISTERED_EVENTS, []);
  const regEventList = events.filter((e) => regEventIds.includes(e.id));
  renderList(
    "registered-events-list",
    regEventList,
    (item) => `
        <div class="p-3 bg-background rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
            <div class="flex items-start justify-between">
                <p class="text-text-primary font-medium text-sm line-clamp-1">${item.title}</p>
                <span class="badge badge-${item.category.toLowerCase()} text-[10px] scale-90 origin-right">${item.category}</span>
            </div>
            <p class="text-text-secondary text-xs mt-1 flex items-center gap-1">
                <img src="./assets/img/CalendarBlack.svg" class="w-3 h-3 opacity-60">
                ${item.date} • ${item.time}
            </p>
        </div>
    `,
    "No registered events."
  );

  // 4. Joined Clubs
  const joinedClubIds = Storage.get(Storage.KEYS.JOINED_CLUBS, []);
  const joinedClubList = clubs.filter((c) => joinedClubIds.includes(c.id));
  renderList(
    "joined-clubs-list",
    joinedClubList,
    (item) => `
        <div class="p-3 bg-background rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer border border-transparent hover:border-gray-200">
            <div class="flex items-start justify-between">
                <p class="text-text-primary font-medium text-sm">${item.name}</p>
                <span class="badge badge-${item.category.toLowerCase()} text-[10px] scale-90 origin-right">${item.category}</span>
            </div>
            <p class="text-text-secondary text-xs mt-1">${item.members} members</p>
        </div>
    `,
    "No joined clubs."
  );
  
  if(window.lucide) window.lucide.createIcons();
});

function renderList(elementId, items, templateFn, emptyMsg) {
  const el = $(`#${elementId}`);
  if (!el) return;
  if (items.length === 0) {
    el.innerHTML = `<p class="text-text-secondary text-sm p-3 italic">${emptyMsg}</p>`;
  } else {
    el.innerHTML = items.map(templateFn).join("");
  }
}

// --- NEW FUNCTION: Auto-Add Data ---
function seedDemoData() {
    // 1. If no Saved Announcements, add IDs 1 and 2
    const ann = Storage.get(Storage.KEYS.SAVED_ANNOUNCEMENTS, []);
    if (ann.length === 0) {
        Storage.set(Storage.KEYS.SAVED_ANNOUNCEMENTS, [1, 2]);
    }

    // 2. If no Registered Events, add IDs 1, 2, and 4
    const ev = Storage.get(Storage.KEYS.REGISTERED_EVENTS, []);
    if (ev.length === 0) {
        Storage.set(Storage.KEYS.REGISTERED_EVENTS, [1, 2, 4]);
    }

    // 3. If no Joined Clubs, add IDs 1 and 5
    const cl = Storage.get(Storage.KEYS.JOINED_CLUBS, []);
    if (cl.length === 0) {
        Storage.set(Storage.KEYS.JOINED_CLUBS, [1, 5]);
    }
}