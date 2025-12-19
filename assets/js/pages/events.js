import { events } from "../../../data/mock-data.js";
import { $, $$ } from "../core/utils.js";
import { Modal, Toast } from "../core/components.js";
import { Storage } from "../core/storage.js";

let currentCategory = "All";

function render() {
  const container = $("#events-container");
  const searchVal = $("#event-search").value.toLowerCase();

  const filtered = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchVal) ||
      e.description.toLowerCase().includes(searchVal);
    const matchesCat =
      currentCategory === "All" || e.category === currentCategory;
    return matchesSearch && matchesCat;
  });

  container.innerHTML = filtered
    .map((e) => {
      const capacityPercent = (e.registered / e.capacity) * 100;
      const isFull = e.registered >= e.capacity;
      return `
            <div class="card p-6">
                <div class="space-y-4">
                    <div class="flex items-start justify-between gap-3">
                        <h3 class="text-text-primary flex-1 poppins">${
                          e.title
                        }</h3>
                        <span class="badge badge-${e.category.toLowerCase()}">${
        e.category
      }</span>
                    </div>
                    <p class="text-text-secondary">${e.description}</p>
                    <div class="space-y-2 text-sm">
                        <div class="flex items-center gap-2 text-text-secondary">
                            <img src="./assets/img/CalendarBlack.svg" alt="Calendar" class="w-4 h-4"></img>
                            <span>${e.date} at ${e.time}</span>
                        </div>
                        <div class="flex items-center gap-2 text-text-secondary">
                            <img src="./assets/img/Location.svg" alt="location" class="w-4 h-4"></img>
                            <span>${e.location}</span>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center justify-between text-sm mb-1">
                            <div class="flex items-center gap-1 text-text-secondary">
                              <img src="./assets/img/PersonBlack.svg" alt="Person" class="w-4 h-4"></img>
                              Capacity
                            </div>
                            <span class="text-text-secondary">${
                              e.registered
                            } / ${e.capacity}</span>
                        </div>
                        <div class="capacity-bar"><div class="capacity-fill" style="width: ${capacityPercent}%"></div></div>
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button onclick="window.handleRegister(${
                          e.id
                        })" class="btn btn-primary btn-sm flex-1" ${
        isFull ? "disabled" : ""
      }>
                            ${isFull ? "Full" : "Register"}
                        </button>
                        <button onclick="window.handleView(${
                          e.id
                        })" class="btn btn-secondary btn-sm flex-1">
                            <img src="./assets/img/EyeBlack.svg" alt="See" class="w-4 h-4 mr-2"></img>
                            View Details
                        </button>
                    </div>
                </div>
            </div>`;
    })
    .join("");

  if (window.lucide) window.lucide.createIcons();
}

window.handleRegister = (id) => {
  const event = events.find((e) => e.id === id);
  if (event.registered >= event.capacity) return;

  if (Storage.addItem(Storage.KEYS.REGISTERED_EVENTS, id)) {
    Toast.show(`Registered for: ${event.title}`);
  } else {
    Toast.show(`Already registered for: ${event.title}`);
  }
};

window.handleView = (id) => {
  const e = events.find((ev) => ev.id === id);
  const isFull = e.registered >= e.capacity;
  const content = `
        <div class="space-y-4">
            <span class="badge badge-${e.category.toLowerCase()}">${
    e.category
  }</span>
            <div class="space-y-3 text-text-primary">
                <div class="flex items-center gap-2"><img src="./assets/img/CalendarBlack.svg" alt="Calendar" class="w-5 h-5"></img><span>${
                  e.date
                } at ${e.time}</span></div>
                <div class="flex items-center gap-2"><img src="./assets/img/Location.svg" alt="location" class="w-5 h-5"></img><span>${
                  e.location
                }</span></div>
                <div class="flex items-center gap-2"><img src="./assets/img/PersonBlack.svg" alt="Person" class="w-5 h-5"></img><span>${
                  e.registered
                } / ${e.capacity} registered</span></div>
            </div>
            <p class="text-text-primary leading-relaxed">${
              e.fullDescription
            }</p>
            <div class="pt-4 border-t border-gray-200">
                <button onclick="window.handleRegister(${
                  e.id
                }); closeModal();" class="btn btn-primary w-full" ${
    isFull ? "disabled" : ""
  }>
                    ${isFull ? "Event Full" : "Register Now"}
                </button>
            </div>
        </div>`;
  Modal.open(e.title, content);
};

window.filterByCategory = (cat) => {
  currentCategory = cat;
  $$(".filter-btn").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.category === cat)
  );
  render();
};

window.filterEvents = render;
document.addEventListener("DOMContentLoaded", render);
