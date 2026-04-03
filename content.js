// Styles
const style = document.createElement("style");
style.textContent = `
  /* ChatGPT Özel Font Ailesi */
  @font-face {
    font-family: 'Söhne';
    font-style: normal;
    font-weight: 400;
    src: local('Söhne'), local('Segoe UI'), local('Roboto');
  }

  #cgm-floating-btn { 
    position: fixed; bottom: 20px; right: 20px; z-index: 99999; 
    width: 44px; height: 44px; border-radius: 50%; 
    background: #212121; color: #ececf1; 
    border: 1px solid rgba(255,255,255,0.15); 
    cursor: pointer; display: flex; align-items: center; justify-content: center; 
    transition: all 0.2s ease; box-shadow: 0 0 15px rgba(0,0,0,0.2); 
  }
  #cgm-floating-btn:hover { background: #2f2f2f; transform: scale(1.05); }
  
  #cgm-modal { 
    display: none; position: fixed; 
    width: 800px; height: 650px; min-width: 400px; min-height: 400px; 
    max-width: 95vw; max-height: 95vh;
    background: #212121; 
    border: 1px solid rgba(255,255,255,0.1); 
    border-radius: 12px;
    z-index: 100000; 
    font-family: Söhne, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    color: #ececf1; 
    flex-direction: column; overflow: hidden; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.5); 
    resize: both; 
  }
  
  /* Görünmez modern resizer */
  #cgm-modal::-webkit-resizer { background-color: transparent; }
  
  .cgm-header { 
    padding: 16px 24px; background: transparent; 
    border-bottom: 1px solid rgba(255,255,255,0.1); 
    display: flex; justify-content: space-between; align-items: center; 
    cursor: grab; user-select: none; 
  }
  .cgm-header:active { cursor: grabbing; }
  .cgm-header h2 { margin: 0; font-size: 16px; font-weight: 600; color: #ececf1; display: flex; align-items: center; gap: 8px;}
  
  /* Heatmap (Graph) Native Styles */
  .cgm-heatmap-wrapper { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; }
  .cgm-heatmap-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; font-weight: 500; color: #b4b4b4;}
  .cgm-heatmap-year-btn { background: transparent; border: none; color: #ececf1; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: background 0.2s;}
  .cgm-heatmap-year-btn:hover:not(:disabled) { background: #2f2f2f; }
  .cgm-heatmap-year-btn:disabled { color: #555; cursor: not-allowed; }
  
  .cgm-heatmap-grid-container { display: flex; width: 100%; }
  .cgm-heatmap-grid { display: grid; grid-template-rows: repeat(7, 1fr); grid-auto-columns: 1fr; grid-auto-flow: column; gap: 3px; width: 100%; }
  .cgm-heatmap-cell { width: 100%; aspect-ratio: 1 / 1; border-radius: 2px; cursor: pointer; transition: transform 0.1s; }
  .cgm-heatmap-cell:hover { transform: scale(1.3); z-index: 2; box-shadow: 0 0 4px rgba(0,0,0,0.5); }
  
  .cgm-tooltip { position: fixed; background: #000; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; pointer-events: none; z-index: 100001; white-space: nowrap; display: none; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }

  .cgm-controls { display: flex; gap: 12px; padding: 16px 24px; background: transparent; border-bottom: 1px solid rgba(255,255,255,0.1); align-items: center; flex-wrap: wrap; }
  
  #cgm-search { 
    flex: 1; padding: 10px 14px; border: 1px solid rgba(255,255,255,0.2); 
    border-radius: 8px; background: transparent; color: #ececf1; 
    outline: none; font-family: inherit; font-size: 14px; min-width: 150px;
    transition: border-color 0.2s;
  }
  #cgm-search:focus { border-color: #10a37f; }
  #cgm-search::placeholder { color: #8e8ea0; }

  .cgm-btn { 
    padding: 10px 16px; border-radius: 8px; border: none; cursor: pointer; 
    font-size: 14px; font-family: inherit; font-weight: 500; 
    transition: all 0.2s; white-space: nowrap;
  }
  .cgm-btn-sync { background: #fff; color: #000; }
  .cgm-btn-sync:hover { background: #e5e5e5; }
  .cgm-btn-danger { background: #ef4444; color: #fff; }
  .cgm-btn-danger:hover { background: #dc2626; }
  .cgm-btn-danger:disabled { background: rgba(255,255,255,0.1); color: #8e8ea0; cursor: not-allowed; }
  
  #cgm-list { flex: 1; overflow-y: auto; padding: 8px 0; margin: 0; list-style: none; background: transparent; }
  #cgm-list::-webkit-scrollbar { width: 8px; }
  #cgm-list::-webkit-scrollbar-track { background: transparent; }
  #cgm-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
  #cgm-list::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
  
  .cgm-item { display: flex; align-items: center; padding: 12px 24px; transition: background 0.1s; }
  .cgm-item:hover { background: rgba(255,255,255,0.05); }
  .cgm-item input[type="checkbox"] { 
    margin-right: 16px; width: 16px; height: 16px; 
    accent-color: #10a37f; cursor: pointer; flex-shrink: 0;
  }
  .cgm-item-title { flex: 1; text-decoration: none; color: #ececf1; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
  .cgm-item-title:hover { text-decoration: underline; }
  .cgm-item-date { color: #8e8ea0; font-size: 12px; margin-left: 12px; flex-shrink: 0;}
  
  #cgm-close { background: transparent; border: none; color: #8e8ea0; font-size: 24px; cursor: pointer; padding: 0; line-height: 1; display: flex;}
  #cgm-close:hover { color: #ececf1; }
  .cgm-status { font-size: 13px; color: #8e8ea0; font-weight: 400; margin-left: 8px; }
  
  .cgm-sub-controls { padding: 10px 24px; background: transparent; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; }
`;
document.head.appendChild(style);

// Icons
const iconHistory = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
const iconClose = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

// DOM Elements
const btn = document.createElement("button");
btn.id = "cgm-floating-btn";
btn.innerHTML = iconHistory;
btn.title = "History Manager";
document.body.appendChild(btn);

const tooltip = document.createElement("div");
tooltip.id = "cgm-tooltip";
tooltip.className = "cgm-tooltip";
document.body.appendChild(tooltip);

const modal = document.createElement("div");
modal.id = "cgm-modal";
modal.innerHTML = `
  <div class="cgm-header">
    <h2>${iconHistory} History Manager <span class="cgm-status" id="cgm-status-text"></span></h2>
    <button id="cgm-close" title="Close">${iconClose}</button>
  </div>
  
  <div class="cgm-heatmap-wrapper">
    <div class="cgm-heatmap-controls">
      <span>Activity Graph</span>
      <div>
        <button id="cgm-year-prev" class="cgm-heatmap-year-btn">←</button>
        <span id="cgm-year-label" style="margin: 0 12px;">2024</span>
        <button id="cgm-year-next" class="cgm-heatmap-year-btn">→</button>
      </div>
    </div>
    <div class="cgm-heatmap-grid-container">
      <div class="cgm-heatmap-grid" id="cgm-heatmap-grid"></div>
    </div>
  </div>

  <div class="cgm-controls">
    <button class="cgm-btn cgm-btn-sync" id="cgm-sync-btn">Sync All Chats</button>
    <input type="text" id="cgm-search" placeholder="Search conversations or YYYY-MM-DD..." />
    <button class="cgm-btn cgm-btn-danger" id="cgm-delete-btn" disabled>Delete Selected (0)</button>
  </div>
  <div class="cgm-sub-controls">
     <label style="cursor: pointer; font-size: 13px; color: #ececf1; display: flex; align-items: center;">
       <input type="checkbox" id="cgm-select-all" style="margin-right: 8px; width: 14px; height: 14px; accent-color: #10a37f;"> Select Visible
     </label>
  </div>
  <ul id="cgm-list"></ul>
`;
document.body.appendChild(modal);

// Drag & Drop
const header = modal.querySelector(".cgm-header");
let isDragging = false;
let offsetX, offsetY;

header.addEventListener("mousedown", (e) => {
  // If the button is clicked, drag
  if (e.target.closest("#cgm-close")) return;
  isDragging = true;
  const rect = modal.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  modal.style.left = `${e.clientX - offsetX}px`;
  modal.style.top = `${e.clientY - offsetY}px`;

  if (tooltip.style.display === "block") {
    tooltip.style.left = e.clientX + 15 + "px";
    tooltip.style.top = e.clientY + 15 + "px";
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Center the modal
let isCentered = false;
function centerModal() {
  if (isCentered) return;
  const finalWidth = Math.min(window.innerWidth * 0.95, 800);
  const finalHeight = Math.min(window.innerHeight * 0.95, 650);
  modal.style.width = finalWidth + "px";
  modal.style.height = finalHeight + "px";
  modal.style.left = `${(window.innerWidth - finalWidth) / 2}px`;
  modal.style.top = `${(window.innerHeight - finalHeight) / 2}px`;
  isCentered = true;
}

// State
let allChats = JSON.parse(localStorage.getItem("cgm_chats") || "[]");
let selectedIds = new Set();
let token = null;

// Heatmap State
let currentGraphYear = new Date().getFullYear();
let availableYears = [];

// DOM References
const listEl = document.getElementById("cgm-list");
const searchEl = document.getElementById("cgm-search");
const syncBtn = document.getElementById("cgm-sync-btn");
const deleteBtn = document.getElementById("cgm-delete-btn");
const selectAllEl = document.getElementById("cgm-select-all");
const statusText = document.getElementById("cgm-status-text");

const heatGrid = document.getElementById("cgm-heatmap-grid");
const yearLabel = document.getElementById("cgm-year-label");
const btnPrevYear = document.getElementById("cgm-year-prev");
const btnNextYear = document.getElementById("cgm-year-next");

// Prepare chat data
function prepareChatData() {
  const yearsSet = new Set();

  allChats.forEach((chat) => {
    chat._searchStr = (
      (chat.title || "") +
      " " +
      chat.update_time
    ).toLowerCase();

    if (chat.update_time) {
      const y = new Date(chat.update_time).getFullYear();
      if (!isNaN(y)) yearsSet.add(y);
    }
  });

  availableYears = Array.from(yearsSet).sort((a, b) => a - b);
  if (availableYears.length === 0) availableYears = [new Date().getFullYear()];

  if (!availableYears.includes(currentGraphYear)) {
    currentGraphYear = availableYears[availableYears.length - 1];
  }
}

prepareChatData();

// Render heatmap
function renderHeatmap() {
  heatGrid.innerHTML = "";
  yearLabel.innerText = currentGraphYear;

  btnPrevYear.disabled = currentGraphYear <= availableYears[0];
  btnNextYear.disabled =
    currentGraphYear >= availableYears[availableYears.length - 1];

  const dayCounts = {};
  allChats.forEach((chat) => {
    if (!chat.update_time) return;
    const dateObj = new Date(chat.update_time);
    if (dateObj.getFullYear() !== currentGraphYear) return;

    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    dayCounts[dateStr] = (dayCounts[dateStr] || 0) + 1;
  });

  const startDate = new Date(currentGraphYear, 0, 1);
  const endDate = new Date(currentGraphYear, 11, 31);

  const startDayOfWeek = startDate.getDay();
  for (let i = 0; i < startDayOfWeek; i++) {
    const empty = document.createElement("div");
    empty.style.visibility = "hidden";
    empty.className = "cgm-heatmap-cell";
    heatGrid.appendChild(empty);
  }

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const count = dayCounts[dateStr] || 0;
    const cell = document.createElement("div");
    cell.className = "cgm-heatmap-cell";

    // OpenAI ChatGPT Green Scale
    if (count === 0) cell.style.background = "rgba(255,255,255,0.05)";
    else if (count <= 2) cell.style.background = "#0e5c46"; // Darker green
    else if (count <= 5) cell.style.background = "#007a5a";
    else if (count <= 10) cell.style.background = "#10a37f"; // Primary green
    else cell.style.background = "#1dce9f"; // Brightest green

    cell.addEventListener("mouseenter", (e) => {
      tooltip.innerText = `${count} chats on ${dateStr}`;
      tooltip.style.display = "block";
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY + 15 + "px";
    });

    cell.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.clientX + 15 + "px";
      tooltip.style.top = e.clientY + 15 + "px";
    });

    cell.addEventListener("mouseleave", () => {
      tooltip.style.display = "none";
    });

    cell.addEventListener("click", () => {
      searchEl.value = dateStr;
      applySearch(dateStr);
    });

    heatGrid.appendChild(cell);
  }
}

// Navigation Listeners
document.getElementById("cgm-year-prev").addEventListener("click", () => {
  currentGraphYear--;
  renderHeatmap();
});
document.getElementById("cgm-year-next").addEventListener("click", () => {
  currentGraphYear++;
  renderHeatmap();
});

// API Functions
async function getBearerToken() {
  try {
    const res = await fetch("/api/auth/session");
    const data = await res.json();
    return data.accessToken;
  } catch (e) {
    alert("Failed to retrieve token. Make sure you are logged into ChatGPT.");
    return null;
  }
}

async function fetchAllChats() {
  if (!token) token = await getBearerToken();
  if (!token) return;

  let offset = 0;
  const limit = 100;
  let fetchedChats = [];
  syncBtn.disabled = true;
  const originalText = syncBtn.innerText;

  try {
    while (true) {
      syncBtn.innerText = `Fetching ${fetchedChats.length}...`;
      const url = `/backend-api/conversations?offset=${offset}&limit=${limit}&order=updated`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.items || data.items.length === 0) break;
      fetchedChats.push(...data.items);
      offset += limit;

      await new Promise((r) => setTimeout(r, 400));
    }

    allChats = fetchedChats;
    prepareChatData();
    localStorage.setItem("cgm_chats", JSON.stringify(allChats));
    renderList();
    renderHeatmap();
  } catch (e) {
    statusText.innerText = "Error syncing data.";
    console.error(e);
  } finally {
    syncBtn.disabled = false;
    syncBtn.innerText = originalText;
  }
}

async function deleteSelected() {
  if (selectedIds.size === 0) return;
  if (
    !confirm(
      `Are you sure you want to delete ${selectedIds.size} selected conversation(s)?`
    )
  )
    return;

  if (!token) token = await getBearerToken();
  if (!token) return;

  deleteBtn.disabled = true;
  let deletedCount = 0;
  const total = selectedIds.size;

  for (const id of selectedIds) {
    statusText.innerText = `Deleting ${deletedCount + 1} of ${total}...`;
    try {
      await fetch(`/backend-api/conversation/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_visible: false }),
      });
      allChats = allChats.filter((c) => c.id !== id);
      deletedCount++;
      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.error("Error deleting conversation:", id);
    }
  }

  localStorage.setItem("cgm_chats", JSON.stringify(allChats));
  selectedIds.clear();
  prepareChatData();
  renderList();
  renderHeatmap();
  deleteBtn.disabled = false;
  selectAllEl.checked = false;
}

// Fast DOM Render
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderList() {
  listEl.innerHTML = "";
  const fragment = document.createDocumentFragment();

  allChats.forEach((chat) => {
    const li = document.createElement("li");
    li.className = "cgm-item";

    const isChecked = selectedIds.has(chat.id) ? "checked" : "";

    li.innerHTML = `
      <input type="checkbox" data-id="${chat.id}" ${isChecked}>
      <a href="/c/${chat.id}" class="cgm-item-title" title="${
      chat.title || "New chat"
    }">${chat.title || "New chat"}</a>
      <span class="cgm-item-date">${formatDate(chat.update_time)}</span>
    `;

    chat._node = li;
    fragment.appendChild(li);
  });

  listEl.appendChild(fragment);
  updateDeleteBtn();

  if (searchEl.value) {
    applySearch(searchEl.value);
  } else {
    statusText.innerText = `${allChats.length} total`;
  }
}

// Super Fast Search
function applySearch(searchTerm) {
  const terms = searchTerm
    .toLowerCase()
    .split(" ")
    .filter((t) => t.trim() !== "");
  let visibleCount = 0;

  allChats.forEach((chat) => {
    if (!chat._node) return;
    const isMatch = terms.every((term) => chat._searchStr.includes(term));
    chat._node.style.display = isMatch ? "" : "none";
    if (isMatch) visibleCount++;
  });

  statusText.innerText = `${visibleCount} results`;
  updateDeleteBtn();
}

function updateDeleteBtn() {
  deleteBtn.innerText = `Delete Selected (${selectedIds.size})`;
  deleteBtn.disabled = selectedIds.size === 0;
}

// Event Listeners (Toggle Logic)
btn.addEventListener("click", () => {
  if (modal.style.display === "flex") {
    modal.style.display = "none";
    tooltip.style.display = "none";
  } else {
    modal.style.display = "flex";
    centerModal();
    if (allChats.length === 0) fetchAllChats();
    else if (listEl.children.length === 0) {
      renderList();
      renderHeatmap();
    }
  }
});

document.getElementById("cgm-close").addEventListener("click", () => {
  modal.style.display = "none";
  tooltip.style.display = "none";
});

syncBtn.addEventListener("click", fetchAllChats);
deleteBtn.addEventListener("click", deleteSelected);

let searchTimeout;
searchEl.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applySearch(e.target.value);
  }, 150);
});

// List click listener
listEl.addEventListener("click", (e) => {
  if (
    e.target.tagName === "A" &&
    e.target.classList.contains("cgm-item-title")
  ) {
    e.preventDefault();
    const url = e.target.getAttribute("href");
    window.history.pushState(null, "", url);
    window.dispatchEvent(new Event("popstate"));
  }
});

listEl.addEventListener("change", (e) => {
  if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
    const id = e.target.getAttribute("data-id");
    if (e.target.checked) selectedIds.add(id);
    else selectedIds.delete(id);
    updateDeleteBtn();
  }
});

selectAllEl.addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  allChats.forEach((chat) => {
    if (chat._node && chat._node.style.display !== "none") {
      const checkbox = chat._node.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.checked = isChecked;
      if (isChecked) selectedIds.add(chat.id);
      else selectedIds.delete(chat.id);
    }
  });
  updateDeleteBtn();
});
