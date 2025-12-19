import { clubs } from "../../../data/mock-data.js";
import { $, $$ } from "../core/utils.js";
import { Modal, Toast } from "../core/components.js";
import { Storage } from "../core/storage.js";

let currentCategory = "All";

function render() {
  const container = $("#clubs-container");
  const searchVal = $("#club-search").value.toLowerCase();

  const filtered = clubs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchVal) ||
      c.description.toLowerCase().includes(searchVal);
    const matchesCat =
      currentCategory === "All" || c.category === currentCategory;
    return matchesSearch && matchesCat;
  });

  container.innerHTML = filtered
    .map(
      (c) => `
        <div class="card overflow-hidden">
            <div class="h-32 ${c.bannerClass} flex items-center justify-center">
                <h3 class="text-white text-center px-4 poppins">${c.name}</h3>
            </div>
            <div class="p-6 space-y-4">
                <div class="flex items-center justify-between">
                    <span class="badge badge-${c.category.toLowerCase()} ">${
        c.category
      }</span>
                    <div class="flex items-center gap-1 text-text-secondary text-sm">
                        <img src="./assets/img/PersonBlack.svg" alt="Person" class="w-5 h-5"></img>
                        ${c.members} members</span>
                    </div>
                </div>
                <p class="text-text-secondary text-sm">${c.description}</p>
                <div class="flex gap-2 pt-2">
                    <button onclick="window.handleJoin(${
                      c.id
                    })" class="btn btn-primary btn-sm flex-1">Join Club</button>
                    <button onclick="window.handleView(${
                      c.id
                    })" class="btn btn-secondary btn-sm"><img src="./assets/img/EyeBlack.svg" alt="See" class="w-5 h-5"></img></button>
                </div>
            </div>
        </div>`
    )
    .join("");

  if (window.lucide) window.lucide.createIcons();
}

window.handleJoin = (id) => {
  const club = clubs.find((c) => c.id === id);
  if (Storage.addItem(Storage.KEYS.JOINED_CLUBS, id)) {
    Toast.show(`Joined: ${club.name}`);
  } else {
    Toast.show(`Already a member of: ${club.name}`);
  }
};

window.handleView = (id) => {
  const c = clubs.find((cl) => cl.id === id);
  const avatars = Array.from(
    { length: 8 },
    (_, i) =>
      `<div class="w-10 h-10 rounded-full bg-background border-2 border-white flex items-center justify-center text-text-primary text-sm">${String.fromCharCode(
        65 + i
      )}</div>`
  ).join("");

  const content = `
        <div class="space-y-6">
            <div class="h-40 ${
              c.bannerClass
            } rounded-lg flex items-center justify-center">
                <h2 class="text-white poppins">${c.name}</h2>
            </div>
            <div class="flex items-center gap-4 flex-wrap">
                <span class="badge badge-${c.category.toLowerCase()}">${
    c.category
  }</span>
                <div class="flex items-center gap-2 text-text-secondary">
                    <img src="./assets/img/PersonBlack.svg" alt="Person" class="w-5 h-5"></img>
                    ${c.members} members</span>
                </div>
            </div>
            <div>
                <h4 class="text-text-primary mb-2 poppins">About</h4>
                <p class="text-text-primary leading-relaxed">${
                  c.fullDescription
                }</p>
            </div>
            <div>
                <h4 class="text-text-primary mb-3 poppins">Active Members</h4>
                <div class="flex -space-x-2 flex-wrap">${avatars}
                    <div class="w-10 h-10 rounded-full bg-background border-2 border-white flex items-center justify-center text-text-primary text-xs">+${
                      c.members - 8
                    }</div>
                </div>
            </div>
            <div class="pt-4 border-t border-gray-200">
                <button onclick="window.handleJoin(${
                  c.id
                }); closeModal();" class="btn btn-primary w-full">Join ${
    c.name
  }</button>
            </div>
        </div>`;
  Modal.open(c.name, content);
};

window.filterByCategory = (cat) => {
  currentCategory = cat;
  $$(".filter-btn").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.category === cat)
  );
  render();
};

window.filterClubs = render;
document.addEventListener("DOMContentLoaded", render);
