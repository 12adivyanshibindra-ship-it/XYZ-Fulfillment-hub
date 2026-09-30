// app.js - Main Application Controller for XYZ Fulfillment Hub

class FulfillmentApp {
  constructor() {
    this.store = window.xyzStore;
    this.audio = window.xyzAudio;
    this.currentFilter = "all";
    this.searchQuery = "";
    this.activeMobileTab = "To Pick";
    this.activeFlaggingOrderId = null;
    this.activeInspectOrderId = null;

    this.initElements();
    this.bindEvents();
    this.startSlaTicker();
    this.render();
  }

  initElements() {
    // Columns
    this.colToPick = document.getElementById("cards-to-pick");
    this.colPacking = document.getElementById("cards-packing");
    this.colStaged = document.getElementById("cards-staged");
    this.colShipped = document.getElementById("cards-shipped");
    this.colIssue = document.getElementById("cards-issue");

    // Count Badges
    this.badgeToPick = document.getElementById("badge-to-pick");
    this.badgePacking = document.getElementById("badge-packing");
    this.badgeStaged = document.getElementById("badge-staged");
    this.badgeShipped = document.getElementById("badge-shipped");
    this.badgeIssue = document.getElementById("badge-issue");

    // Top KPIs
    this.kpiTotal = document.getElementById("kpi-total");
    this.kpiPriority = document.getElementById("kpi-priority");
    this.kpiDelayed = document.getElementById("kpi-delayed");
    this.kpiIssues = document.getElementById("kpi-issues");

    // Controls
    this.searchInput = document.getElementById("search-input");
    this.filterSelect = document.getElementById("filter-select");
    this.btnSoundToggle = document.getElementById("btn-sound-toggle");
    this.btnContrastToggle = document.getElementById("btn-contrast-toggle");
    this.btnAddPriority = document.getElementById("btn-add-priority");
    this.btnAddRegular = document.getElementById("btn-add-regular");
    this.btnToggleDelay = document.getElementById("btn-toggle-delay");
    this.btnResetData = document.getElementById("btn-reset-data");
    this.btnOpenScanner = document.getElementById("btn-open-scanner");

    // Modals
    this.flagModal = document.getElementById("flag-issue-modal");
    this.btnCloseFlagModal = document.getElementById("btn-close-flag-modal");
    this.flagOrderIdLabel = document.getElementById("flag-modal-order-id");
    this.flagCustomInput = document.getElementById("flag-custom-text");
    this.btnSubmitCustomFlag = document.getElementById("btn-submit-custom-flag");

    this.scannerModal = document.getElementById("scanner-modal");
    this.btnCloseScannerModal = document.getElementById("btn-close-scanner-modal");
    this.scannerInput = document.getElementById("scanner-input");
    this.btnSimulateScan = document.getElementById("btn-simulate-scan");
    this.scannerResults = document.getElementById("scanner-results");

    // Mobile Tabs
    this.mobileTabs = document.querySelectorAll(".mobile-tab-btn");

    // Toasts
    this.toastContainer = document.getElementById("toast-container");
  }

  bindEvents() {
    // Search & Filter
    this.searchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.render();
    });

    this.filterSelect.addEventListener("change", (e) => {
      this.currentFilter = e.target.value;
      this.render();
    });

    // Sound toggle
    this.btnSoundToggle.addEventListener("click", () => {
      const isSound = this.audio.toggleSound();
      this.updateSoundButtonUI(isSound);
      this.showToast(isSound ? "🔊 Sound Alerts Enabled" : "🔇 Sound Alerts Muted");
    });
    this.updateSoundButtonUI(this.audio.isSoundEnabled());

    // Contrast toggle
    this.btnContrastToggle.addEventListener("click", () => {
      const isHighContrast = document.body.classList.toggle("high-contrast-mode");
      localStorage.setItem("xyz_hub_contrast_v1", isHighContrast ? "true" : "false");
      this.btnContrastToggle.classList.toggle("active", isHighContrast);
      this.showToast(isHighContrast ? "🌙 High-Contrast Dark Mode Activated" : "☀️ Standard Light Mode Activated");
    });
    if (localStorage.getItem("xyz_hub_contrast_v1") === "true") {
      document.body.classList.add("high-contrast-mode");
      this.btnContrastToggle.classList.add("active");
    }

    // Add orders
    this.btnAddPriority.addEventListener("click", () => {
      const newOrder = this.store.createRandomOrder(true);
      this.audio.playDelayedAlert();
      this.showToast(`⚡ Priority Order ${newOrder.id} Received! Floated to Top.`);
      this.render();
    });

    this.btnAddRegular.addEventListener("click", () => {
      const newOrder = this.store.createRandomOrder(false);
      this.audio.playClick();
      this.showToast(`📋 Regular Order ${newOrder.id} Received.`);
      this.render();
    });

    // Toggle Delay Test (Allows testing flashing red immediately)
    this.btnToggleDelay.addEventListener("click", () => {
      const toPickOrders = this.store.orders.filter(o => o.status === "To Pick");
      if (toPickOrders.length > 0) {
        toPickOrders[0].isForceDelayed = !toPickOrders[0].isForceDelayed;
        this.store.saveOrders(this.store.orders);
        this.audio.playDelayedAlert();
        this.showToast(toPickOrders[0].isForceDelayed ? `⚠️ Order ${toPickOrders[0].id} Marked DELAYED (Red Flash On)` : `Order ${toPickOrders[0].id} Delay Cleared`);
        this.render();
      }
    });

    // Reset data
    this.btnResetData.addEventListener("click", () => {
      if (confirm("Reset all orders and inventory back to initial demo dataset?")) {
        this.store.resetAllData();
        this.showToast("🔄 Warehouse dataset reset to default state.");
        this.render();
      }
    });

    // Mobile tabs
    this.mobileTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        this.activeMobileTab = tab.dataset.lane;
        this.mobileTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.renderMobileLanes();
      });
    });

    // Flag Modal
    this.btnCloseFlagModal.addEventListener("click", () => this.closeFlagModal());
    this.flagModal.addEventListener("click", (e) => {
      if (e.target === this.flagModal) this.closeFlagModal();
    });

    // Common issue buttons
    document.querySelectorAll(".btn-issue-choice").forEach(btn => {
      btn.addEventListener("click", () => {
        const reason = btn.dataset.reason;
        this.commitFlagIssue(reason);
      });
    });

    this.btnSubmitCustomFlag.addEventListener("click", () => {
      const text = this.flagCustomInput.value.trim();
      if (text) {
        this.commitFlagIssue(text);
      } else {
        alert("Please enter a brief description of the issue.");
      }
    });

    // Scanner Modal
    this.btnOpenScanner.addEventListener("click", () => this.openScannerModal());
    this.btnCloseScannerModal.addEventListener("click", () => this.closeScannerModal());
    this.scannerModal.addEventListener("click", (e) => {
      if (e.target === this.scannerModal) this.closeScannerModal();
    });

    this.btnSimulateScan.addEventListener("click", () => {
      this.handleScanInput(this.scannerInput.value.trim());
    });
    this.scannerInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.handleScanInput(this.scannerInput.value.trim());
      }
    });

    // Quick barcode presets in scanner
    document.querySelectorAll(".scanner-preset-tag").forEach(tag => {
      tag.addEventListener("click", () => {
        this.scannerInput.value = tag.dataset.barcode;
        this.handleScanInput(tag.dataset.barcode);
      });
    });
  }

  updateSoundButtonUI(isSound) {
    this.btnSoundToggle.innerHTML = isSound ? "🔊" : "🔇";
    this.btnSoundToggle.classList.toggle("active", isSound);
    this.btnSoundToggle.title = isSound ? "Sound Alerts Active" : "Sound Alerts Muted";
  }

  startSlaTicker() {
    // Increase elapsed minutes periodically to simulate warehouse time progression
    setInterval(() => {
      let anyChanged = false;
      this.store.orders.forEach(order => {
        if (order.status !== "Shipped") {
          order.createdAtMinutesAgo += 1;
          anyChanged = true;
        }
      });
      if (anyChanged) {
        this.store.saveOrders(this.store.orders);
        this.render();
      }
    }, 30000); // Ticks every 30s
  }

  // Determine if an order is delayed
  isOrderDelayed(order) {
    if (order.status === "Shipped") return false;
    return order.isForceDelayed || (order.createdAtMinutesAgo >= order.targetSlaMinutes);
  }

  // ============================================================
  // KANBAN SORTING ALGORITHM:
  // 1. Priority orders automatically float to the top
  // 2. Delayed orders float above non-delayed within their priority group
  // 3. Oldest wait times float higher
  // ============================================================
  sortOrdersForLane(orders) {
    return [...orders].sort((a, b) => {
      // 1. Priority takes highest precedence
      const aPriority = a.priority === "Priority" ? 1 : 0;
      const bPriority = b.priority === "Priority" ? 1 : 0;
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Priority floats to top
      }

      // 2. Delayed orders float next
      const aDelayed = this.isOrderDelayed(a) ? 1 : 0;
      const bDelayed = this.isOrderDelayed(b) ? 1 : 0;
      if (aDelayed !== bDelayed) {
        return bDelayed - aDelayed; // Delayed floats higher
      }

      // 3. Longest waiting time
      return b.createdAtMinutesAgo - a.createdAtMinutesAgo;
    });
  }

  // Filter orders based on user selection
  getFilteredOrders() {
    return this.store.orders.filter(order => {
      // Search filter (Order ID, Customer, or Product names)
      if (this.searchQuery) {
        const matchesId = order.id.toLowerCase().includes(this.searchQuery);
        const matchesCust = order.customerName.toLowerCase().includes(this.searchQuery);
        const matchesItem = order.items.some(item => {
          const prod = this.store.getProductById(item.productId);
          return prod && (prod.name.toLowerCase().includes(this.searchQuery) || prod.sku.toLowerCase().includes(this.searchQuery));
        });
        if (!matchesId && !matchesCust && !matchesItem) return false;
      }

      // Dropdown filter
      if (this.currentFilter === "priority") {
        return order.priority === "Priority";
      }
      if (this.currentFilter === "delayed") {
        return this.isOrderDelayed(order);
      }
      if (this.currentFilter === "issue") {
        return order.status === "Issue";
      }
      return true;
    });
  }

  render() {
    const orders = this.getFilteredOrders();

    // Group into lanes
    const toPick = this.sortOrdersForLane(orders.filter(o => o.status === "To Pick"));
    const packing = this.sortOrdersForLane(orders.filter(o => o.status === "Packing"));
    const staged = this.sortOrdersForLane(orders.filter(o => o.status === "Staged"));
    const shipped = this.sortOrdersForLane(orders.filter(o => o.status === "Shipped"));
    const issue = this.sortOrdersForLane(orders.filter(o => o.status === "Issue"));

    // Render cards into lanes
    this.renderLane(this.colToPick, toPick, "To Pick");
    this.renderLane(this.colPacking, packing, "Packing");
    this.renderLane(this.colStaged, staged, "Staged");
    this.renderLane(this.colShipped, shipped, "Shipped");
    this.renderLane(this.colIssue, issue, "Issue");

    // Update Counts
    this.badgeToPick.textContent = toPick.length;
    this.badgePacking.textContent = packing.length;
    this.badgeStaged.textContent = staged.length;
    this.badgeShipped.textContent = shipped.length;
    this.badgeIssue.textContent = issue.length;

    // Update mobile tab badges
    document.getElementById("mtab-count-to-pick").textContent = toPick.length;
    document.getElementById("mtab-count-packing").textContent = packing.length;
    document.getElementById("mtab-count-staged").textContent = staged.length;
    document.getElementById("mtab-count-shipped").textContent = shipped.length;
    document.getElementById("mtab-count-issue").textContent = issue.length;

    // Update KPIs
    const allOrders = this.store.orders;
    const delayedCount = allOrders.filter(o => this.isOrderDelayed(o)).length;
    const priorityCount = allOrders.filter(o => o.priority === "Priority" && o.status !== "Shipped").length;
    const issueCount = allOrders.filter(o => o.status === "Issue").length;

    this.kpiTotal.textContent = allOrders.filter(o => o.status !== "Shipped").length;
    this.kpiPriority.textContent = priorityCount;
    this.kpiDelayed.textContent = delayedCount;
    this.kpiIssues.textContent = issueCount;

    if (delayedCount > 0) {
      this.kpiDelayed.classList.add("pulse");
    } else {
      this.kpiDelayed.classList.remove("pulse");
    }

    this.renderMobileLanes();
  }

  renderMobileLanes() {
    const lanes = [
      { id: "lane-to-pick", name: "To Pick" },
      { id: "lane-packing", name: "Packing" },
      { id: "lane-staged", name: "Staged" },
      { id: "lane-shipped", name: "Shipped" },
      { id: "lane-issue", name: "Issue" }
    ];

    lanes.forEach(l => {
      const el = document.getElementById(l.id);
      if (el) {
        if (l.name === this.activeMobileTab) {
          el.classList.add("is-mobile-active");
        } else {
          el.classList.remove("is-mobile-active");
        }
      }
    });
  }

  renderLane(container, laneOrders, laneStatus) {
    if (laneOrders.length === 0) {
      container.innerHTML = `
        <div class="empty-lane-placeholder">
          <span>No orders currently in ${laneStatus}</span>
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    laneOrders.forEach(order => {
      const card = this.createOrderCardElement(order);
      container.appendChild(card);
    });
  }

  // ============================================================
  // ORDER CARD BUILDER
  // Features:
  // - Priority indicator
  // - Bright Red Flashing Banner & Border if Delayed
  // - Single-Tap "Confirm Visual Match" button on each item
  // - Intuitive "Flag Issue" button
  // - Stage advancement
  // ============================================================
  createOrderCardElement(order) {
    const isPriority = order.priority === "Priority";
    const isDelayed = this.isOrderDelayed(order);
    const isIssueLane = order.status === "Issue";
    const isShipped = order.status === "Shipped";

    const allItemsConfirmed = order.items.every(i => i.confirmed);

    const card = document.createElement("div");
    card.className = `order-card ${isPriority ? "is-priority" : ""} ${isDelayed ? "is-delayed" : ""}`;
    card.dataset.orderId = order.id;

    // Delayed Alert Banner (Bright pulsating red)
    let delayedBannerHtml = "";
    if (isDelayed) {
      const overdueBy = Math.max(1, order.createdAtMinutesAgo - order.targetSlaMinutes);
      delayedBannerHtml = `
        <div class="delayed-banner">
          <span>⚠️ SLA BREACH • DELAYED</span>
          <span>+${overdueBy}m OVERDUE</span>
        </div>
      `;
    }

    // Card Header
    let headerHtml = `
      <div class="card-header">
        <div class="order-id-group">
          <span class="order-id">${order.id}</span>
          <span class="priority-pill ${isPriority ? "priority" : "regular"}">
            ${isPriority ? "⚡ Priority" : "Regular"}
          </span>
        </div>
        <div class="sla-timer ${isDelayed ? "overdue" : ""}">
          ⏱️ ${order.createdAtMinutesAgo}m / ${order.targetSlaMinutes}m SLA
        </div>
      </div>
      <div class="card-meta">
        <span class="customer-name" title="${order.customerName}">🏢 ${order.customerName}</span>
        <span>📍 ${order.destination}</span>
      </div>
    `;

    // Flagged Issue Banner (if in issue lane)
    let issueBannerHtml = "";
    if (isIssueLane) {
      issueBannerHtml = `
        <div class="issue-card-banner">
          <span class="issue-label">⚠️ Issue Flagged (${order.issueReportedAt || "Active"})</span>
          <span class="issue-desc">${order.issueReason || "Unspecified problem reported."}</span>
        </div>
      `;
    }

    // Item List Preview
    let itemsHtml = `<div class="card-items-preview">`;
    order.items.forEach((item, idx) => {
      const prod = this.store.getProductById(item.productId);
      if (!prod) return;

      const isMatched = item.confirmed;

      itemsHtml += `
        <div class="item-row ${isMatched ? "is-matched" : ""}" data-item-idx="${idx}">
          <div class="item-thumb">
            <img src="${prod.image}" alt="${prod.name}" />
          </div>
          <div class="item-details">
            <div class="item-name">${prod.name}</div>
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <span class="item-location">📍 ${prod.binCode}</span>
              <span class="item-qty-tag">QTY: <strong>${item.quantity}</strong></span>
              <span style="font-size:0.75rem; color:#64748b;">${prod.sku}</span>
            </div>
          </div>
          <div>
            ${isShipped || isIssueLane ? `
              <span style="font-size:0.8rem; font-weight:800; color:${isMatched ? '#059669' : '#d97706'}">
                ${isMatched ? "✓ Matched" : "Pending"}
              </span>
            ` : `
              <button 
                type="button" 
                class="btn-visual-match ${isMatched ? "matched" : ""}" 
                data-order-id="${order.id}" 
                data-item-idx="${idx}"
                title="Single tap to confirm visual match with physical product"
              >
                ${isMatched ? "✓ Verified" : "📷 Match"}
              </button>
            `}
          </div>
        </div>
      `;
    });
    itemsHtml += `</div>`;

    // Card Actions Footer
    let actionsHtml = `<div class="card-actions-bar">`;

    if (isIssueLane) {
      // In Issue Lane: Worker can resolve & restore to previous status
      actionsHtml += `
        <button type="button" class="btn-resolve-issue" data-order-id="${order.id}">
          ✓ Resolve & Resume to ${order.previousStatus || "To Pick"}
        </button>
      `;
    } else if (isShipped) {
      // In Shipped Lane: Confirmed dispatched
      actionsHtml += `
        <div style="width:100%; display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; font-weight:800; color:#059669; background:#ecfdf5; padding:8px 12px; border-radius:8px;">
          <span>✓ DISPATCHED</span>
          <span>${order.trackingNumber || "TRK-XYZ"}</span>
        </div>
      `;
    } else {
      // Active Workflow Lane: Next Stage button + Flag Issue Button
      const nextStageName = this.getNextStageName(order.status);
      const canAdvance = allItemsConfirmed;

      actionsHtml += `
        <button 
          type="button" 
          class="btn-advance-lane ${canAdvance ? "" : "needs-match"}" 
          data-order-id="${order.id}"
          title="${canAdvance ? `Advance to ${nextStageName}` : "Confirm all visual matches first"}"
        >
          ${canAdvance ? `Advance to ${nextStageName} ➔` : `⚠️ Confirm Items (${order.items.filter(i=>i.confirmed).length}/${order.items.length})`}
        </button>
        <button 
          type="button" 
          class="btn-flag-issue" 
          data-order-id="${order.id}"
          title="Flag an issue (missing stock, damage, etc.)"
        >
          ⚠️ Flag Issue
        </button>
      `;
    }
    actionsHtml += `</div>`;

    card.innerHTML = delayedBannerHtml + headerHtml + issueBannerHtml + itemsHtml + actionsHtml;

    // Attach Action Listeners
    this.attachCardEventListeners(card, order);

    return card;
  }

  getNextStageName(currentStatus) {
    switch (currentStatus) {
      case "To Pick": return "Packing";
      case "Packing": return "Staged";
      case "Staged": return "Shipped";
      default: return "Complete";
    }
  }

  attachCardEventListeners(card, order) {
    // 1. Single-Tap "Confirm Visual Match" buttons
    card.querySelectorAll(".btn-visual-match").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const orderId = btn.dataset.orderId;
        const itemIdx = parseInt(btn.dataset.itemIdx, 10);
        this.confirmVisualMatch(orderId, itemIdx);
      });
    });

    // 2. Advance Lane Button
    const advanceBtn = card.querySelector(".btn-advance-lane");
    if (advanceBtn) {
      advanceBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const orderId = advanceBtn.dataset.orderId;
        this.advanceOrderStatus(orderId);
      });
    }

    // 3. Intuitive Flag Issue Button
    const flagBtn = card.querySelector(".btn-flag-issue");
    if (flagBtn) {
      flagBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const orderId = flagBtn.dataset.orderId;
        this.openFlagModal(orderId);
      });
    }

    // 4. Resolve Issue Button
    const resolveBtn = card.querySelector(".btn-resolve-issue");
    if (resolveBtn) {
      resolveBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const orderId = resolveBtn.dataset.orderId;
        this.resolveIssue(orderId);
      });
    }
  }

  // ============================================================
  // SINGLE-TAP CONFIRM VISUAL MATCH HANDLER
  // ============================================================
  confirmVisualMatch(orderId, itemIdx) {
    const order = this.store.getOrderById(orderId);
    if (!order || !order.items[itemIdx]) return;

    const item = order.items[itemIdx];
    const prod = this.store.getProductById(item.productId);

    // Toggle confirmation state
    item.confirmed = !item.confirmed;
    this.store.saveOrders(this.store.orders);

    if (item.confirmed) {
      this.audio.playVisualMatchSuccess();
      this.showToast(`✓ Visual Match Confirmed: ${prod ? prod.name : "Item"} (${prod ? prod.binCode : ""})`, "success");
    } else {
      this.audio.playClick();
      this.showToast(`Visual Match Cleared for ${prod ? prod.name : "Item"}`);
    }

    // Check if order is now fully verified
    const allNowConfirmed = order.items.every(i => i.confirmed);
    if (allNowConfirmed && item.confirmed) {
      setTimeout(() => {
        this.showToast(`🎉 Order ${order.id} completely verified! Ready to advance.`);
      }, 400);
    }

    this.render();
  }

  // ============================================================
  // ADVANCE ORDER WORKFLOW
  // To Pick ➔ Packing ➔ Staged ➔ Shipped
  // ============================================================
  advanceOrderStatus(orderId) {
    const order = this.store.getOrderById(orderId);
    if (!order) return;

    // Fail-safe: Check if all items are visually confirmed
    const unconfirmedCount = order.items.filter(i => !i.confirmed).length;
    if (unconfirmedCount > 0) {
      this.audio.playFlagIssue();
      this.showToast(`⚠️ Cannot advance: ${unconfirmedCount} item(s) still require Single-Tap Visual Match!`, "alert");
      return;
    }

    let nextStatus = "";
    if (order.status === "To Pick") {
      nextStatus = "Packing";
      // In packing, reset confirmation for packing check or keep confirmed
      // To simulate true packing validation, we keep items confirmed or require seal
    } else if (order.status === "Packing") {
      nextStatus = "Staged";
    } else if (order.status === "Staged") {
      nextStatus = "Shipped";
      order.shippedAt = "Just now";
      order.trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}-XYZ`;
    }

    if (nextStatus) {
      order.status = nextStatus;
      this.store.saveOrders(this.store.orders);
      this.audio.playAdvance();
      this.showToast(`🚀 Order ${order.id} advanced to ${nextStatus}!`, "success");
      this.render();
    }
  }

  // ============================================================
  // INTUITIVE FLAG ISSUE WORKFLOW
  // Moves order to dedicated Problem / Issue Lane
  // ============================================================
  openFlagModal(orderId) {
    this.activeFlaggingOrderId = orderId;
    this.flagOrderIdLabel.textContent = `Order ${orderId}`;
    this.flagCustomInput.value = "";
    this.flagModal.classList.add("is-open");
    this.audio.playClick();
  }

  closeFlagModal() {
    this.activeFlaggingOrderId = null;
    this.flagModal.classList.remove("is-open");
  }

  commitFlagIssue(reasonText) {
    if (!this.activeFlaggingOrderId) return;
    const order = this.store.getOrderById(this.activeFlaggingOrderId);
    if (!order) return;

    order.previousStatus = order.status; // Save previous lane to restore later
    order.status = "Issue";              // Move to dedicated issue lane
    order.issueReason = reasonText;
    order.issueReportedAt = "Just now";
    this.store.saveOrders(this.store.orders);

    this.audio.playFlagIssue();
    this.closeFlagModal();
    this.showToast(`⚠️ Order ${order.id} moved to PROBLEM LANE: "${reasonText}"`, "alert");
    this.render();
  }

  resolveIssue(orderId) {
    const order = this.store.getOrderById(orderId);
    if (!order) return;

    const restoreLane = order.previousStatus || "To Pick";
    order.status = restoreLane;
    order.issueReason = null;
    this.store.saveOrders(this.store.orders);

    this.audio.playAdvance();
    this.showToast(`✓ Issue Resolved for ${order.id}! Restored to ${restoreLane}.`, "success");
    this.render();
  }

  // ============================================================
  // BARCODE SCANNER SIMULATION
  // ============================================================
  openScannerModal() {
    this.scannerModal.classList.add("is-open");
    this.scannerInput.value = "";
    this.scannerResults.innerHTML = `<div style="color:#64748b; font-weight:600; text-align:center; padding:16px;">Type or tap a barcode below to simulate scanning</div>`;
    setTimeout(() => this.scannerInput.focus(), 150);
  }

  closeScannerModal() {
    this.scannerModal.classList.remove("is-open");
  }

  handleScanInput(barcodeOrSku) {
    if (!barcodeOrSku) return;

    const query = barcodeOrSku.trim().toUpperCase();
    const product = this.store.products.find(p => p.barcode === query || p.sku.toUpperCase() === query);

    if (!product) {
      this.audio.playFlagIssue();
      this.scannerResults.innerHTML = `
        <div style="background:#fee2e2; color:#b91c1c; padding:14px; border-radius:8px; font-weight:800;">
          ❌ No product found matching "${barcodeOrSku}"
        </div>
      `;
      return;
    }

    // Found product - now find any active order needing this product!
    const activeOrders = this.store.orders.filter(o => o.status === "To Pick" || o.status === "Packing");
    let matchedOrder = null;
    let matchedItemIdx = -1;

    for (const ord of activeOrders) {
      const idx = ord.items.findIndex(i => i.productId === product.id && !i.confirmed);
      if (idx !== -1) {
        matchedOrder = ord;
        matchedItemIdx = idx;
        break;
      }
    }

    if (matchedOrder) {
      // Auto-confirm via scan!
      matchedOrder.items[matchedItemIdx].confirmed = true;
      this.store.saveOrders(this.store.orders);
      this.audio.playVisualMatchSuccess();

      this.scannerResults.innerHTML = `
        <div style="background:#ecfdf5; border:2px solid #10b981; color:#065f46; padding:14px; border-radius:8px;">
          <div style="font-weight:900; font-size:1.1rem;">✓ SCAN MATCHED & CONFIRMED!</div>
          <div style="margin-top:4px; font-weight:700;">${product.name} (${product.sku})</div>
          <div style="font-size:0.9rem; color:#047857; margin-top:4px;">
            Automatically matched in Order <strong>${matchedOrder.id}</strong> (Location: ${product.binCode})
          </div>
        </div>
      `;
      this.showToast(`✓ Scanned & Confirmed for Order ${matchedOrder.id}!`, "success");
      this.render();
    } else {
      this.audio.playClick();
      this.scannerResults.innerHTML = `
        <div style="background:#f8fafc; border:2px solid #cbd5e1; padding:14px; border-radius:8px;">
          <div style="font-weight:800; color:#1e293b;">Product Found: ${product.name}</div>
          <div style="color:#64748b; font-size:0.9rem;">SKU: ${product.sku} | Location: ${product.binCode} | Stock: ${product.stock}</div>
          <div style="margin-top:8px; font-weight:700; color:#3b82f6;">ℹ️ No active unconfirmed orders currently require this item.</div>
        </div>
      `;
    }
  }

  // ============================================================
  // TOAST NOTIFICATIONS (Warehouse tactile alerts)
  // ============================================================
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(15px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new FulfillmentApp();
});
