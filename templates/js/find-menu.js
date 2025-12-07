document.addEventListener("DOMContentLoaded", function () {
  // 1. CONFIGURATION
  const searchModalEl = document.getElementById("searchModal");
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("searchResults");
  const bsModal = new bootstrap.Modal(searchModalEl);

  let menuItems = [];

  // Fungsi Helper: Menentukan Kategori (Navbar vs Sidebar vs Submenu)
  function getCategory(link) {
    // Cek 1: Apakah di dalam Navbar Dropdown?
    const dropdownMenu = link.closest(".dropdown-menu");
    if (dropdownMenu) {
      const triggerId = dropdownMenu.getAttribute("aria-labelledby");
      const trigger = document.getElementById(triggerId);
      if (trigger) return "Navbar: " + trigger.textContent.trim();
      return "Navbar Submenu";
    }

    // Cek 2: Apakah di dalam Sidebar Accordion (Collapse)?
    const collapseMenu = link.closest(".collapse");
    if (collapseMenu && link.closest("#sidebar-wrapper")) {
      // Ganti ID sesuai sidebar anda
      // Cari tombol yang membuka collapse ini
      const collapseId = collapseMenu.id;
      const trigger = document.querySelector(
        `[href="#${collapseId}"], [data-bs-target="#${collapseId}"]`
      );
      if (trigger) return "Sidebar: " + trigger.textContent.trim();
    }

    // Cek 3: Tentukan Parent Utama
    if (link.closest(".navbar")) return "Navbar";
    if (link.closest("#sidebar-wrapper")) return "Sidebar"; // Ganti ID sesuai sidebar anda

    return "General";
  }

  // 2. INDEXING FUNCTION
  function indexMenuItems() {
    menuItems = [];

    // SELECTOR GABUNGAN:
    // 1. .navbar-nav .nav-link (Link Navbar)
    // 2. .dropdown-item (Submenu Navbar)
    // 3. #sidebar-wrapper a (Semua link di dalam Sidebar)
    const selectors =
      ".navbar-nav .nav-link, .dropdown-menu .dropdown-item, #sidebar-wrapper a";

    const links = document.querySelectorAll(selectors);

    links.forEach((link) => {
      // Abaikan link disabled, kosong, atau yang hanya berfungsi sebagai toggle (bukan link navigasi nyata)
      if (
        link.classList.contains("disabled") ||
        link.textContent.trim() === "" ||
        link.getAttribute("href") === "#" ||
        link.hasAttribute("data-bs-toggle")
      ) {
        // Abaikan parent toggle
        return;
      }

      const category = getCategory(link);

      menuItems.push({
        name: link.textContent.trim(),
        category: category,
        href: link.getAttribute("href"),
      });
    });
  }

  // 3. SEARCH LOGIC (Sama seperti sebelumnya)
  searchInput.addEventListener("input", function (e) {
    const query = e.target.value.toLowerCase();
    resultsContainer.innerHTML = "";

    if (query.length === 0) return;

    const filtered = menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      resultsContainer.innerHTML =
        '<div class="p-3 text-muted text-center">Tidak ada hasil ditemukan</div>';
      return;
    }

    filtered.forEach((item) => {
      const a = document.createElement("a");
      a.href = item.href;
      a.className = "list-group-item list-group-item-action";
      // Styling badge kategori
      let badgeClass = item.category.includes("Sidebar")
        ? "bg-primary"
        : "bg-secondary";

      a.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <span class="fw-bold">${item.name}</span>
                    <small class="badge ${badgeClass} bg-opacity-75">${item.category}</small>
                </div>
            `;
      a.addEventListener("click", () => bsModal.hide());
      resultsContainer.appendChild(a);
    });
  });

  // 4. HOTKEY LISTENER (Ctrl + K atau Ctrl + F)
  document.addEventListener("keydown", function (event) {
    // Ctrl + F (atau Ctrl + K yang umum dipakai untuk Command Palette)
    if (
      (event.ctrlKey || event.metaKey) &&
      (event.key === "f" || event.key === "k")
    ) {
      event.preventDefault();
      indexMenuItems(); // Re-index saat dibuka untuk memastikan data terbaru
      bsModal.show();
    }
  });

  // 5. AUTO FOCUS
  searchModalEl.addEventListener("shown.bs.modal", function () {
    searchInput.value = "";
    resultsContainer.innerHTML = "";
    searchInput.focus();
  });
});
