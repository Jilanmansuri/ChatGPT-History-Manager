// ============================================================
// ChatGPT Bulk History Manager
// Date Range + Search + Select Visible + Bulk Delete
// ============================================================

const style = document.createElement("style");

style.textContent = `
  #cgm-floating-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 999999;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #10a37f;
    color: white;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    box-shadow: 0 5px 20px rgba(0,0,0,.35);
  }

  #cgm-floating-btn:hover {
    transform: scale(1.05);
  }

  #cgm-modal {
    display: none;
    position: fixed;
    width: 900px;
    height: 700px;
    max-width: 95vw;
    max-height: 90vh;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999998;

    background: #212121;
    color: #ececf1;

    border: 1px solid rgba(255,255,255,.12);
    border-radius: 14px;

    box-shadow: 0 20px 60px rgba(0,0,0,.6);

    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;

    overflow: hidden;
    flex-direction: column;
  }

  .cgm-header {
    height: 60px;
    padding: 0 20px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid rgba(255,255,255,.1);
  }

  .cgm-header-title {
    font-size: 17px;
    font-weight: 600;
  }

  .cgm-close {
    background: transparent;
    border: none;
    color: #aaa;
    font-size: 24px;
    cursor: pointer;
  }

  .cgm-close:hover {
    color: white;
  }

  .cgm-controls {
    padding: 14px 18px;

    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    border-bottom: 1px solid rgba(255,255,255,.1);
  }

  .cgm-input {
    height: 38px;
    padding: 0 12px;

    background: #2f2f2f;
    color: #fff;

    border: 1px solid rgba(255,255,255,.15);
    border-radius: 8px;

    outline: none;
  }

  .cgm-input:focus {
    border-color: #10a37f;
  }

  #cgm-search {
    flex: 1;
    min-width: 200px;
  }

  .cgm-date-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cgm-date-label {
    font-size: 12px;
    color: #aaa;
  }

  input[type="date"] {
    color-scheme: dark;
  }

  .cgm-btn {
    height: 38px;
    padding: 0 14px;

    border: none;
    border-radius: 8px;

    cursor: pointer;
    font-weight: 500;
  }

  .cgm-btn-primary {
    background: #10a37f;
    color: white;
  }

  .cgm-btn-primary:hover {
    background: #0d8c6c;
  }

  .cgm-btn-secondary {
    background: #3a3a3a;
    color: white;
  }

  .cgm-btn-secondary:hover {
    background: #454545;
  }

  .cgm-btn-danger {
    background: #ef4444;
    color: white;
  }

  .cgm-btn-danger:hover {
    background: #dc2626;
  }

  .cgm-btn:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .cgm-selection-bar {
    padding: 10px 18px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    border-bottom: 1px solid rgba(255,255,255,.08);
  }

  .cgm-selection-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cgm-status {
    color: #aaa;
    font-size: 13px;
  }

  #cgm-list {
    flex: 1;

    overflow-y: auto;

    margin: 0;
    padding: 0;

    list-style: none;
  }

  .cgm-item {
    display: flex;
    align-items: center;

    padding: 11px 18px;

    border-bottom: 1px solid rgba(255,255,255,.05);
  }

  .cgm-item:hover {
    background: rgba(255,255,255,.04);
  }

  .cgm-checkbox {
    width: 17px;
    height: 17px;
    margin-right: 12px;

    cursor: pointer;
    accent-color: #10a37f;
  }

  .cgm-title {
    flex: 1;

    color: #ececf1;
    text-decoration: none;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cgm-title:hover {
    text-decoration: underline;
  }

  .cgm-date {
    margin-left: 15px;

    color: #888;

    font-size: 12px;
    white-space: nowrap;
  }

  .cgm-footer {
    padding: 8px 18px;

    color: #777;

    font-size: 11px;

    border-top: 1px solid rgba(255,255,255,.08);
  }
`;

document.head.appendChild(style);


// ============================================================
// CREATE FLOATING BUTTON
// ============================================================

const floatingButton = document.createElement("button");

floatingButton.id = "cgm-floating-btn";
floatingButton.innerHTML = "🗑️";
floatingButton.title = "ChatGPT Bulk Delete";

document.body.appendChild(floatingButton);


// ============================================================
// CREATE MODAL
// ============================================================

const modal = document.createElement("div");

modal.id = "cgm-modal";

modal.innerHTML = `

  <div class="cgm-header">

    <div class="cgm-header-title">
      🗑️ ChatGPT Bulk Delete
    </div>

    <button class="cgm-close" id="cgm-close">
      ×
    </button>

  </div>


  <div class="cgm-controls">

    <button
      class="cgm-btn cgm-btn-primary"
      id="cgm-sync"
    >
      Sync All Chats
    </button>


    <input
      id="cgm-search"
      class="cgm-input"
      type="text"
      placeholder="Search chats..."
    />


    <div class="cgm-date-group">

      <span class="cgm-date-label">
        From
      </span>

      <input
        id="cgm-start-date"
        class="cgm-input"
        type="date"
      />

    </div>


    <div class="cgm-date-group">

      <span class="cgm-date-label">
        To
      </span>

      <input
        id="cgm-end-date"
        class="cgm-input"
        type="date"
      />

    </div>


    <button
      class="cgm-btn cgm-btn-primary"
      id="cgm-apply-date"
    >
      Apply Date
    </button>


    <button
      class="cgm-btn cgm-btn-secondary"
      id="cgm-clear-date"
    >
      Clear
    </button>

  </div>


  <div class="cgm-selection-bar">

    <div class="cgm-selection-left">

      <input
        type="checkbox"
        id="cgm-select-all"
        class="cgm-checkbox"
      />

      <label for="cgm-select-all">
        Select Visible
      </label>

    </div>


    <div
      id="cgm-status"
      class="cgm-status"
    >
      0 chats
    </div>


    <button
      id="cgm-delete"
      class="cgm-btn cgm-btn-danger"
      disabled
    >
      Delete Selected (0)
    </button>

  </div>


  <ul id="cgm-list"></ul>


  <div class="cgm-footer">
    Date range is inclusive. Example:
    01/01/2025 → 31/12/2025 includes both dates.
  </div>

`;

document.body.appendChild(modal);


// ============================================================
// VARIABLES
// ============================================================

let allChats = [];

let selectedIds = new Set();

let accessToken = null;

let startDate = "";

let endDate = "";

let searchText = "";


// ============================================================
// DOM
// ============================================================

const closeButton =
  document.getElementById("cgm-close");

const syncButton =
  document.getElementById("cgm-sync");

const searchInput =
  document.getElementById("cgm-search");

const startInput =
  document.getElementById("cgm-start-date");

const endInput =
  document.getElementById("cgm-end-date");

const applyDateButton =
  document.getElementById("cgm-apply-date");

const clearDateButton =
  document.getElementById("cgm-clear-date");

const selectAllCheckbox =
  document.getElementById("cgm-select-all");

const deleteButton =
  document.getElementById("cgm-delete");

const list =
  document.getElementById("cgm-list");

const status =
  document.getElementById("cgm-status");


// ============================================================
// GET TOKEN
// ============================================================

async function getToken() {

  try {

    const response =
      await fetch("/api/auth/session");

    if (!response.ok) {

      throw new Error(
        "Unable to get session"
      );

    }

    const data =
      await response.json();

    return data.accessToken;

  } catch (error) {

    console.error(error);

    alert(
      "ChatGPT session token nahi mil raha.\n\n" +
      "Make sure you are logged into ChatGPT."
    );

    return null;
  }
}


// ============================================================
// FETCH ALL CHATS
// ============================================================

async function fetchAllChats() {

  if (!accessToken) {

    accessToken =
      await getToken();

  }

  if (!accessToken) return;


  syncButton.disabled = true;

  syncButton.innerText =
    "Loading...";


  let offset = 0;

  const limit = 100;

  let chats = [];


  try {

    while (true) {

      syncButton.innerText =
        `Loading ${chats.length} chats...`;


      const url =
        `/backend-api/conversations` +
        `?offset=${offset}` +
        `&limit=${limit}` +
        `&order=updated`;


      const response =
        await fetch(url, {

          headers: {
            Authorization:
              `Bearer ${accessToken}`
          }

        });


      if (!response.ok) {

        throw new Error(
          `API error: ${response.status}`
        );

      }


      const data =
        await response.json();


      if (
        !data.items ||
        data.items.length === 0
      ) {

        break;

      }


      chats.push(
        ...data.items
      );


      offset += limit;


      // Small delay to avoid hammering API
      await new Promise(
        resolve =>
          setTimeout(resolve, 300)
      );


      // If API returns less than limit,
      // we have reached the end.
      if (
        data.items.length < limit
      ) {

        break;

      }

    }


    allChats = chats;


    console.log(
      `Loaded ${allChats.length} chats`
    );


    renderList();


  } catch (error) {

    console.error(
      "Sync error:",
      error
    );


    alert(
      "Chats load karte waqt error aaya.\n\n" +
      error.message
    );

  } finally {

    syncButton.disabled = false;

    syncButton.innerText =
      "Sync All Chats";

  }

}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDate(
  dateString
) {

  if (!dateString) {

    return "Unknown";

  }


  const date =
    new Date(dateString);


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );

}


// ============================================================
// DATE CHECK
// ============================================================

function isDateInRange(
  chat
) {

  if (!chat.update_time) {

    return false;

  }


  const chatDate =
    new Date(
      chat.update_time
    );


  if (Number.isNaN(
    chatDate.getTime()
  )) {

    return false;

  }


  // --------------------------------------------
  // START DATE
  // --------------------------------------------

  if (startDate) {

    const start =
      new Date(
        `${startDate}T00:00:00`
      );


    if (
      chatDate < start
    ) {

      return false;

    }

  }


  // --------------------------------------------
  // END DATE
  // --------------------------------------------

  if (endDate) {

    const end =
      new Date(
        `${endDate}T23:59:59.999`
      );


    if (
      chatDate > end
    ) {

      return false;

    }

  }


  return true;

}


// ============================================================
// SEARCH CHECK
// ============================================================

function matchesSearch(
  chat
) {

  if (!searchText) {

    return true;

  }


  const title =
    (
      chat.title || ""
    ).toLowerCase();


  const date =
    (
      chat.update_time || ""
    ).toLowerCase();


  return (
    title.includes(searchText) ||
    date.includes(searchText)
  );

}


// ============================================================
// FILTER
// ============================================================

function getFilteredChats() {

  return allChats.filter(
    chat => {

      return (
        isDateInRange(chat) &&
        matchesSearch(chat)
      );

    }
  );

}


// ============================================================
// RENDER LIST
// ============================================================

function renderList() {

  list.innerHTML = "";


  const filteredChats =
    getFilteredChats();


  // Remove selected IDs that
  // no longer exist.
  selectedIds =
    new Set(
      [...selectedIds].filter(
        id =>
          allChats.some(
            chat =>
              chat.id === id
          )
      )
    );


  const fragment =
    document.createDocumentFragment();


  filteredChats.forEach(
    chat => {

      const item =
        document.createElement(
          "li"
        );


      item.className =
        "cgm-item";


      const checkbox =
        document.createElement(
          "input"
        );


      checkbox.type =
        "checkbox";


      checkbox.className =
        "cgm-checkbox";


      checkbox.dataset.id =
        chat.id;


      checkbox.checked =
        selectedIds.has(
          chat.id
        );


      checkbox.addEventListener(
        "change",
        () => {

          if (
            checkbox.checked
          ) {

            selectedIds.add(
              chat.id
            );

          } else {

            selectedIds.delete(
              chat.id
            );

          }


          updateUI();

        }
      );


      const title =
        document.createElement(
          "a"
        );


      title.className =
        "cgm-title";


      title.href =
        `/c/${chat.id}`;


      title.textContent =
        chat.title ||
        "New chat";


      title.addEventListener(
        "click",
        event => {

          event.preventDefault();


          window.history.pushState(
            {},
            "",
            title.href
          );


          window.dispatchEvent(
            new Event(
              "popstate"
            )
          );

        }
      );


      const date =
        document.createElement(
          "span"
        );


      date.className =
        "cgm-date";


      date.textContent =
        formatDate(
          chat.update_time
        );


      item.appendChild(
        checkbox
      );

      item.appendChild(
        title
      );

      item.appendChild(
        date
      );


      fragment.appendChild(
        item
      );

    }
  );


  list.appendChild(
    fragment
  );


  updateUI();

}


// ============================================================
// UPDATE UI
// ============================================================

function updateUI() {

  const filtered =
    getFilteredChats();


  status.innerText =
    `${filtered.length} visible | ` +
    `${selectedIds.size} selected | ` +
    `${allChats.length} total`;


  deleteButton.innerText =
    `Delete Selected (${selectedIds.size})`;


  deleteButton.disabled =
    selectedIds.size === 0;


  // Check if every visible chat
  // is selected.
  const allSelected =
    filtered.length > 0 &&
    filtered.every(
      chat =>
        selectedIds.has(
          chat.id
        )
    );


  selectAllCheckbox.checked =
    allSelected;


  selectAllCheckbox.indeterminate =
    !allSelected &&
    filtered.some(
      chat =>
        selectedIds.has(
          chat.id
        )
    );

}


// ============================================================
// APPLY DATE RANGE
// ============================================================

applyDateButton.addEventListener(
  "click",
  () => {

    const start =
      startInput.value;

    const end =
      endInput.value;


    // Start cannot be after end
    if (
      start &&
      end &&
      start > end
    ) {

      alert(
        "Start date end date se pehle honi chahiye."
      );

      return;

    }


    startDate =
      start;

    endDate =
      end;


    // Clear selections that
    // are outside the new filter.
    const visibleIds =
      new Set(
        getFilteredChats()
          .map(
            chat =>
              chat.id
          )
      );


    selectedIds =
      new Set(
        [...selectedIds].filter(
          id =>
            visibleIds.has(id)
        )
      );


    selectAllCheckbox.checked =
      false;


    selectAllCheckbox.indeterminate =
      false;


    renderList();

  }
);


// ============================================================
// CLEAR DATE
// ============================================================

clearDateButton.addEventListener(
  "click",
  () => {

    startDate = "";

    endDate = "";

    startInput.value = "";

    endInput.value = "";


    selectedIds.clear();


    selectAllCheckbox.checked =
      false;


    selectAllCheckbox.indeterminate =
      false;


    renderList();

  }
);


// ============================================================
// SEARCH
// ============================================================

searchInput.addEventListener(
  "input",
  () => {

    searchText =
      searchInput.value
        .trim()
        .toLowerCase();


    renderList();

  }
);


// ============================================================
// SELECT VISIBLE
// ============================================================

selectAllCheckbox.addEventListener(
  "change",
  () => {

    const filtered =
      getFilteredChats();


    if (
      selectAllCheckbox.checked
    ) {

      filtered.forEach(
        chat => {

          selectedIds.add(
            chat.id
          );

        }
      );

    } else {

      filtered.forEach(
        chat => {

          selectedIds.delete(
            chat.id
          );

        }
      );

    }


    renderList();

  }
);


// ============================================================
// DELETE SELECTED
// ============================================================

async function deleteSelected() {

  if (
    selectedIds.size === 0
  ) {

    return;

  }


  const count =
    selectedIds.size;


  let dateMessage =
    "";


  if (
    startDate ||
    endDate
  ) {

    dateMessage =
      `\n\nDate range:\n` +
      `${startDate || "Oldest"} → ` +
      `${endDate || "Newest"}`;

  }


  const confirmed =
    confirm(
      `Are you sure you want to delete ` +
      `${count} conversation(s)?` +
      dateMessage +
      `\n\nThis action cannot be easily undone.`
    );


  if (!confirmed) {

    return;

  }


  if (!accessToken) {

    accessToken =
      await getToken();

  }


  if (!accessToken) {

    return;

  }


  deleteButton.disabled =
    true;


  syncButton.disabled =
    true;


  const ids =
    [...selectedIds];


  let deleted =
    0;

  let failed =
    0;


  for (
    const id of ids
  ) {

    status.innerText =
      `Deleting ${deleted + failed + 1} / ${ids.length}...`;


    try {

      const response =
        await fetch(
          `/backend-api/conversation/${id}`,
          {

            method: "PATCH",

            headers: {

              Authorization:
                `Bearer ${accessToken}`,

              "Content-Type":
                "application/json"

            },

            body:
              JSON.stringify({
                is_visible: false
              })

          }
        );


      if (
        !response.ok
      ) {

        throw new Error(
          `HTTP ${response.status}`
        );

      }


      deleted++;


      // Remove locally
      allChats =
        allChats.filter(
          chat =>
            chat.id !== id
        );


      selectedIds.delete(
        id
      );


    } catch (error) {

      failed++;


      console.error(
        "Delete failed:",
        id,
        error
      );

    }


    // Small delay
    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          250
        )
    );

  }


  selectAllCheckbox.checked =
    false;


  selectAllCheckbox.indeterminate =
    false;


  renderList();


  syncButton.disabled =
    false;


  deleteButton.disabled =
    selectedIds.size === 0;


  alert(
    `Delete completed.\n\n` +
    `Deleted: ${deleted}\n` +
    `Failed: ${failed}`
  );

}


// ============================================================
// DELETE BUTTON
// ============================================================

deleteButton.addEventListener(
  "click",
  deleteSelected
);


// ============================================================
// SYNC BUTTON
// ============================================================

syncButton.addEventListener(
  "click",
  fetchAllChats
);


// ============================================================
// CLOSE
// ============================================================

closeButton.addEventListener(
  "click",
  () => {

    modal.style.display =
      "none";

  }
);


// ============================================================
// OPEN
// ============================================================

floatingButton.addEventListener(
  "click",
  async () => {

    if (
      modal.style.display ===
      "flex"
    ) {

      modal.style.display =
        "none";

      return;

    }


    modal.style.display =
      "flex";


    // Load automatically
    // if history isn't loaded.
    if (
      allChats.length === 0
    ) {

      await fetchAllChats();

    } else {

      renderList();

    }

  }
);


// ============================================================
// INITIAL
// ============================================================

console.log(
  "ChatGPT Bulk Delete Manager loaded."
);

console.log(
  "Date range + search + bulk delete enabled."
);