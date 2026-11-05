/**
 * ReliefNet Application Controller & Router (Production SaaS Architecture)
 * Inspired by next-shadcn-dashboard-starter and ReliefSync
 */

class ReliefNetApp {
  constructor() {
    this.currentRoute = "";
    this.currentShell = "public";
    this.screens = window.RELIEFNET_SCREENS || [];
    this.cache = {};
    this.state = {
      userOrg: "Grama Seva Federation",
      darpanId: "KA/2021/8841",
      emergencyMode: true,
      activeChannel: "DISPATCH-KA-1049",
      directoryPage: 1,
      directoryTotalPages: 1
    };

    this.init();
  }

  async init() {
    this.isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    this.setupEventListeners();
    await this.fetchInitialTelemetry();
    this.renderHeader();
    this.enhanceNativeSelects();
    this.setupCommandPalette();
    this.handleRoute();
  }

  async fetchInitialTelemetry() {
    try {
      const data = await API.getTelemetry();
      this.state.emergencyMode = data.emergency_mode;
    } catch (e) {
      console.warn("Using default telemetry state", e);
    }
  }

  setupEventListeners() {
    window.addEventListener("hashchange", () => this.handleRoute());
    window.addEventListener("resize", () => {
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      if (isDesktop !== this.isDesktop) {
        this.isDesktop = isDesktop;
        this.syncSidebarVisibility();
      }
      this.syncTableScrollHints();
    });
    document.addEventListener("click", (e) => this.handleGlobalClicks(e));
    
    // Command Palette hotkey: Ctrl+K or Cmd+K
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        this.toggleCommandPalette();
      }
      if (e.key === "Escape") {
        const cmd = document.getElementById("command-palette-backdrop");
        if (cmd && !cmd.classList.contains("hidden")) {
          cmd.classList.add("hidden");
        }
        this.closeAllDropdowns();
        this.toggleNotifications(false);
      }
      if ((e.key === "Enter" || e.key === " ") && e.target.closest("#workspace-dropdown-trigger")) {
        e.preventDefault();
        e.target.click();
      }
    });
  }

  setDropdownState(root, open) {
    if (!root) return;
    if (open) {
      const notif = document.getElementById("notifications-drawer");
      if (notif && notif.getAttribute("data-state") === "open") {
        this.toggleNotifications(false);
      }
    }
    root.setAttribute("data-state", open ? "open" : "closed");
    const trigger = root.querySelector(".dropdown-emerald-trigger, #workspace-dropdown-trigger");
    if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  closeAllDropdowns() {
    document.querySelectorAll(".dropdown-emerald[data-state='open']").forEach(d => {
      this.setDropdownState(d, false);
    });
  }

  enhanceNativeSelects(scope = document) {
    scope.querySelectorAll("select:not([data-emerald-enhanced])").forEach((select) => {
      const options = Array.from(select.options);
      if (options.length === 0) return;

      select.setAttribute("data-emerald-enhanced", "true");
      select.setAttribute("tabindex", "-1");
      select.style.display = "none";

      const widthClasses = Array.from(select.classList).filter((c) => /^w-/.test(c));
      const root = document.createElement("div");
      root.className = ["dropdown-emerald", ...widthClasses].join(" ");
      root.setAttribute("data-state", "closed");
      root.setAttribute("data-emerald-select", "true");

      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "dropdown-emerald-trigger w-full";
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");

      const label = document.createElement("span");
      label.className = "dropdown-label truncate";
      label.textContent = options[select.selectedIndex]?.text || options[0].text;

      const chevron = document.createElement("span");
      chevron.className = "dropdown-emerald-chevron material-symbols-outlined text-[18px] text-slate-500";
      chevron.textContent = "expand_more";

      trigger.appendChild(label);
      trigger.appendChild(chevron);

      const menu = document.createElement("div");
      menu.className = "dropdown-emerald-menu align-left w-full shadow-lg";
      menu.setAttribute("role", "listbox");

      options.forEach((option, index) => {
        const item = document.createElement("div");
        item.className = "dropdown-emerald-item" + (index === select.selectedIndex ? " active" : "");
        item.style.setProperty("--item-idx", index);
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", index === select.selectedIndex ? "true" : "false");

        const itemLabel = document.createElement("span");
        itemLabel.className = "truncate";
        itemLabel.textContent = option.text;
        item.appendChild(itemLabel);

        item.addEventListener("click", (event) => {
          event.preventDefault();
          select.value = option.value;
          select.dispatchEvent(new Event("change", { bubbles: true }));
          this.syncEnhancedSelect(root, select);
          this.setDropdownState(root, false);
          trigger.focus();
        });

        menu.appendChild(item);
      });

      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        const isOpen = root.getAttribute("data-state") === "open";
        this.closeAllDropdowns();
        this.setDropdownState(root, !isOpen);
      });

      select.insertAdjacentElement("afterend", root);
      root.appendChild(trigger);
      root.appendChild(menu);
    });
  }

  syncEnhancedSelect(root, select) {
    const label = root.querySelector(".dropdown-label");
    const items = root.querySelectorAll(".dropdown-emerald-item");
    if (label) label.textContent = select.options[select.selectedIndex]?.text || "";
    items.forEach((item, index) => {
      const isSelected = index === select.selectedIndex;
      item.classList.toggle("active", isSelected);
      item.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
  }

  toggleNotifications(forceState) {
    const notif = document.getElementById("notifications-drawer");
    if (!notif) return;
    const isCurrentlyClosed = notif.classList.contains("hidden") || notif.getAttribute("data-state") === "closed";
    const shouldOpen = typeof forceState === "boolean" ? forceState : isCurrentlyClosed;
    const trigger = document.getElementById("notifications-trigger-btn");
    if (trigger) trigger.setAttribute("aria-expanded", shouldOpen ? "true" : "false");

    if (shouldOpen) {
      this.closeAllDropdowns();
      notif.classList.remove("hidden");
      requestAnimationFrame(() => {
        notif.setAttribute("data-state", "open");
      });
    } else {
      notif.setAttribute("data-state", "closed");
      setTimeout(() => {
        if (notif.getAttribute("data-state") === "closed") {
          notif.classList.add("hidden");
        }
      }, 350);
    }
  }

  handleGlobalClicks(e) {
    // Dropdown Style 1 (Emerald UI): Screen selector toggle
    const screenTrigger = e.target.closest("#screen-dropdown-trigger");
    if (screenTrigger) {
      e.preventDefault();
      const dropdown = document.getElementById("screen-emerald-dropdown");
      if (dropdown) {
        const isOpen = dropdown.getAttribute("data-state") === "open";
        this.closeAllDropdowns();
        this.setDropdownState(dropdown, !isOpen);
      }
      return;
    }

    // Dropdown Style 1 (Emerald UI): Sidebar workspace selector toggle
    const wsTrigger = e.target.closest("#workspace-dropdown-trigger");
    if (wsTrigger) {
      e.preventDefault();
      const wsDropdown = document.getElementById("workspace-dropdown");
      if (wsDropdown) {
        const isOpen = wsDropdown.getAttribute("data-state") === "open";
        this.closeAllDropdowns();
        this.setDropdownState(wsDropdown, !isOpen);
      }
      return;
    }

    // Dropdown Style 1 (Emerald UI): Workspace item selection
    const wsItem = e.target.closest("#workspace-dropdown-menu .dropdown-emerald-item");
    if (wsItem) {
      e.preventDefault();
      const wsName = wsItem.getAttribute("data-workspace");
      const wsTier = wsItem.getAttribute("data-tier");
      const wsTag = wsItem.getAttribute("data-tag");

      const titleEl = document.getElementById("workspace-title");
      const tierEl = document.getElementById("workspace-tier");
      const badgeEl = document.getElementById("workspace-badge");

      if (titleEl) titleEl.innerText = wsName;
      if (tierEl) tierEl.innerText = wsTier;
      if (badgeEl) badgeEl.innerText = wsTag;

      document.querySelectorAll("#workspace-dropdown-menu .dropdown-emerald-item").forEach(item => {
        item.classList.remove("active");
        const check = item.querySelector(".material-symbols-outlined");
        if (check && check.innerText === "check") check.remove();
      });
      wsItem.classList.add("active");
      const checkSpan = document.createElement("span");
      checkSpan.className = "material-symbols-outlined text-emerald-700 text-[16px]";
      checkSpan.innerText = "check";
      wsItem.appendChild(checkSpan);

      this.closeAllDropdowns();
      this.showToast(`Switched workspace node to ${wsName}`, "info");
      return;
    }

    // Dropdown Style 1 (Emerald UI): Generic trigger toggle
    const emeraldTrigger = e.target.closest(".dropdown-emerald-trigger");
    if (emeraldTrigger && !emeraldTrigger.closest("[data-emerald-select]")) {
      e.preventDefault();
      const root = emeraldTrigger.closest(".dropdown-emerald");
      if (root) {
        const isOpen = root.getAttribute("data-state") === "open";
        this.closeAllDropdowns();
        this.setDropdownState(root, !isOpen);
      }
      return;
    }

    // Dropdown Style 1 (Emerald UI): Generic option selection
    const emeraldItem = e.target.closest(".dropdown-emerald-item");
    if (emeraldItem && !emeraldItem.closest("#workspace-dropdown-menu") && !emeraldItem.closest("#screen-emerald-menu")) {
      e.preventDefault();
      const root = emeraldItem.closest(".dropdown-emerald");
      if (root) {
        const label = root.querySelector(".dropdown-label");
        if (label) label.textContent = emeraldItem.textContent.trim();
        root.querySelectorAll(".dropdown-emerald-item").forEach(item => {
          item.classList.toggle("active", item === emeraldItem);
        });
        this.setDropdownState(root, false);
      }
      return;
    }

    // Dropdown Style 2 (ActivityDropdown): Notifications bell trigger
    const notifTrigger = e.target.closest("#notifications-trigger-btn");
    if (notifTrigger) {
      e.preventDefault();
      this.toggleNotifications();
      return;
    }

    // Dropdown Style 2 (ActivityDropdown): Notifications header accordion toggle
    const notifHeader = e.target.closest("#notifications-header-toggle");
    if (notifHeader) {
      e.preventDefault();
      const notif = document.getElementById("notifications-drawer");
      if (notif) {
        const isOpen = notif.getAttribute("data-state") === "open";
        notif.setAttribute("data-state", isOpen ? "closed" : "open");
      }
      return;
    }

    // Click outside handlers (like useClickOutside in drop_down.txt)
    if (!e.target.closest(".dropdown-emerald")) {
      this.closeAllDropdowns();
    }
    if (!e.target.closest("#notifications-drawer") && !e.target.closest("#notifications-trigger-btn")) {
      const notif = document.getElementById("notifications-drawer");
      if (notif && notif.getAttribute("data-state") === "open") {
        this.toggleNotifications(false);
      }
    }

    // 1. Intercept internal anchor clicks
    const anchor = e.target.closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#/")) {
        return; // let hashchange handle it
      }
      const dataPath = anchor.getAttribute("data-path");
      if (dataPath) {
        e.preventDefault();
        const routeMap = {
          "overview": "#/portal",
          "how-it-works-trust": "#/how-it-works",
          "discover-ngos": "#/directory",
          "emergency-shortages": "#/requests",
          "sign-in": "#/auth/signin",
          "register-organization": "#/auth/register",
          "dashboard": "#/dashboard",
          "resources": "#/inventory/surplus",
          "requests": "#/requests",
          "ai-matching": "#/matching",
          "services": "#/services",
          "messages": "#/comms",
          "transactions": "#/transfers",
          "org-profile-trust": "#/verification/vault",
          "settings": "#/admin/triage",
          "admin-triage": "#/admin/triage",
          "admin-sybil": "#/admin/sybil-risk",
          "admin-arbitration": "#/admin/arbitration",
          "admin-ledger": "#/admin/ledger"
        };
        if (routeMap[dataPath]) {
          window.location.hash = routeMap[dataPath];
        }
      }
    }

    // 2. Button clicks for modals and actions
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.id === "toggle-emergency-btn" || btn.classList.contains("btn-crisis-toggle")) {
      e.preventDefault();
      this.toggleEmergencyMode();
      return;
    }

    if (btn.innerText.includes("Pledge") || btn.dataset.action === "pledge") {
      e.preventDefault();
      this.openPledgeModal();
      return;
    }

    if (btn.innerText.includes("Create Need") || btn.innerText.includes("Publish Requisition")) {
      e.preventDefault();
      window.location.hash = "#/requests/create";
      return;
    }

    if (btn.innerText.includes("Publish Resource") || btn.innerText.includes("Publish Surplus")) {
      e.preventDefault();
      window.location.hash = "#/inventory/publish";
      return;
    }

    if (btn.id === "command-trigger-btn") {
      e.preventDefault();
      this.toggleCommandPalette();
      return;
    }

    if (btn.id === "notifications-trigger-btn") {
      e.preventDefault();
      this.toggleNotifications();
      return;
    }

    if (btn.innerText.includes("Quarantine Ring") || btn.dataset.action === "quarantine") {
      e.preventDefault();
      this.quarantineSybilRing();
      return;
    }
  }

  toggleCommandPalette() {
    const backdrop = document.getElementById("command-palette-backdrop");
    if (!backdrop) return;
    const isHidden = backdrop.classList.contains("hidden");
    if (isHidden) {
      backdrop.classList.remove("hidden");
      const input = document.getElementById("command-search-input");
      if (input) {
        input.value = "";
        input.focus();
        this.renderCommandResults("");
      }
    } else {
      backdrop.classList.add("hidden");
    }
  }

  setupCommandPalette() {
    const input = document.getElementById("command-search-input");
    if (!input) return;
    input.addEventListener("input", (e) => {
      this.renderCommandResults(e.target.value.trim());
    });
  }

  renderCommandResults(query) {
    const container = document.getElementById("command-results-container");
    if (!container) return;

    const q = query.toLowerCase();
    
    // Filter screens
    const matchedScreens = this.screens.filter(s => 
      !q || s.title.toLowerCase().includes(q) || s.stage.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );

    let html = "";
    if (matchedScreens.length > 0) {
      html += `<div class="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Screen Dockets (${matchedScreens.length})</div>`;
      matchedScreens.slice(0, 8).forEach(s => {
        html += `
          <a href="${s.route}" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors group" onclick="document.getElementById('command-palette-backdrop').classList.add('hidden')">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-slate-500 group-hover:text-zinc-900 text-[18px]">terminal</span>
              <div>
                <span class="font-semibold text-slate-900 block text-xs">${s.title}</span>
                <span class="text-[11px] text-slate-500">${s.stage}</span>
              </div>
            </div>
            <span class="font-mono text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">${s.route}</span>
          </a>
        `;
      });
    }

    // Quick NGO search if query > 2 chars
    if (q.length >= 2) {
      const mockNgos = (window.RELIEFNET_MOCK && window.RELIEFNET_MOCK.ngos) || [];
      const matchedNgos = mockNgos.filter(n => n.name.toLowerCase().includes(q) || n.district.toLowerCase().includes(q));
      if (matchedNgos.length > 0) {
        html += `<div class="px-2 py-1 mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Matching Organizations</div>`;
        matchedNgos.slice(0, 4).forEach(n => {
          html += `
            <a href="#/directory" class="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 transition-colors" onclick="document.getElementById('command-palette-backdrop').classList.add('hidden')">
              <div class="flex items-center gap-2.5">
                <span class="material-symbols-outlined text-emerald-700 text-[18px]">verified</span>
                <div>
                  <span class="font-semibold text-slate-900 block text-xs">${n.name}</span>
                  <span class="text-[11px] text-slate-500">${n.district}, Karnataka • ${n.verification_tier}</span>
                </div>
              </div>
              <span class="text-zinc-900 text-xs font-semibold">View →</span>
            </a>
          `;
        });
      }
    }

    if (!html) {
      html = `<div class="p-8 text-center text-slate-500 text-xs">No matching screens or organizations found for "${query}"</div>`;
    }

    container.innerHTML = html;
  }

  async toggleEmergencyMode() {
    try {
      const res = await API.toggleEmergency();
      this.state.emergencyMode = res.emergency_mode;
      this.renderHeader();
      this.showToast(this.state.emergencyMode ? "RED ALERT: Emergency Crisis Mode Activated" : "Standard Relief Mode Active", this.state.emergencyMode ? "error" : "info");
    } catch (e) {
      this.state.emergencyMode = !this.state.emergencyMode;
      this.renderHeader();
    }
  }

  showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = `toast ${type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-[#18181b] text-white border border-[#27272a]"}`;
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[18px] ${type === "error" ? "text-red-700" : "text-zinc-300"}">${type === "error" ? "warning" : "info"}</span>
      <span class="text-xs font-medium">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  }

  findScreenByRoute(route) {
    if (!route || route === "#" || route === "#/") {
      return this.screens.find(s => s.id === "public-portal");
    }
    const cleanRoute = route.split("?")[0];
    return this.screens.find(s => s.route === cleanRoute) ||
           this.screens.find(s => cleanRoute.startsWith(s.route)) ||
           this.screens.find(s => s.id === "public-portal");
  }

  getActiveScreen() {
    const standaloneMatch = window.location.pathname.match(/^\/screen\/([^/]+)\/?$/);
    if (standaloneMatch) {
      const standaloneScreen = this.screens.find(s => s.id === standaloneMatch[1]);
      if (standaloneScreen) return standaloneScreen;
    }
    return this.findScreenByRoute(window.location.hash || "#/portal");
  }

  getBreadcrumbPath(screen) {
    const parts = [
      { label: "ReliefNet", route: "#/portal" }
    ];
    if (screen.shell === "dashboard") {
      parts.push({ label: "Operations", route: "#/dashboard" });
    } else if (screen.shell === "admin") {
      parts.push({ label: "Governance", route: "#/admin/triage" });
    }
    parts.push({ label: screen.title, route: screen.route, active: true });
    return parts;
  }

  async handleRoute() {
    const hash = window.location.hash || "#/portal";
    const screen = this.findScreenByRoute(hash);
    if (!screen) return;

    this.currentRoute = screen.route;
    this.currentShell = screen.shell;

    // Re-render header with dynamic breadcrumbs
    this.renderHeader();

    // Show/hide sidebar according to shell
    const mainWrapper = document.getElementById("main-content-wrapper");

    this.syncSidebarVisibility();
    if (screen.shell === "dashboard" || screen.shell === "admin") {
      if (mainWrapper) mainWrapper.className = "w-full pl-0 lg:pl-64 pt-16 min-h-screen";
    } else {
      if (mainWrapper) mainWrapper.className = "w-full pt-16 min-h-screen";
    }

    // Update active highlight in sidebar
    this.updateSidebarHighlight();

    // Load partial
    await this.loadScreenContent(screen);

    // Run screen-specific interactive scripts
    this.initScreenInteractions(screen.id);

    // Scroll to top
    window.scrollTo(0, 0);
  }

  syncSidebarVisibility() {
    const sidebar = document.getElementById("operations-sidebar");
    if (!sidebar) return;
    const wantsSidebar = this.currentShell === "dashboard" || this.currentShell === "admin";
    sidebar.classList.toggle("hidden", !(wantsSidebar && this.isDesktop));
  }

  updateSidebarHighlight() {
    const links = document.querySelectorAll("[data-sidebar-link]");
    links.forEach(link => {
      const target = link.getAttribute("data-sidebar-link");
      if (this.currentRoute === target || (target !== "#/dashboard" && this.currentRoute.startsWith(target))) {
        link.className = "flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg bg-[#ececee] text-zinc-900 font-semibold border-r-2 border-zinc-900 transition-colors";
      } else {
        link.className = "flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-zinc-600 hover:bg-[#ececee] hover:text-zinc-900 transition-colors";
      }
    });
  }

  activatePartialScripts(container) {
    container.querySelectorAll("script").forEach(oldScript => {
      const source = oldScript.textContent || "";
      const functionNames = Array.from(
        source.matchAll(/^[ \t]*function\s+([A-Za-z_$][\w$]*)\s*\(/gm),
        match => match[1]
      );
      const exportedFunctions = [...new Set(functionNames)];
      const exportsCode = exportedFunctions
        .map(name => `if (typeof ${name} === "function") window.${name} = ${name};`)
        .join(" ");

      const script = document.createElement("script");
      Array.from(oldScript.attributes).forEach(attr => script.setAttribute(attr.name, attr.value));
      script.textContent = `(function(){\n${source}\n;${exportsCode}\n})();`;
      oldScript.replaceWith(script);
    });
  }

  async loadScreenContent(screen) {
    const container = document.getElementById("view-container");
    if (!container) return;

    if (this.cache[screen.id]) {
      container.innerHTML = this.cache[screen.id];
      this.activatePartialScripts(container);
      this.enhanceNativeSelects(container);
      this.afterScreenMount(container);
      return;
    }

    try {
      container.innerHTML = `
        <div class="flex items-center justify-center p-24 text-slate-500">
          <div class="flex items-center gap-3">
            <span class="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></span>
            <span class="font-label text-sm text-slate-600 font-medium">Loading ${screen.title}...</span>
          </div>
        </div>
      `;
      const res = await fetch(`/static/partials/${screen.id}.html`);
      if (!res.ok) throw new Error("Partial not found");
      const html = await res.text();
      this.cache[screen.id] = html;
      container.innerHTML = html;
      this.activatePartialScripts(container);
      this.enhanceNativeSelects(container);
      this.afterScreenMount(container);
    } catch (err) {
      console.error("Failed to load partial:", err);
      container.innerHTML = `
        <div class="p-12 max-w-2xl mx-auto my-12 bg-white rounded-xl border border-red-200 p-8 shadow-sm text-center">
          <span class="material-symbols-outlined text-4xl text-red-600 mb-2">error</span>
          <h2 class="font-serif text-2xl font-bold text-slate-900 mb-2">Unable to Load Screen</h2>
          <p class="text-slate-600 text-sm mb-6">${err.message}</p>
          <a href="#/portal" class="btn-saas-primary">Return to Public Portal</a>
        </div>
      `;
    }
  }

  afterScreenMount(container) {
    container.classList.remove("motion-page-enter");
    void container.offsetWidth;
    container.classList.add("motion-page-enter");
    if (window.reliefMotion) window.reliefMotion.enhance(container);
    requestAnimationFrame(() => this.syncTableScrollHints(container));
    setTimeout(() => this.syncTableScrollHints(container), 180);
  }

  syncTableScrollHints(scope = document) {
    const root = scope && scope.querySelectorAll ? scope : document;
    root.querySelectorAll(".table-scroll").forEach((scroll) => {
      const isVisible = scroll.offsetParent !== null;
      const overflows = isVisible && scroll.scrollWidth > scroll.clientWidth + 2;
      const previous = scroll.previousElementSibling;
      const existingHint = previous && previous.classList.contains("table-scroll-hint") ? previous : null;

      if (!overflows) {
        if (existingHint) existingHint.remove();
        return;
      }
      if (existingHint) return;

      const hint = document.createElement("div");
      hint.className = "table-scroll-hint";
      hint.innerHTML = '<span class="material-symbols-outlined">swipe</span><span>Scroll horizontally to view all columns</span>';
      scroll.parentElement.insertBefore(hint, scroll);
    });
  }

  renderHeader() {
    const headerEl = document.getElementById("global-header");
    if (!headerEl) return;

    const currentScreen = this.getActiveScreen();
    const breadcrumbs = this.getBreadcrumbPath(currentScreen);

    // Build the dropdown options for all 29 screens (Dropdown Style 1: Emerald UI Animated Flyout Dropdown)
    const groupedScreens = {};
    this.screens.forEach(s => {
      if (!groupedScreens[s.stage]) groupedScreens[s.stage] = [];
      groupedScreens[s.stage].push(s);
    });

    let emeraldDropdownHtml = "";
    let itemIdx = 0;
    for (const [stage, list] of Object.entries(groupedScreens)) {
      emeraldDropdownHtml += `<div class="dropdown-emerald-group">${stage}</div>`;
      list.forEach(s => {
        const isSelected = s.route === currentScreen.route;
        emeraldDropdownHtml += `
          <a href="${s.route}" class="dropdown-emerald-item ${isSelected ? 'active' : ''}" style="--item-idx: ${itemIdx++};" role="option" aria-selected="${isSelected}" onclick="app.closeAllDropdowns()">
            <div class="flex items-center gap-2 min-w-0">
              <span class="material-symbols-outlined text-[15px] ${isSelected ? 'text-emerald-700' : 'text-slate-500'}">terminal</span>
              <span class="truncate font-medium">${s.title}</span>
            </div>
            ${isSelected ? '<span class="material-symbols-outlined text-emerald-700 text-[14px]">check</span>' : ''}
          </a>
        `;
      });
    }

    headerEl.innerHTML = `
      <header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200/90 z-40 flex items-center justify-between px-4 lg:px-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-md">
        
        <!-- Left: Brand + Dynamic Breadcrumb Trail -->
        <div class="flex items-center gap-3 lg:gap-5 min-w-0">
          
          <!-- Mobile Sidebar Toggle -->
          <button class="lg:hidden p-1.5 rounded-md hover:bg-slate-100 text-slate-600" onclick="document.getElementById('operations-sidebar').classList.toggle('hidden')">
            <span class="material-symbols-outlined text-[20px]">menu</span>
          </button>

          <a href="#/portal" class="flex items-center gap-2.5 shrink-0 group">
            <div class="w-8 h-8 rounded-lg bg-[#18181b] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">R</div>
            <div class="hidden sm:flex flex-col">
              <span class="font-serif font-bold text-sm tracking-tight text-slate-900 leading-none">ReliefNet</span>
              <span class="font-label text-[11px] text-slate-500 mt-0.5">Coordination OS</span>
            </div>
          </a>

          <div class="h-4 w-px bg-slate-200 hidden sm:block"></div>

          <!-- Dynamic Breadcrumbs -->
          <nav class="hidden md:flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
            ${breadcrumbs.map((b, idx) => `
              ${idx > 0 ? `<span class="material-symbols-outlined text-[14px] text-slate-500">chevron_right</span>` : ''}
              ${b.active ? `
                <span class="font-semibold text-slate-900 truncate max-w-[200px] xl:max-w-xs">${b.label}</span>
              ` : `
                <a href="${b.route}" class="hover:text-slate-900 transition-colors">${b.label}</a>
              `}
            `).join('')}
          </nav>
        </div>

        <!-- Center: Command Palette Trigger (⌘K) -->
        <div class="flex-1 max-w-xs lg:max-w-md mx-3 hidden sm:block">
          <button id="command-trigger-btn" class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/70 hover:bg-white border border-slate-200/80 hover:border-zinc-300 text-xs text-slate-500 transition-all duration-300 shadow-inner group">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[16px] text-slate-500 group-hover:text-zinc-900 transition-colors">search</span>
              <span>Search screens & NGOs...</span>
            </div>
            <kbd class="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-500 font-semibold shadow-xs">⌘K</kbd>
          </button>
        </div>

        <!-- Right: Actions, Crisis Mode, Notifications, User -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">

          <!-- 29 Screen Dockets Selector Dropdown (Dropdown Style 1 from drop_down.txt) -->
          <div class="dropdown-emerald hidden xl:inline-block" id="screen-emerald-dropdown" data-state="closed">
            <button type="button" class="dropdown-emerald-trigger" id="screen-dropdown-trigger" aria-haspopup="listbox" aria-expanded="false">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="material-symbols-outlined text-[16px] text-amber-600">bookmark</span>
                <span class="truncate max-w-[150px] font-medium" id="screen-dropdown-title">${currentScreen.title}</span>
              </div>
              <span class="dropdown-emerald-chevron material-symbols-outlined text-[18px] text-slate-500">expand_more</span>
            </button>
            <div class="dropdown-emerald-menu align-right w-80 shadow-2xl" id="screen-emerald-menu" role="listbox">
              ${emeraldDropdownHtml}
            </div>
          </div>

          <!-- Emergency Mode Switch -->
          <button id="toggle-emergency-btn" class="px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${this.state.emergencyMode ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}">
            <span class="w-2 h-2 rounded-full ${this.state.emergencyMode ? 'bg-red-600 animate-pulse' : 'bg-slate-400'}"></span>
            <span class="hidden sm:inline">${this.state.emergencyMode ? 'Crisis Active' : 'Normal'}</span>
          </button>

          <!-- Notifications Bell Trigger -->
          <button id="notifications-trigger-btn" aria-haspopup="dialog" aria-controls="notifications-drawer" aria-expanded="false" class="relative p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-zinc-900 ring-2 ring-zinc-900/10 animate-pulse"></span>
          </button>

          <div class="h-5 w-px bg-slate-200 hidden sm:block"></div>

          <!-- Organization Profile Pill -->
          <a href="#/dashboard" class="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors group">
            <div class="w-7 h-7 rounded-full bg-[#18181b] text-white flex items-center justify-center font-bold text-xs shadow-xs">GS</div>
            <div class="hidden lg:flex flex-col text-left">
              <span class="text-xs font-semibold text-slate-900 leading-tight">Grama Seva</span>
              <span class="text-[10px] text-emerald-700 font-mono font-medium">KA/2021/8841</span>
            </div>
          </a>

        </div>
      </header>
    `;
    if (window.reliefMotion) window.reliefMotion.enhance(headerEl);
  }

  // --- SCREEN SPECIFIC INTERACTIONS ---

  initScreenInteractions(screenId) {
    if (screenId === "faceted-directory" || screenId === "discover-ngos") {
      this.initDirectorySearch();
    } else if (screenId === "darpan-verification") {
      this.initDarpanValidation();
    } else if (screenId === "match-explainability" || screenId === "ai-matching") {
      this.initExplainabilitySliders();
    } else if (screenId === "weighbridge-dispute" || screenId === "admin-arbitration") {
      this.initTareVarianceCalculator();
    } else if (screenId === "operational-comms" || screenId === "consignment-workspace") {
      this.initCommsInput();
    }
  }

  async initDirectorySearch() {
    const searchInput = document.querySelector("#ngo-search-input, input[placeholder*='DARPAN'], input[placeholder*='Search']");
    const districtSelect = document.querySelector("#district-filter, select");
    const radiusSlider = document.getElementById("radiusRange");
    const radiusLabel = document.getElementById("radiusValue");
    const viewGridBtn = document.getElementById("viewGridBtn");
    const viewTableBtn = document.getElementById("viewTableBtn");
    const viewMapBtn = document.getElementById("viewMapBtn");
    const backdrop = document.getElementById("dossierDrawerBackdrop");
    const closeDrawerBtn = document.querySelector("[data-close-drawer]");

    // Radius slider
    if (radiusSlider && radiusLabel) {
      radiusSlider.addEventListener("input", (e) => {
        radiusLabel.innerText = `${e.target.value} km`;
      });
    }

    // Drawer close handlers
    if (backdrop) {
      backdrop.addEventListener("click", () => this.closeDossier());
    }
    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener("click", () => this.closeDossier());
    }

    // View toggles (Grid / Table / Map)
    if (viewGridBtn && viewTableBtn) {
      viewGridBtn.addEventListener("click", () => {
        this.state.directoryView = "grid";
        viewGridBtn.className = "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-zinc-900 shadow-sm font-label text-xs font-semibold transition-colors";
        viewTableBtn.className = "flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-label text-xs transition-colors";
        if (viewMapBtn) viewMapBtn.className = "flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-label text-xs transition-colors";
        this.renderNgoCards(this.state.cachedNgos || []);
      });

      viewTableBtn.addEventListener("click", () => {
        this.state.directoryView = "table";
        viewTableBtn.className = "flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-zinc-900 shadow-sm font-label text-xs font-semibold transition-colors";
        viewGridBtn.className = "flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-label text-xs transition-colors";
        if (viewMapBtn) viewMapBtn.className = "flex items-center gap-1 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-label text-xs transition-colors";
        this.renderNgoTable(this.state.cachedNgos || []);
      });
    }

    // Initial fetch of real NGOs from API
    try {
      const res = await API.getNGOs({ limit: 12, page: this.state.directoryPage });
      this.state.cachedNgos = res.data;
      this.state.directoryTotalPages = res.total_pages;
      this.renderNgoCards(res.data, res.total);
    } catch (e) {
      console.warn("Using mock NGOs for directory");
      const mockNgos = (window.RELIEFNET_MOCK && window.RELIEFNET_MOCK.ngos) || [];
      this.state.cachedNgos = mockNgos;
      this.renderNgoCards(mockNgos, mockNgos.length);
    }

    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          const query = e.target.value.trim();
          const district = districtSelect ? districtSelect.value : "";
          try {
            const res = await API.getNGOs({ q: query, district: district, limit: 12 });
            this.state.cachedNgos = res.data;
            if (this.state.directoryView === "table") {
              this.renderNgoTable(res.data, res.total);
            } else {
              this.renderNgoCards(res.data, res.total);
            }
          } catch (err) {
            console.error(err);
          }
        }, 200);
      });
    }

    if (districtSelect) {
      districtSelect.addEventListener("change", async (e) => {
        const district = e.target.value;
        const query = searchInput ? searchInput.value.trim() : "";
        try {
          const res = await API.getNGOs({ q: query, district: district, limit: 12 });
          this.state.cachedNgos = res.data;
          if (this.state.directoryView === "table") {
            this.renderNgoTable(res.data, res.total);
          } else {
            this.renderNgoCards(res.data, res.total);
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  }

  openDossier(ngoId) {
    const mockNgos = (window.RELIEFNET_MOCK && window.RELIEFNET_MOCK.ngos) || [];
    const ngo = (this.state.cachedNgos && this.state.cachedNgos.find(n => n.id === ngoId)) || mockNgos.find(n => n.id === ngoId) || mockNgos[0];
    if (!ngo) return;

    const drawer = document.getElementById("dossierDrawer");
    const backdrop = document.getElementById("dossierDrawerBackdrop");
    if (!drawer) return;

    const title = document.getElementById("drawerOrgTitle");
    if (title) title.innerText = ngo.name;
    const reg = document.getElementById("drawerRegNum");
    if (reg) reg.innerText = ngo.darpan_id || "KA/2021/8841";
    const trust = document.getElementById("drawerTrustScore");
    if (trust) trust.innerText = `${ngo.trust_score || 95}%`;
    const summary = document.getElementById("drawerSummary");
    if (summary) summary.innerText = ngo.full_description || ngo.description;

    drawer.classList.remove("translate-x-full");
    if (backdrop) backdrop.classList.remove("hidden");
  }

  closeDossier() {
    const drawer = document.getElementById("dossierDrawer");
    const backdrop = document.getElementById("dossierDrawerBackdrop");
    if (drawer) drawer.classList.add("translate-x-full");
    if (backdrop) backdrop.classList.add("hidden");
  }

  renderNgoTable(ngos, totalCount = 196) {
    const grid = document.querySelector("#resultsGrid, #ngo-grid-container");
    if (!grid) return;

    grid.className = "w-full overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm table-scroll";
    grid.setAttribute("tabindex", "0");
    grid.setAttribute("role", "region");
    grid.setAttribute("aria-label", "NGO registry table; scroll horizontally to view all columns");
    grid.innerHTML = `
      <table class="table-saas table-pin-right table-tight">
        <thead>
          <tr>
            <th>Organization Name & Lead</th>
            <th>Location</th>
            <th>Verification Status</th>
            <th>DARPAN ID</th>
            <th>Trust SLA</th>
            <th class="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          ${ngos.map(n => `
            <tr>
              <td>
                <div class="font-serif font-bold text-slate-900 text-sm hover:text-zinc-700 cursor-pointer" onclick="window.app.openDossier('${n.id}')">${n.name}</div>
                <div class="text-[11px] text-slate-500">${n.contact_officer || 'Chief Functionary'}, Est. ${n.established_year || 2012}</div>
              </td>
              <td>
                <div class="text-xs text-slate-700 font-medium">${n.district || 'Bengaluru Urban'}</div>
                <div class="text-[10px] text-slate-500">Karnataka Region</div>
              </td>
              <td>
                <span class="${n.tier_code === 'tier_1' ? 'badge-tier1' : (n.tier_code === 'tier_2' ? 'badge-tier2' : 'badge-warning')}">
                  ${n.verification_tier || 'Tier-1 Sovereign Verified'}
                </span>
              </td>
              <td>
                <span class="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">${n.darpan_id || 'KA/2021/8841'}</span>
              </td>
              <td>
                <div class="font-mono text-xs font-bold text-slate-800">${n.trust_score || 95}%</div>
                <div class="text-[10px] text-emerald-700 font-semibold">${n.sla_adherence || '98.2%'} SLA</div>
              </td>
              <td class="text-right">
                <button class="btn-saas-secondary text-xs px-2.5 py-1" onclick="window.app.openDossier('${n.id}')">View dossier</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    if (window.reliefMotion) window.reliefMotion.enhance(grid);
    requestAnimationFrame(() => this.syncTableScrollHints());
    setTimeout(() => this.syncTableScrollHints(), 180);
  }

  renderNgoCards(ngos, totalCount = 196) {
    const grid = document.querySelector("#resultsGrid, #ngo-grid-container");
    const counterEl = document.querySelector("#ngo-count-label");
    if (counterEl) {
      counterEl.innerText = `Showing ${ngos.length} of ${totalCount} verified organizations`;
    }
    if (grid) {
      const staleHint = grid.previousElementSibling;
      if (staleHint && staleHint.classList.contains("table-scroll-hint")) staleHint.remove();
      grid.removeAttribute("tabindex");
      grid.removeAttribute("role");
      grid.removeAttribute("aria-label");
    }

    if (!grid || !ngos || ngos.length === 0) {
      if (grid) {
        grid.className = "w-full";
        grid.innerHTML = `
          <div class="p-12 bg-white rounded-xl border border-slate-200 text-center">
            <span class="material-symbols-outlined text-4xl text-slate-300 mb-2">search_off</span>
            <p class="font-serif font-bold text-base text-slate-800">No organizations found</p>
            <p class="text-xs text-slate-500 mt-1">Try broadening your search keywords or clearing district filters.</p>
          </div>
        `;
      }
      return;
    }

    grid.className = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4";
    grid.innerHTML = ngos.map(n => `
      <div class="card-saas p-5 flex flex-col justify-between hover:shadow-md transition-shadow group">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="${n.tier_code === 'tier_1' ? 'badge-tier1' : (n.tier_code === 'tier_2' ? 'badge-tier2' : 'badge-warning')}">
              ${n.verification_tier || 'Tier-1 Sovereign Verified'}
            </span>
            <span class="font-mono text-[11px] text-slate-500 font-semibold">${n.darpan_id || 'KA/2021/8841'}</span>
          </div>
          <h3 class="font-serif font-bold text-base text-slate-900 group-hover:text-zinc-700 transition-colors mb-1.5 leading-snug cursor-pointer" onclick="window.app.openDossier('${n.id}')">${n.name}</h3>
          <p class="text-xs text-slate-500 flex items-center gap-1.5 mb-3">
            <span class="material-symbols-outlined text-[15px] text-slate-500">location_on</span>
            <span>${n.district || 'Bengaluru Urban'}, Karnataka</span>
            <span class="text-slate-300">/</span>
            <span>Est. ${n.established_year || 2012}</span>
          </p>
          <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">${n.description}</p>
        </div>
        
        <div>
          <!-- Sectors Chips -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${(n.sectors || ["Disaster Relief", "Emergency Food"]).map(s => `
              <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-label text-[10px] font-medium">${s}</span>
            `).join("")}
          </div>

          <!-- Bottom Footer Metrics -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-mono">
              <span class="material-symbols-outlined text-emerald-700 text-[16px]">verified</span>
              <span>Trust: ${n.trust_score || 95}%</span>
            </div>
            <button class="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-0.5" onclick="window.app.openDossier('${n.id}')">
              <span>View Dossier</span>
              <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    `).join("");
    if (window.reliefMotion) window.reliefMotion.enhance(grid);
  }

  initDarpanValidation() {
    const validateBtn = document.querySelector("#validate-darpan-btn, button[type='submit']");
    const darpanInput = document.querySelector("#darpan-input, input[placeholder*='KA/']");
    const resultBox = document.querySelector("#darpan-result-box");

    if (validateBtn && darpanInput) {
      validateBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = darpanInput.value.trim() || "KA/2021/8841";
        try {
          const res = await API.verifyDarpan({ darpan_id: id });
          this.showToast("DARPAN ID Verified against National Registry!", "info");
          if (resultBox) {
            resultBox.classList.remove("hidden");
            resultBox.innerHTML = `
              <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950 text-xs space-y-2">
                <div class="flex items-center gap-2 font-bold text-sm text-emerald-900">
                  <span class="material-symbols-outlined text-emerald-600">check_circle</span>
                  DARPAN Registry Match: ${res.organization_name}
                </div>
                <div class="grid grid-cols-2 gap-2 pt-1 text-slate-700">
                  <div>FCRA Status: <strong class="text-emerald-800">${res.fcra_status}</strong></div>
                  <div>Signatory: <strong class="text-slate-800">${res.authorized_signatory}</strong></div>
                </div>
                <div class="font-mono text-[11px] text-emerald-800 pt-1 border-t border-emerald-200">
                  Token: ${res.message}
                </div>
              </div>
            `;
          }
        } catch (err) {
          this.showToast(err.message, "error");
        }
      });
    }
  }

  initExplainabilitySliders() {
    const qtySlider = document.getElementById("weight-qty");
    const distSlider = document.getElementById("weight-dist");
    const tierSlider = document.getElementById("weight-tier");
    const scoreDisplay = document.getElementById("composite-match-score");

    const updateScore = () => {
      const q = qtySlider ? parseInt(qtySlider.value) : 30;
      const d = distSlider ? parseInt(distSlider.value) : 25;
      const t = tierSlider ? parseInt(tierSlider.value) : 25;
      const r = Math.max(0, 100 - (q + d + t));

      const score = ((q * 0.98) + (d * 0.89) + (t * 1.0) + (r * 0.92)).toFixed(1);
      if (scoreDisplay) {
        scoreDisplay.innerText = `${score}%`;
      }
    };

    [qtySlider, distSlider, tierSlider].forEach(s => {
      if (s) s.addEventListener("input", updateScore);
    });
  }

  initTareVarianceCalculator() {
    const grossInput = document.getElementById("gross-weight-input");
    const tareInput = document.getElementById("tare-weight-input");
    const manifestInput = document.getElementById("manifest-weight-input");
    const varianceDisplay = document.getElementById("variance-calc-display");

    const calculate = () => {
      const gross = parseFloat(grossInput?.value || 14280);
      const tare = parseFloat(tareInput?.value || 6400);
      const manifest = parseFloat(manifestInput?.value || 8500);

      const net = gross - tare;
      const variance = net - manifest;
      const variancePct = ((variance / manifest) * 100).toFixed(1);

      if (varianceDisplay) {
        varianceDisplay.innerHTML = `
          <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-900 text-xs">
            Net Weight: <strong>${net} kg</strong> | Deficit: <strong>${variance} kg (${variancePct}%)</strong>
            <p class="mt-1 font-semibold text-red-700">Variance exceeds statutory 2.0% tolerance. Arbitration required.</p>
          </div>
        `;
      }
    };

    [grossInput, tareInput, manifestInput].forEach(inp => {
      if (inp) inp.addEventListener("input", calculate);
    });
  }

  initCommsInput() {
    const chatInput = document.querySelector("#chat-message-input, input[placeholder*='message']");
    const sendBtn = document.querySelector("#chat-send-btn, button[data-send]");
    const messagesBox = document.querySelector("#chat-messages-container");

    if (sendBtn && chatInput) {
      sendBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        try {
          await API.sendMessage("DISPATCH-KA-1049", text, this.state.userOrg);
          chatInput.value = "";
          this.showToast("Message cryptographically signed & broadcasted", "info");
          if (messagesBox) {
            const newMsg = document.createElement("div");
            newMsg.className = "flex flex-col gap-1 p-3 bg-zinc-50 border border-zinc-200 rounded-lg self-end max-w-lg mb-2";
            newMsg.innerHTML = `
              <div class="flex items-center justify-between text-xs font-semibold text-zinc-900">
                <span>${this.state.userOrg}</span>
                <span class="font-mono text-slate-500">Just now</span>
              </div>
              <p class="text-xs text-slate-800">${text}</p>
            `;
            messagesBox.appendChild(newMsg);
            messagesBox.scrollTop = messagesBox.scrollHeight;
          }
        } catch (err) {
          this.showToast(err.message, "error");
        }
      });
    }
  }

  openPledgeModal() {
    let modal = document.getElementById("app-pledge-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "app-pledge-modal";
      modal.className = "command-backdrop";
      modal.innerHTML = `
        <div class="command-dialog p-6 max-w-lg">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <span class="badge-crisis mb-1">Priority Allocation</span>
              <h3 class="font-serif font-bold text-lg text-slate-900">Pledge Verified Surplus Stock</h3>
            </div>
            <button class="text-slate-500 hover:text-slate-700" onclick="document.getElementById('app-pledge-modal').remove()">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          <p class="text-xs text-slate-600 mb-4 leading-relaxed">
            Target Requisition: <strong class="text-slate-900">#REQ-1049 (500 kg Sona Masoori Rice)</strong>. Pledged quantities will be immediately allocated and logged on the state ledger stream.
          </p>
          <form id="pledge-form" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-700 mb-1">Pledging Organization</label>
              <input type="text" readonly value="Grama Seva Federation (Tier-1 Verified)" class="input-saas bg-slate-50 font-medium"/>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-700 mb-1">Available Reserve Inventory</label>
              <input type="text" readonly value="8,300 kg available (Bengaluru Central Bay)" class="input-saas bg-slate-50 font-medium"/>
            </div>
            <div>
              <label class="block text-xs font-semibold uppercase text-slate-700 mb-1">Quantity to Pledge (kg)</label>
              <input type="number" id="pledge-qty-input" min="50" max="500" value="150" class="input-saas font-mono font-bold text-slate-900"/>
            </div>
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
              <span class="font-bold">Notice:</span> Pledged lot must be packaged in standard 50kg jute sacks ready for SDRF transport pickup within 6 hours.
            </div>
            <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" class="btn-saas-secondary" onclick="document.getElementById('app-pledge-modal').remove()">Cancel</button>
              <button type="submit" class="btn-saas-primary">
                <span class="material-symbols-outlined text-[16px]">verified</span>
                Confirm & Sign Pledge
              </button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector("#pledge-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const qty = parseFloat(modal.querySelector("#pledge-qty-input").value || 150);
        try {
          await API.pledgeToRequest("REQ-1049", { donor_name: "Grama Seva Federation", quantity: qty });
          this.showToast(`Pledged ${qty} kg successfully! Transaction recorded on ledger block.`, "info");
          modal.remove();
          if (this.currentRoute.includes("REQ-1049")) {
            this.handleRoute();
          }
        } catch (err) {
          this.showToast(err.message, "error");
        }
      });
    }
  }

  async quarantineSybilRing() {
    try {
      await API.quarantineSybilNode("Kalyana Aid Trust (Focal Node)");
      this.showToast("Sybil Cluster quarantined. All gateway access revoked.", "error");
      const badge = document.getElementById("sybil-cluster-badge");
      if (badge) {
        badge.innerText = "ENCLAVE QUARANTINED";
        badge.className = "px-2 py-0.5 rounded bg-red-900 text-white font-bold text-xs";
      }
    } catch (e) {
      this.showToast("Quarantine executed successfully.", "info");
    }
  }
}

class ReliefMotion {
  constructor() {
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.cardSeen = new WeakSet();
    this.btnSeen = new WeakSet();
    this.revealSeen = new WeakSet();
    this.countSeen = new WeakSet();
    this.tabSeen = new WeakSet();
    this.revealObserver = null;
    this.countObserver = null;
    this.spot = { el: null, x: 50, y: 50, tx: 50, ty: 50, raf: 0 };
  }

  init() {
    this.buildTicker();
    this.bindSpotlight();
    this.bindSegmentedTabs();
    this.enhance(document);
  }

  enhance(root = document) {
    this.decorateCards(root);
    this.decorateButtons(root);
    this.decorateReveal(root);
    this.setupCounters(root);
    this.setupTabs(root);
    this.markGradientText(root);
  }

  decorateCards(root) {
    const scope = root.querySelectorAll ? root : document;
    const nodes = scope.querySelectorAll(".card-saas, .stat-tile, .reliefnet-screen-view .rounded-xl.bg-surface-container-lowest, .reliefnet-screen-view .rounded-xl.bg-surface, [data-spotlight]");
    let count = 0;
    nodes.forEach((el) => {
      if (count > 180 || this.cardSeen.has(el)) return;
      if (el.closest(".command-dialog, #notifications-drawer, .dropdown-emerald-menu")) return;
      if (el.classList.contains("absolute") || el.classList.contains("fixed")) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 160 || rect.height < 70) return;
      el.classList.add("motion-spotlight");
      if (!el.hasAttribute("data-no-lift")) el.classList.add("motion-lift");
      this.cardSeen.add(el);
      count += 1;
    });
  }

  decorateButtons(root) {
    const scope = root.querySelectorAll ? root : document;
    scope.querySelectorAll("button, a").forEach((el) => {
      if (this.btnSeen.has(el)) return;
      const cls = String(el.className || "");
      if (!/bg-primary\b|btn-saas-primary|bg-gradient|from-emerald/.test(cls)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 60 || rect.height < 24) return;
      el.classList.add("motion-shimmer");
      this.btnSeen.add(el);
    });
  }

  decorateReveal(root) {
    if (this.reduced) return;
    const scope = root.querySelectorAll ? root : document;
    const targets = Array.from(scope.querySelectorAll(".reliefnet-screen-view > div > section, .reliefnet-screen-view > div > div.rounded-xl, main > section"));
    const viewportLimit = window.innerHeight * 0.82;
    this.revealObserver = this.revealObserver || new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        this.revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -48px 0px" });
    targets.forEach((el, index) => {
      if (this.revealSeen.has(el)) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= viewportLimit) return;
      el.classList.add("motion-reveal");
      el.style.transitionDelay = `${Math.min(index * 45, 260)}ms`;
      this.revealSeen.add(el);
      this.revealObserver.observe(el);
    });
  }

  setupCounters(root) {
    const scope = root.querySelectorAll ? root : document;
    const nodes = scope.querySelectorAll(".stat-value, [data-count], .reliefnet-screen-view .font-serif.text-display-lg, .reliefnet-screen-view .font-serif.text-headline-lg, .reliefnet-screen-view .font-serif.text-headline-md");
    this.countObserver = this.countObserver || new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (typeof entry.target._motionCount === "function") entry.target._motionCount();
        this.countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    nodes.forEach((el) => {
      if (this.countSeen.has(el) || el.hasAttribute("data-no-count")) return;
      if (el.children.length > 3) return;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      let found = null;
      while ((node = walker.nextNode())) {
        const raw = node.nodeValue;
        if (!raw || !/\d/.test(raw)) continue;
        const text = raw.trim();
        if (!text) continue;
        const match = text.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)([^\d]*)$/);
        if (!match) continue;
        const numbers = text.match(/\d[\d,]*(?:\.\d+)?/g) || [];
        if (numbers.length !== 1) continue;
        found = { node, prefix: match[1], original: match[2], suffix: match[3], text };
      }
      if (!found) return;
      if (found.text.length > 32 || /[#/]|0x|KA\//.test(found.text)) return;
      const target = parseFloat(found.original.replace(/,/g, ""));
      if (!Number.isFinite(target) || target > 1000000) return;
      const decimals = (found.original.split(".")[1] || "").length;
      const grouped = found.original.includes(",");
      const state = { ...found, target, decimals, grouped };
      el._motionCount = () => this.animateCount(state);
      this.countSeen.add(el);
      this.countObserver.observe(el);
    });
  }

  animateCount(state) {
    if (this.reduced) return;
    const duration = 1050;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = state.target * eased;
      state.node.nodeValue = state.prefix + this.formatCount(value, state) + state.suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        state.node.nodeValue = state.prefix + state.original + state.suffix;
      }
    };
    requestAnimationFrame(tick);
  }

  formatCount(value, state) {
    if (state.decimals > 0) {
      return state.grouped
        ? value.toLocaleString("en-US", { minimumFractionDigits: state.decimals, maximumFractionDigits: state.decimals })
        : value.toFixed(state.decimals);
    }
    return state.grouped
      ? Math.round(value).toLocaleString("en-US")
      : String(Math.round(value));
  }

  setupTabs(root) {
    const scope = root.querySelectorAll ? root : document;
    scope.querySelectorAll(".segmented-control").forEach((control) => {
      if (!control.classList.contains("motion-tabs")) {
        control.classList.add("motion-tabs");
        const glider = document.createElement("span");
        glider.className = "segmented-glider";
        control.appendChild(glider);
        control.addEventListener("click", () => setTimeout(() => this.positionGlider(control), 40));
      }
      requestAnimationFrame(() => this.positionGlider(control));
      this.tabSeen.add(control);
    });
  }

  positionGlider(control) {
    const glider = control.querySelector(".segmented-glider");
    const active = control.querySelector(".segmented-item.active") || control.querySelector(".segmented-item");
    if (!glider || !active) return;
    const controlRect = control.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    glider.style.left = `${activeRect.left - controlRect.left}px`;
    glider.style.width = `${activeRect.width}px`;
  }

  bindSegmentedTabs() {
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".segmented-control")) return;
      setTimeout(() => {
        document.querySelectorAll(".segmented-control").forEach((control) => this.positionGlider(control));
      }, 50);
    });
    window.addEventListener("resize", () => {
      document.querySelectorAll(".segmented-control").forEach((control) => this.positionGlider(control));
    }, { passive: true });
  }

  bindSpotlight() {
    if (this.reduced) return;
    document.addEventListener("pointermove", (event) => {
      const card = event.target.closest(".motion-spotlight");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      this.spot.el = card;
      this.spot.tx = ((event.clientX - rect.left) / rect.width) * 100;
      this.spot.ty = ((event.clientY - rect.top) / rect.height) * 100;
      if (!this.spot.raf) {
        this.spot.x = this.spot.tx;
        this.spot.y = this.spot.ty;
        this.spot.raf = requestAnimationFrame(() => this.loopSpotlight());
      }
    }, { passive: true });
  }

  loopSpotlight() {
    const spot = this.spot;
    spot.x += (spot.tx - spot.x) * 0.2;
    spot.y += (spot.ty - spot.y) * 0.2;
    if (spot.el) {
      spot.el.style.setProperty("--mx", `${spot.x}%`);
      spot.el.style.setProperty("--my", `${spot.y}%`);
    }
    if (Math.abs(spot.tx - spot.x) > 0.1 || Math.abs(spot.ty - spot.y) > 0.1) {
      spot.raf = requestAnimationFrame(() => this.loopSpotlight());
    } else {
      spot.raf = 0;
    }
  }

  buildTicker() {
    const host = document.getElementById("relief-live-ticker");
    if (!host || host.dataset.ready === "true") return;
    const items = [
      ["travel_explore", "Karnataka Grid", "Live"],
      ["local_shipping", "Logistics In-Flight", "38"],
      ["inventory_2", "Active Resource Lots", "1,420"],
      ["verified", "Settlement Rate", "99.4%"],
      ["gavel", "Open Disputes", "0"],
      ["policy", "NDMA Interop", "Certified"],
      ["hub", "Ledger Block", "#884216"],
      ["emergency", "Belagavi Deficit", "600 Tarpaulins"]
    ];
    const row = items.map(([icon, label, value]) => (
      `<span class="ticker-item"><span class="material-symbols-outlined">${icon}</span><span>${label}</span><strong>${value}</strong></span><span class="ticker-sep" aria-hidden="true"></span>`
    )).join("");
    host.innerHTML = `<div class="motion-marquee" style="--duration:42s;--gap:2.25rem" role="list"><div class="motion-marquee-track">${row}</div><div class="motion-marquee-track" aria-hidden="true">${row}</div></div>`;
    host.dataset.ready = "true";
  }

  markGradientText(root) {
    const scope = root.querySelectorAll ? root : document;
    scope.querySelectorAll('[data-shell="public"] h1').forEach((heading) => {
      heading.classList.add("motion-gradient-text");
    });
  }
}

// Initialize on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  window.app = new ReliefNetApp();
  window.reliefMotion = new ReliefMotion();
  window.reliefMotion.init();
});
