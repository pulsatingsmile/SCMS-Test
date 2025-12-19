import { Storage } from "../core/storage.js";
import { announcements, events, clubs } from "../../../data/mock-data.js";
import { $ } from "../core/utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- NEW: Security Check ---
  const isLoggedIn = Storage.get('scms-logged-in', false);
  if (!isLoggedIn) {
      window.location.href = 'login.html';
      return; // Stop running code
  }

  // --- NEW: Dynamic Username ---
  const username = Storage.get('scms-username', 'Student');
  $('h1').textContent = `Welcome, ${username}`;

  // 1. Last Visited
  const lastPage = Storage.get(Storage.KEYS.LAST_VISITED, "Home Page");
  $("#last-visited").textContent = `Last visited: ${lastPage}`;

  // ... (Rest of your existing dashboard.js code: Saved Announcements, Events, Clubs loops) ...
  // 2. Saved Announcements
  const savedAnnIds = Storage.get(Storage.KEYS.SAVED_ANNOUNCEMENTS, []);
  const savedAnnList = announcements.filter((a) => savedAnnIds.includes(a.id));
  renderList(
    "saved-announcements-list",
    savedAnnList,
    (item) => `
        <div class="p-3 bg-background rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer">
            <p class="text-text-primary font-medium text-sm">${item.title}</p>
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
        <div class="p-3 bg-background rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer">
            <p class="text-text-primary font-medium text-sm">${item.title}</p>
            <p class="text-text-secondary text-xs mt-1">${item.date} at ${item.time}</p>
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
        <div class="p-3 bg-background rounded-lg hover:bg-opacity-80 transition-colors cursor-pointer">
            <p class="text-text-primary font-medium text-sm">${item.name}</p>
            <p class="text-text-secondary text-xs mt-1">${item.members} members</p>
        </div>
    `,
    "No joined clubs."
  );
});

function renderList(elementId, items, templateFn, emptyMsg) {
  const el = $(`#${elementId}`);
  if (!el) return;
  if (items.length === 0) {
    el.innerHTML = `<p class="text-text-secondary text-sm p-3">${emptyMsg}</p>`;
  } else {
    el.innerHTML = items.map(templateFn).join("");
  }
}