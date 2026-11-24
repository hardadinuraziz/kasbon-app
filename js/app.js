/**
 * KasbonKu — Main Application Controller
 * Pure Vanilla JS | Offline-First | Responsive Ledger UI
 */
(function (global) {
  'use strict';

  const U = global.KasbonUtils;
  const S = global.KasbonStorage;
  const R = global.KasbonReceipt;

  const ICONS = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    arrowDownLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7 7 17"/><path d="M17 17H7V7"/></svg>',
    arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
  };

  let state = S.loadState();

  const ui = {
    view: 'beranda',
    search: '',
    statusFilter: 'semua', // semua | belum_lunas | jatuh_tempo | lunas
    categoryFilter: 'semua',
    sortBy: 'terbaru', // terbaru | sisa_terbesar | jatuh_tempo | nama_az
    mutasiType: 'semua', // semua | masuk | keluar
    mutasiMonth: 'semua',
    activeWaRecordId: null,
    activeWaTone: 'sopan',
    activeReceiptRecord: null,
    confirmCallback: null
  };

  // =========================================================================
  // Initialization & Global Events
  // =========================================================================

  function init() {
    applyTheme(state.settings.theme || 'light');
    updateBusinessLabels();
    bindStaticEvents();
    render();
    registerServiceWorker();
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.protocol === 'http:')) {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // Silent fail if SW unsupported in preview environment
      });
    }
  }

  function bindStaticEvents() {
    // Navigation buttons (sidebar + mobile bottom nav)
    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setView(btn.getAttribute('data-view'));
      });
    });

    // New kasbon buttons
    document.getElementById('sidebarNewKasbonBtn').addEventListener('click', () => openKasbonModal());
    document.getElementById('mobileNewKasbonBtn').addEventListener('click', () => openKasbonModal());

    // Theme toggles
    document.getElementById('sidebarThemeBtn').addEventListener('click', toggleTheme);
    document.getElementById('mobileThemeBtn').addEventListener('click', toggleTheme);

    // Settings buttons
    document.getElementById('sidebarSettingsBtn').addEventListener('click', openSettingsModal);
    document.getElementById('mobileSettingsBtn').addEventListener('click', openSettingsModal);

    // Modal close buttons & backdrop clicks
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal(backdrop.id);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal-backdrop.open');
        if (openModals.length > 0) {
          closeModal(openModals[openModals.length - 1].id);
        }
      }
    });

    // Currency formatting on inputs
    const kbAmount = document.getElementById('kbAmount');
    kbAmount.addEventListener('input', () => {
      kbAmount.value = U.formatInputThousands(kbAmount.value);
    });

    const payAmount = document.getElementById('payAmount');
    payAmount.addEventListener('input', () => {
      payAmount.value = U.formatInputThousands(payAmount.value);
    });

    // Quick add amount chips in Kasbon modal
    document.querySelectorAll('[data-add-amount]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const addVal = Number(chip.getAttribute('data-add-amount')) || 0;
        const current = U.parseRupiahInput(kbAmount.value);
        kbAmount.value = U.formatInputThousands(current + addVal);
      });
    });

    // Autofill phone & category when typing an existing borrower name
    const kbBorrowerName = document.getElementById('kbBorrowerName');
    kbBorrowerName.addEventListener('change', () => {
      const entered = kbBorrowerName.value.trim().toLowerCase();
      if (!entered) return;
      const existing = state.records.find((r) => r.borrowerName.toLowerCase() === entered);
      if (existing) {
        const phoneInput = document.getElementById('kbPhone');
        if (!phoneInput.value.trim() && existing.phone) {
          phoneInput.value = existing.phone;
        }
        document.getElementById('kbCategory').value = existing.category;
      }
    });

    // Forms submission
    document.getElementById('kasbonForm').addEventListener('submit', handleKasbonSubmit);
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);

    // WA Modal events
    document.querySelectorAll('[data-wa-tone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ui.activeWaTone = btn.getAttribute('data-wa-tone');
        document.querySelectorAll('[data-wa-tone]').forEach((b) =>
          b.classList.toggle('active', b === btn)
        );
        const rec = state.records.find((r) => r.id === ui.activeWaRecordId);
        if (rec) {
          document.getElementById('waMessagePreview').value = U.buildWhatsAppMessage(
            rec,
            state.settings,
            ui.activeWaTone
          );
        }
      });
    });

    document.getElementById('waCopyBtn').addEventListener('click', () => {
      const msg = document.getElementById('waMessagePreview').value;
      copyText(msg, 'Pesan tagihan berhasil disalin');
    });

    document.getElementById('waSendBtn').addEventListener('click', () => {
      const msg = document.getElementById('waMessagePreview').value;
      const phone = U.normalizePhoneWA(document.getElementById('waPhoneInput').value);
      const url = phone
        ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg)
        : 'https://wa.me/?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
    });

    // Receipt download button
    document.getElementById('downloadReceiptBtn').addEventListener('click', () => {
      if (!ui.activeReceiptRecord) return;
      const canvas = document.getElementById('receiptCanvas');
      R.downloadReceiptCanvas(canvas, ui.activeReceiptRecord);
      showToast('Nota digital (PNG) berhasil diunduh');
    });

    // Confirm modal action
    document.getElementById('confirmModalOkBtn').addEventListener('click', () => {
      const cb = ui.confirmCallback;
      closeModal('confirmModal');
      if (typeof cb === 'function') cb();
    });

    // Hidden JSON import input
    document.getElementById('jsonImportInput').addEventListener('change', handleJSONFileImport);
  }

  // =========================================================================
  // Theme & Business Info
  // =========================================================================

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    const iconHtml = isDark ? ICONS.sun : ICONS.moon;
    document.getElementById('mobileThemeBtn').innerHTML = iconHtml;
    document.getElementById('sidebarThemeIcon').innerHTML = iconHtml;
    document.getElementById('sidebarThemeLabel').textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
  }

  function toggleTheme() {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    S.saveState(state);
    applyTheme(state.settings.theme);
  }

  function updateBusinessLabels() {
    const name = state.settings.businessName || 'Catatan Usaha';
    document.getElementById('sidebarBusinessSub').textContent = name;
    document.getElementById('mobileBusinessSub').textContent = name;
  }

  function setView(viewName) {
    ui.view = viewName;
    document.querySelectorAll('[data-view]').forEach((el) => {
      el.classList.toggle('active', el.getAttribute('data-view') === viewName);
    });
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // Metrics & Grouping Calculations
  // =========================================================================

  function computeSummary() {
    let totalAmount = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    let activeCount = 0;
    let paidCount = 0;
    let overdueCount = 0;
    let overdueAmount = 0;

    state.records.forEach((r) => {
      const paid = U.calcPaidAmount(r);
      const rem = U.calcRemaining(r);
      const status = U.getRecordStatus(r);
      totalAmount += r.amount;
      totalPaid += paid;
      totalRemaining += rem;
      if (rem <= 0) {
        paidCount += 1;
      } else {
        activeCount += 1;
        if (status.code === 'jatuh_tempo') {
          overdueCount += 1;
          overdueAmount += rem;
        }
      }
    });

    const recoveryRate = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

    return {
      totalAmount,
      totalPaid,
      totalRemaining,
      activeCount,
      paidCount,
      overdueCount,
      overdueAmount,
      recoveryRate
    };
  }

  function computeContacts() {
    const map = new Map();
    state.records.forEach((r) => {
      const key = r.borrowerName.trim().toLowerCase();
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: r.borrowerName.trim(),
          phone: r.phone || '',
          category: r.category,
          records: [],
          totalKasbon: 0,
          totalPaid: 0,
          totalRemaining: 0,
          activeCount: 0,
          overdueCount: 0
        });
      }
      const entry = map.get(key);
      if (!entry.phone && r.phone) entry.phone = r.phone;
      entry.records.push(r);
      const paid = U.calcPaidAmount(r);
      const rem = U.calcRemaining(r);
      const status = U.getRecordStatus(r);
      entry.totalKasbon += r.amount;
      entry.totalPaid += paid;
      entry.totalRemaining += rem;
      if (rem > 0) {
        entry.activeCount += 1;
        if (status.code === 'jatuh_tempo') entry.overdueCount += 1;
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      if (b.totalRemaining !== a.totalRemaining) return b.totalRemaining - a.totalRemaining;
      return a.name.localeCompare(b.name, 'id');
    });
  }

  function updateNavCounts() {
    const summary = computeSummary();
    const contacts = computeContacts();
    document.getElementById('navActiveCount').textContent = summary.activeCount;
    document.getElementById('navContactCount').textContent = contacts.length;
  }

  // =========================================================================
  // Master Render Dispatcher
  // =========================================================================

  function render() {
    updateNavCounts();
    const root = document.getElementById('appRoot');

    if (ui.view === 'beranda') {
      renderBeranda(root);
    } else if (ui.view === 'kontak') {
      renderKontak(root);
    } else if (ui.view === 'mutasi') {
      renderMutasi(root);
    } else if (ui.view === 'laporan') {
      renderLaporan(root);
    }
  }

  // =========================================================================
  // VIEW 1: BERANDA (Ringkasan & Daftar Kasbon)
  // =========================================================================

  function renderBeranda(root) {
    const sum = computeSummary();

    const demoBannerHtml = state.isDemoMode
      ? `
        <div class="demo-banner">
          <div class="demo-banner-text">
            ${ICONS.info}
            <span>Menampilkan <strong>data contoh</strong> agar Anda bisa langsung mencoba fitur cicilan, tagih WA, dan nota digital.</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" id="clearDemoBtn">Mulai Buku Kosong</button>
        </div>
      `
      : '';

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Daftar Kasbon</h1>
          <p class="page-subtitle">Pantau piutang aktif, cicilan masuk, dan tenggat jatuh tempo secara real-time.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-secondary" id="quickCopyReportBtn">
            ${ICONS.copy}
            Salin Rekap WA
          </button>
          <button type="button" class="btn btn-primary" id="headerNewKasbonBtn">
            ${ICONS.plus}
            Catat Kasbon
          </button>
        </div>
      </div>

      ${demoBannerHtml}

      <section class="metrics-grid" aria-label="Ringkasan Keuangan Kasbon">
        <article class="metric-card clickable" id="metricActiveCard" title="Klik untuk filter Belum Lunas">
          <div class="metric-top">
            <span class="metric-label">Sisa Belum Lunas</span>
            <span class="metric-pill amber tabular">${sum.activeCount} aktif</span>
          </div>
          <div class="metric-value amber tabular">${U.formatRupiah(sum.totalRemaining)}</div>
          <div class="metric-foot tabular">Dari total ${U.formatRupiah(sum.totalAmount)} dicatat</div>
        </article>

        <article class="metric-card clickable" id="metricPaidCard" title="Klik untuk filter Lunas">
          <div class="metric-top">
            <span class="metric-label">Sudah Terbayar</span>
            <span class="metric-pill emerald tabular">${sum.recoveryRate}% tertagih</span>
          </div>
          <div class="metric-value emerald tabular">${U.formatRupiah(sum.totalPaid)}</div>
          <div class="metric-foot tabular">${sum.paidCount} kasbon telah lunas penuh</div>
        </article>

        <article class="metric-card clickable" id="metricOverdueCard" title="Klik untuk filter Jatuh Tempo">
          <div class="metric-top">
            <span class="metric-label">Jatuh Tempo / Terlambat</span>
            <span class="metric-pill ${sum.overdueCount > 0 ? 'crimson' : 'emerald'} tabular">${sum.overdueCount} item</span>
          </div>
          <div class="metric-value ${sum.overdueCount > 0 ? 'crimson' : 'emerald'} tabular">${U.formatRupiah(sum.overdueAmount)}</div>
          <div class="metric-foot">${sum.overdueCount > 0 ? 'Perlu segera diingatkan via WhatsApp' : 'Tidak ada kasbon terlambat'}</div>
        </article>
      </section>

      <section class="toolbar-card" aria-label="Pencarian dan Filter">
        <div class="toolbar-row">
          <div class="search-box">
            ${ICONS.search}
            <input type="search" id="searchKasbonInput" class="search-input" value="${U.escapeHtml(ui.search)}" placeholder="Cari nama peminjam, keperluan, atau nomor WA...">
          </div>
          <select id="categoryFilterSelect" class="select-control" aria-label="Filter kategori">
            <option value="semua" ${ui.categoryFilter === 'semua' ? 'selected' : ''}>Semua Kategori</option>
            <option value="karyawan" ${ui.categoryFilter === 'karyawan' ? 'selected' : ''}>Karyawan</option>
            <option value="pelanggan" ${ui.categoryFilter === 'pelanggan' ? 'selected' : ''}>Pelanggan</option>
            <option value="teman" ${ui.categoryFilter === 'teman' ? 'selected' : ''}>Teman / Keluarga</option>
            <option value="operasional" ${ui.categoryFilter === 'operasional' ? 'selected' : ''}>Operasional</option>
          </select>
          <select id="sortFilterSelect" class="select-control" aria-label="Urutkan kasbon">
            <option value="terbaru" ${ui.sortBy === 'terbaru' ? 'selected' : ''}>Urut: Terbaru</option>
            <option value="sisa_terbesar" ${ui.sortBy === 'sisa_terbesar' ? 'selected' : ''}>Urut: Sisa Terbesar</option>
            <option value="jatuh_tempo" ${ui.sortBy === 'jatuh_tempo' ? 'selected' : ''}>Urut: Jatuh Tempo Terdekat</option>
            <option value="nama_az" ${ui.sortBy === 'nama_az' ? 'selected' : ''}>Urut: Nama A–Z</option>
          </select>
        </div>

        <div class="filter-pills" role="tablist" aria-label="Filter status kasbon">
          ${renderStatusPill('semua', 'Semua', state.records.length)}
          ${renderStatusPill('belum_lunas', 'Belum Lunas', sum.activeCount)}
          ${renderStatusPill('jatuh_tempo', 'Jatuh Tempo', sum.overdueCount)}
          ${renderStatusPill('lunas', 'Lunas', sum.paidCount)}
        </div>
      </section>

      <section id="ledgerListContainer" class="ledger-list" aria-live="polite"></section>
    `;

    // Bind Beranda interactions
    document.getElementById('headerNewKasbonBtn').addEventListener('click', () => openKasbonModal());
    document.getElementById('quickCopyReportBtn').addEventListener('click', () => {
      copyText(S.buildReportWhatsAppText(state), 'Rekap laporan WhatsApp berhasil disalin');
    });

    const clearDemoBtn = document.getElementById('clearDemoBtn');
    if (clearDemoBtn) {
      clearDemoBtn.addEventListener('click', () => {
        openConfirm(
          'Hapus Data Contoh?',
          'Semua data contoh akan dihapus agar Anda bisa mulai mencatat kasbon asli Anda.',
          () => {
            state.records = [];
            state.isDemoMode = false;
            S.saveState(state);
            render();
            showToast('Buku kasbon siap digunakan!');
          }
        );
      });
    }

    document.getElementById('metricActiveCard').addEventListener('click', () => setStatusFilter('belum_lunas'));
    document.getElementById('metricPaidCard').addEventListener('click', () => setStatusFilter('lunas'));
    document.getElementById('metricOverdueCard').addEventListener('click', () => setStatusFilter('jatuh_tempo'));

    const searchInput = document.getElementById('searchKasbonInput');
    searchInput.addEventListener('input', (e) => {
      ui.search = e.target.value;
      renderLedgerCards();
    });

    document.getElementById('categoryFilterSelect').addEventListener('change', (e) => {
      ui.categoryFilter = e.target.value;
      renderLedgerCards();
    });

    document.getElementById('sortFilterSelect').addEventListener('change', (e) => {
      ui.sortBy = e.target.value;
      renderLedgerCards();
    });

    document.querySelectorAll('[data-status-filter]').forEach((pill) => {
      pill.addEventListener('click', () => {
        setStatusFilter(pill.getAttribute('data-status-filter'));
      });
    });

    renderLedgerCards();
  }

  function renderStatusPill(code, label, count) {
    const active = ui.statusFilter === code ? 'active' : '';
    return `<button type="button" class="filter-pill ${active}" data-status-filter="${code}">${label} <span class="tabular">(${count})</span></button>`;
  }

  function setStatusFilter(code) {
    ui.statusFilter = code;
    document.querySelectorAll('[data-status-filter]').forEach((pill) => {
      pill.classList.toggle('active', pill.getAttribute('data-status-filter') === code);
    });
    renderLedgerCards();
  }

  function getFilteredRecords() {
    const q = ui.search.trim().toLowerCase();

    const filtered = state.records.filter((r) => {
      const status = U.getRecordStatus(r);
      const rem = U.calcRemaining(r);

      if (ui.statusFilter === 'belum_lunas' && rem <= 0) return false;
      if (ui.statusFilter === 'lunas' && rem > 0) return false;
      if (ui.statusFilter === 'jatuh_tempo' && status.code !== 'jatuh_tempo') return false;

      if (ui.categoryFilter !== 'semua' && r.category !== ui.categoryFilter) return false;

      if (q) {
        const hay = (r.borrowerName + ' ' + r.description + ' ' + r.phone + ' ' + r.notes).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (ui.sortBy === 'sisa_terbesar') {
        return U.calcRemaining(b) - U.calcRemaining(a);
      }
      if (ui.sortBy === 'nama_az') {
        return a.borrowerName.localeCompare(b.borrowerName, 'id');
      }
      if (ui.sortBy === 'jatuh_tempo') {
        const aPaid = U.calcRemaining(a) <= 0;
        const bPaid = U.calcRemaining(b) <= 0;
        if (aPaid !== bPaid) return aPaid ? 1 : -1;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.date.localeCompare(a.date);
      }
      // terbaru
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });

    return filtered;
  }

  function renderLedgerCards() {
    const container = document.getElementById('ledgerListContainer');
    if (!container) return;

    const list = getFilteredRecords();

    if (list.length === 0) {
      const hasRecords = state.records.length > 0;
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.receipt}</div>
          <h3>${hasRecords ? 'Tidak ada catatan kasbon yang cocok' : 'Belum ada catatan kasbon'}</h3>
          <p>${
            hasRecords
              ? 'Coba ubah kata kunci pencarian atau pilih filter status lainnya.'
              : 'Mulai catat kasbon karyawan, pelanggan, atau teman Anda. Data tersimpan aman secara offline di perangkat ini.'
          }</p>
          ${
            hasRecords
              ? '<button type="button" class="btn btn-secondary" id="resetFilterBtn">Tampilkan Semua</button>'
              : '<button type="button" class="btn btn-primary" id="emptyAddBtn">' + ICONS.plus + ' Catat Kasbon Pertama</button>'
          }
        </div>
      `;

      const resetBtn = document.getElementById('resetFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          ui.search = '';
          ui.statusFilter = 'semua';
          ui.categoryFilter = 'semua';
          render();
        });
      }
      const emptyAddBtn = document.getElementById('emptyAddBtn');
      if (emptyAddBtn) {
        emptyAddBtn.addEventListener('click', () => openKasbonModal());
      }
      return;
    }

    container.innerHTML = list.map((r) => buildKasbonCardHtml(r)).join('');

    // Wire up delegated card buttons
    container.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'pay') openPaymentModal(id);
        else if (action === 'wa') openWaModalForRecord(id);
        else if (action === 'receipt') openReceiptModal(id);
        else if (action === 'detail') openDetailModal(id);
        else if (action === 'edit') openKasbonModal(id);
      });
    });
  }

  function buildKasbonCardHtml(r) {
    const paid = U.calcPaidAmount(r);
    const rem = U.calcRemaining(r);
    const pct = r.amount > 0 ? Math.min(100, Math.round((paid / r.amount) * 100)) : 100;
    const status = U.getRecordStatus(r);
    const isPaid = rem <= 0;
    const cat = U.CATEGORIES[r.category] ? U.CATEGORIES[r.category].label : r.category;
    const palette = U.getAvatarPalette(r.borrowerName);
    const amountClass = isPaid ? 'paid' : status.code === 'jatuh_tempo' ? 'overdue' : 'unpaid';

    return `
      <article class="kasbon-card ${isPaid ? 'is-paid' : ''}">
        <div class="kasbon-main">
          <div class="kasbon-left">
            <div class="avatar" style="background:${palette.bg};color:${palette.text};" aria-hidden="true">
              ${U.escapeHtml(U.getInitials(r.borrowerName))}
            </div>
            <div class="kasbon-info">
              <div class="kasbon-name-row">
                <h3 class="kasbon-name">${U.escapeHtml(r.borrowerName)}</h3>
                <span class="badge ${status.badgeClass}">${U.escapeHtml(status.label)}</span>
                <span class="badge badge-cat">${U.escapeHtml(cat)}</span>
              </div>
              <p class="kasbon-desc">${U.escapeHtml(r.description)}</p>
              <div class="kasbon-meta tabular">
                <span>Tgl ${U.formatDateID(r.date)}</span>
                <span class="meta-dot">${U.escapeHtml(status.dueText)}</span>
                ${r.payments.length > 0 ? `<span class="meta-dot">${r.payments.length}x bayar</span>` : ''}
              </div>
            </div>
          </div>

          <div class="kasbon-amounts tabular">
            <div>
              <div class="amount-label">${isPaid ? 'Status' : 'Sisa Tagihan'}</div>
              <div class="amount-remaining ${amountClass}">${isPaid ? 'LUNAS' : U.formatRupiah(rem)}</div>
            </div>
            <div class="amount-total">Total ${U.formatRupiah(r.amount)}</div>
          </div>
        </div>

        <div class="progress-row">
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width:${pct}%;"></div>
          </div>
          <span class="progress-text tabular">Terbayar ${U.formatRupiah(paid)} (${pct}%)</span>
        </div>

        <div class="kasbon-actions">
          <div class="action-group">
            ${
              !isPaid
                ? `<button type="button" class="btn btn-primary btn-sm" data-action="pay" data-id="${r.id}">${ICONS.wallet} Bayar / Cicil</button>
                   <button type="button" class="btn btn-wa btn-sm" data-action="wa" data-id="${r.id}">${ICONS.wa} Tagih WA</button>`
                : `<span class="badge badge-lunas" style="padding:6px 11px;">${ICONS.check} Pelunasan Selesai</span>`
            }
            <button type="button" class="btn btn-secondary btn-sm" data-action="receipt" data-id="${r.id}">${ICONS.receipt} Nota PNG</button>
          </div>
          <div class="action-group">
            <button type="button" class="btn btn-ghost btn-sm" data-action="detail" data-id="${r.id}">${ICONS.eye} Detail</button>
            <button type="button" class="btn btn-ghost btn-sm" data-action="edit" data-id="${r.id}">${ICONS.edit} Edit</button>
          </div>
        </div>
      </article>
    `;
  }

  // =========================================================================
  // VIEW 2: BUKU NAMA (Ringkasan per Peminjam)
  // =========================================================================

  function renderKontak(root) {
    const contacts = computeContacts();

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Buku Nama Peminjam</h1>
          <p class="page-subtitle">Akumulasi total kasbon, sisa piutang, dan rekap WhatsApp per orang.</p>
        </div>
        <div class="page-actions">
          <button type="button" class="btn btn-primary" id="kontakNewBtn">${ICONS.plus} Catat Kasbon</button>
        </div>
      </div>

      ${
        contacts.length === 0
          ? `<div class="empty-state">
               <div class="empty-icon">${ICONS.receipt}</div>
               <h3>Belum ada data peminjam</h3>
               <p>Nama peminjam akan otomatis tercatat di sini begitu Anda menambahkan catatan kasbon.</p>
             </div>`
          : `<section class="contacts-grid">
               ${contacts.map((c) => buildContactCardHtml(c)).join('')}
             </section>`
      }
    `;

    document.getElementById('kontakNewBtn').addEventListener('click', () => openKasbonModal());

    root.querySelectorAll('[data-contact-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-contact-action');
        const name = btn.getAttribute('data-contact-name');
        const contact = contacts.find((c) => c.name === name);
        if (!contact) return;

        if (action === 'add') {
          openKasbonModal(null, {
            borrowerName: contact.name,
            phone: contact.phone,
            category: contact.category
          });
        } else if (action === 'filter') {
          ui.search = contact.name;
          ui.statusFilter = 'semua';
          ui.categoryFilter = 'semua';
          setView('beranda');
        } else if (action === 'wa') {
          const activeRecs = contact.records.filter((r) => U.calcRemaining(r) > 0);
          openWaModalCustom(
            contact.phone,
            U.buildContactSummaryWA(contact.name, activeRecs, state.settings),
            'Kirim Rekap WA — ' + contact.name
          );
        }
      });
    });
  }

  function buildContactCardHtml(c) {
    const palette = U.getAvatarPalette(c.name);
    const cat = U.CATEGORIES[c.category] ? U.CATEGORIES[c.category].label : c.category;
    return `
      <article class="contact-card">
        <div class="contact-top">
          <div class="avatar" style="background:${palette.bg};color:${palette.text};">${U.escapeHtml(U.getInitials(c.name))}</div>
          <div style="min-width:0;flex:1;">
            <div class="kasbon-name-row">
              <h3 class="kasbon-name">${U.escapeHtml(c.name)}</h3>
              <span class="badge badge-cat">${U.escapeHtml(cat)}</span>
              ${c.overdueCount > 0 ? `<span class="badge badge-overdue">${c.overdueCount} jatuh tempo</span>` : ''}
            </div>
            <div class="kasbon-meta tabular" style="margin-top:2px;">
              <span>${c.phone ? U.escapeHtml(c.phone) : 'Belum ada nomor WA'}</span>
              <span class="meta-dot">${c.records.length} transaksi</span>
            </div>
          </div>
        </div>

        <div class="contact-stats tabular">
          <div>
            <div class="stat-mini-label">Sisa Aktif (${c.activeCount})</div>
            <div class="stat-mini-value" style="color:${c.totalRemaining > 0 ? 'var(--amber-ink)' : 'var(--emerald-ink)'};">
              ${c.totalRemaining > 0 ? U.formatRupiah(c.totalRemaining) : 'Lunas'}
            </div>
          </div>
          <div>
            <div class="stat-mini-label">Total Sudah Dibayar</div>
            <div class="stat-mini-value" style="color:var(--emerald-ink);">${U.formatRupiah(c.totalPaid)}</div>
          </div>
        </div>

        <div class="action-group">
          <button type="button" class="btn btn-soft btn-sm" data-contact-action="add" data-contact-name="${U.escapeHtml(c.name)}">${ICONS.plus} Kasbon Baru</button>
          ${
            c.activeCount > 0
              ? `<button type="button" class="btn btn-wa btn-sm" data-contact-action="wa" data-contact-name="${U.escapeHtml(c.name)}">${ICONS.wa} Rekap WA</button>`
              : ''
          }
          <button type="button" class="btn btn-ghost btn-sm" data-contact-action="filter" data-contact-name="${U.escapeHtml(c.name)}">Lihat Transaksi</button>
        </div>
      </article>
    `;
  }

  // =========================================================================
  // VIEW 3: RIWAYAT MUTASI
  // =========================================================================

  function renderMutasi(root) {
    const events = [];
    const monthSet = new Set();

    state.records.forEach((r) => {
      if (r.date && r.date.length >= 7) monthSet.add(r.date.slice(0, 7));
      events.push({
        type: 'keluar',
        date: r.date,
        recordId: r.id,
        borrowerName: r.borrowerName,
        title: 'Kasbon — ' + r.borrowerName,
        sub: r.description,
        amount: r.amount
      });
      r.payments.forEach((p) => {
        if (p.date && p.date.length >= 7) monthSet.add(p.date.slice(0, 7));
        events.push({
          type: 'masuk',
          date: p.date,
          recordId: r.id,
          borrowerName: r.borrowerName,
          title: 'Pembayaran — ' + r.borrowerName,
          sub: p.method + (p.note ? ' · ' + p.note : '') + ' (' + r.description + ')',
          amount: p.amount
        });
      });
    });

    const months = Array.from(monthSet).sort((a, b) => b.localeCompare(a));

    const filtered = events
      .filter((ev) => {
        if (ui.mutasiType !== 'semua' && ev.type !== ui.mutasiType) return false;
        if (ui.mutasiMonth !== 'semua' && (!ev.date || !ev.date.startsWith(ui.mutasiMonth))) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    let totalOut = 0;
    let totalIn = 0;
    filtered.forEach((ev) => {
      if (ev.type === 'keluar') totalOut += ev.amount;
      else totalIn += ev.amount;
    });

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Riwayat Mutasi</h1>
          <p class="page-subtitle">Catatan kronologis seluruh kasbon keluar dan pembayaran/cicilan masuk.</p>
        </div>
      </div>

      <section class="toolbar-card">
        <div class="toolbar-row" style="justify-content:space-between;">
          <div class="filter-pills">
            <button type="button" class="filter-pill ${ui.mutasiType === 'semua' ? 'active' : ''}" data-mutasi-type="semua">Semua</button>
            <button type="button" class="filter-pill ${ui.mutasiType === 'masuk' ? 'active' : ''}" data-mutasi-type="masuk">Pembayaran Masuk</button>
            <button type="button" class="filter-pill ${ui.mutasiType === 'keluar' ? 'active' : ''}" data-mutasi-type="keluar">Kasbon Keluar</button>
          </div>
          <select id="mutasiMonthSelect" class="select-control" aria-label="Filter bulan mutasi">
            <option value="semua" ${ui.mutasiMonth === 'semua' ? 'selected' : ''}>Semua Bulan</option>
            ${months.map((m) => `<option value="${m}" ${ui.mutasiMonth === m ? 'selected' : ''}>${U.formatMonthLabel(m)}</option>`).join('')}
          </select>
        </div>
        <div class="toolbar-row tabular" style="font-size:13px;color:var(--ink-secondary);gap:18px;">
          <span>Kasbon Keluar: <strong style="color:var(--amber-ink);">${U.formatRupiah(totalOut)}</strong></span>
          <span>Pembayaran Masuk: <strong style="color:var(--emerald-ink);">${U.formatRupiah(totalIn)}</strong></span>
        </div>
      </section>

      ${
        filtered.length === 0
          ? `<div class="empty-state">
               <div class="empty-icon">${ICONS.receipt}</div>
               <h3>Belum ada mutasi pada periode ini</h3>
               <p>Setiap kasbon baru atau cicilan yang dicatat akan tampil otomatis di sini.</p>
             </div>`
          : `<section class="ledger-table-card">
               ${filtered
                 .map(
                   (ev) => `
                   <div class="mutasi-row">
                     <div class="mutasi-left">
                       <div class="mutasi-icon ${ev.type === 'masuk' ? 'in' : 'out'}">
                         ${ev.type === 'masuk' ? ICONS.arrowDownLeft : ICONS.arrowUpRight}
                       </div>
                       <div style="min-width:0;">
                         <div class="mutasi-title">${U.escapeHtml(ev.title)}</div>
                         <div class="mutasi-sub tabular">${U.formatDateID(ev.date)} · ${U.escapeHtml(ev.sub)}</div>
                       </div>
                     </div>
                     <div class="mutasi-amount tabular ${ev.type === 'masuk' ? 'in' : 'out'}">
                       ${ev.type === 'masuk' ? '+' : '-'}${U.formatRupiah(ev.amount)}
                     </div>
                   </div>
                 `
                 )
                 .join('')}
             </section>`
      }
    `;

    root.querySelectorAll('[data-mutasi-type]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ui.mutasiType = btn.getAttribute('data-mutasi-type');
        renderMutasi(root);
      });
    });

    document.getElementById('mutasiMonthSelect').addEventListener('change', (e) => {
      ui.mutasiMonth = e.target.value;
      renderMutasi(root);
    });
  }

  // =========================================================================
  // VIEW 4: LAPORAN & BACKUP
  // =========================================================================

  function renderLaporan(root) {
    const monthlyStats = computeMonthlyChartData();
    const catBreakdown = computeCategoryBreakdown();

    root.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Laporan &amp; Backup Data</h1>
          <p class="page-subtitle">Analisis tren arus kasbon bulanan, ekspor spreadsheet, dan cadangan data offline.</p>
        </div>
      </div>

      <section class="report-grid">
        <article class="panel-card">
          <h2 class="panel-title">Tren 6 Bulan Terakhir</h2>
          <p class="panel-sub">Perbandingan nominal kasbon keluar dan pembayaran yang masuk tiap bulan.</p>
          <div class="chart-legend">
            <span><span class="legend-dot" style="background:var(--amber-bar);"></span>Kasbon Keluar</span>
            <span><span class="legend-dot" style="background:var(--emerald-bar);"></span>Pembayaran Masuk</span>
          </div>
          <div class="svg-chart-wrap">
            ${buildMonthlySvgChart(monthlyStats)}
          </div>
        </article>

        <article class="panel-card">
          <h2 class="panel-title">Komposisi Piutang Aktif</h2>
          <p class="panel-sub">Distribusi sisa belum lunas berdasarkan kategori.</p>
          <div class="category-list">
            ${catBreakdown.html}
          </div>
        </article>
      </section>

      <section class="panel-card">
        <h2 class="panel-title">Ekspor, Laporan WhatsApp &amp; Cadangan</h2>
        <p class="panel-sub">Seluruh data tersimpan 100% lokal di browser perangkat Anda. Simpan cadangan berkala agar aman saat ganti perangkat.</p>

        <div class="backup-grid">
          <div class="backup-tile">
            <h4>Salin Laporan Grup WhatsApp</h4>
            <p>Format teks ringkas dan rapi berisi total piutang aktif serta daftar yang belum lunas, siap ditempel ke WA.</p>
            <button type="button" class="btn btn-wa btn-sm" id="repCopyWaBtn">${ICONS.copy} Salin Laporan WA</button>
          </div>

          <div class="backup-tile">
            <h4>Ekspor Spreadsheet (CSV / Excel)</h4>
            <p>Unduh seluruh tabel catatan kasbon dalam format CSV yang langsung rapi dibuka di Microsoft Excel &amp; Google Sheets.</p>
            <button type="button" class="btn btn-primary btn-sm" id="repExportCsvBtn">${ICONS.download} Unduh File CSV</button>
          </div>

          <div class="backup-tile">
            <h4>Backup &amp; Restore JSON</h4>
            <p>Simpan seluruh data beserta riwayat cicilan ke file JSON, atau pulihkan dari file backup sebelumnya.</p>
            <div class="action-group">
              <button type="button" class="btn btn-secondary btn-sm" id="repExportJsonBtn">${ICONS.download} Backup JSON</button>
              <button type="button" class="btn btn-secondary btn-sm" id="repImportJsonBtn">${ICONS.upload} Restore JSON</button>
            </div>
          </div>

          <div class="backup-tile">
            <h4>Kelola Data Demo / Reset</h4>
            <p>Muat ulang data contoh untuk simulasi atau bersihkan seluruh catatan kasbon dari perangkat ini.</p>
            <div class="action-group">
              <button type="button" class="btn btn-soft btn-sm" id="repLoadDemoBtn">Muat Data Contoh</button>
              <button type="button" class="btn btn-danger-soft btn-sm" id="repResetBtn">${ICONS.trash} Hapus Semua</button>
            </div>
          </div>
        </div>
      </section>
    `;

    document.getElementById('repCopyWaBtn').addEventListener('click', () => {
      copyText(S.buildReportWhatsAppText(state), 'Laporan WhatsApp berhasil disalin ke clipboard');
    });

    document.getElementById('repExportCsvBtn').addEventListener('click', () => {
      if (state.records.length === 0) {
        showToast('Belum ada data untuk diekspor');
        return;
      }
      S.exportCSV(state.records);
      showToast('File CSV berhasil diunduh');
    });

    document.getElementById('repExportJsonBtn').addEventListener('click', () => {
      S.exportJSON(state);
      showToast('Backup JSON berhasil diunduh');
    });

    document.getElementById('repImportJsonBtn').addEventListener('click', () => {
      const input = document.getElementById('jsonImportInput');
      input.value = '';
      input.click();
    });

    document.getElementById('repLoadDemoBtn').addEventListener('click', () => {
      openConfirm(
        'Muat Data Contoh?',
        'Data saat ini akan diganti dengan 6 contoh transaksi kasbon untuk simulasi.',
        () => {
          state.records = S.createDemoRecords();
          state.isDemoMode = true;
          S.saveState(state);
          render();
          showToast('Data contoh berhasil dimuat');
        }
      );
    });

    document.getElementById('repResetBtn').addEventListener('click', () => {
      openConfirm(
        'Hapus Semua Data Kasbon?',
        'Tindakan ini akan menghapus seluruh catatan kasbon dan riwayat cicilan dari perangkat ini. Pastikan Anda sudah Backup JSON bila diperlukan.',
        () => {
          state.records = [];
          state.isDemoMode = false;
          S.saveState(state);
          render();
          showToast('Seluruh data berhasil dihapus');
        }
      );
    });
  }

  function computeMonthlyChartData() {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      buckets.push({
        ym,
        label: U.MONTHS_ID[d.getMonth()],
        out: 0,
        in: 0
      });
    }

    const byYm = new Map(buckets.map((b) => [b.ym, b]));
    state.records.forEach((r) => {
      const rYm = (r.date || '').slice(0, 7);
      if (byYm.has(rYm)) byYm.get(rYm).out += r.amount;
      r.payments.forEach((p) => {
        const pYm = (p.date || '').slice(0, 7);
        if (byYm.has(pYm)) byYm.get(pYm).in += p.amount;
      });
    });

    return buckets;
  }

  function buildMonthlySvgChart(buckets) {
    const maxVal = Math.max(100000, ...buckets.map((b) => Math.max(b.out, b.in)));
    const width = 520;
    const height = 210;
    const padLeft = 10;
    const padBottom = 34;
    const padTop = 22;
    const chartH = height - padTop - padBottom;
    const groupW = (width - padLeft * 2) / buckets.length;
    const barW = 20;
    const gap = 6;

    const gridLines = [0, 0.5, 1]
      .map((ratio) => {
        const y = padTop + chartH * (1 - ratio);
        return `<line x1="${padLeft}" y1="${y}" x2="${width - padLeft}" y2="${y}" stroke="currentColor" stroke-opacity="0.09" stroke-dasharray="4 4"/>`;
      })
      .join('');

    const bars = buckets
      .map((b, i) => {
        const cx = padLeft + i * groupW + groupW / 2;
        const hOut = Math.round((b.out / maxVal) * chartH);
        const hIn = Math.round((b.in / maxVal) * chartH);
        const yOut = padTop + chartH - hOut;
        const yIn = padTop + chartH - hIn;
        const xOut = cx - barW - gap / 2;
        const xIn = cx + gap / 2;

        return `
          <g>
            <rect x="${xOut}" y="${yOut}" width="${barW}" height="${Math.max(2, hOut)}" rx="5" fill="var(--amber-bar)">
              <title>${b.label}: Kasbon Keluar ${U.formatRupiah(b.out)}</title>
            </rect>
            <rect x="${xIn}" y="${yIn}" width="${barW}" height="${Math.max(2, hIn)}" rx="5" fill="var(--emerald-bar)">
              <title>${b.label}: Pembayaran Masuk ${U.formatRupiah(b.in)}</title>
            </rect>
            <text x="${cx}" y="${height - 10}" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink-muted)">${b.label}</text>
          </g>
        `;
      })
      .join('');

    return `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="210" role="img" aria-label="Grafik Kasbon Keluar dan Pembayaran Masuk 6 Bulan Terakhir">
        ${gridLines}
        ${bars}
      </svg>
    `;
  }

  function computeCategoryBreakdown() {
    const totals = {};
    let grandRemaining = 0;

    Object.keys(U.CATEGORIES).forEach((k) => {
      totals[k] = { remaining: 0, count: 0 };
    });

    state.records.forEach((r) => {
      const rem = U.calcRemaining(r);
      if (rem > 0) {
        const key = totals[r.category] ? r.category : 'pelanggan';
        totals[key].remaining += rem;
        totals[key].count += 1;
        grandRemaining += rem;
      }
    });

    if (grandRemaining <= 0) {
      return {
        html: '<p style="font-size:13.5px;color:var(--ink-muted);padding:12px 0;">Semua kasbon sudah lunas. Tidak ada piutang aktif.</p>'
      };
    }

    const html = Object.keys(U.CATEGORIES)
      .map((k) => {
        const info = totals[k];
        const pct = Math.round((info.remaining / grandRemaining) * 100);
        return `
          <div>
            <div class="cat-row-top tabular">
              <span>${U.CATEGORIES[k].label} <span style="color:var(--ink-muted);font-weight:500;">(${info.count})</span></span>
              <span>${U.formatRupiah(info.remaining)} · ${pct}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" style="width:${pct}%;background:var(--brand);"></div>
            </div>
          </div>
        `;
      })
      .join('');

    return { html };
  }

  // =========================================================================
  // MODALS: Add / Edit Kasbon
  // =========================================================================

  function openKasbonModal(editId, prefill) {
    const form = document.getElementById('kasbonForm');
    form.reset();
    hideError('kbFormError');

    // Populate borrower datalist suggestions
    const names = Array.from(new Set(state.records.map((r) => r.borrowerName.trim()).filter(Boolean)));
    document.getElementById('borrowerSuggestions').innerHTML = names
      .map((n) => `<option value="${U.escapeHtml(n)}">`)
      .join('');

    const titleEl = document.getElementById('kasbonModalTitle');
    const submitEl = document.getElementById('kbSubmitBtn');

    if (editId) {
      const rec = state.records.find((r) => r.id === editId);
      if (!rec) return;
      titleEl.textContent = 'Edit Catatan Kasbon';
      submitEl.textContent = 'Simpan Perubahan';
      document.getElementById('kbEditId').value = rec.id;
      document.getElementById('kbBorrowerName').value = rec.borrowerName;
      document.getElementById('kbPhone').value = rec.phone || '';
      document.getElementById('kbAmount').value = U.formatInputThousands(rec.amount);
      document.getElementById('kbCategory').value = rec.category;
      document.getElementById('kbDate').value = rec.date || U.todayISO();
      document.getElementById('kbDescription').value = rec.description;
      document.getElementById('kbDueDate').value = rec.dueDate || '';
      document.getElementById('kbNotes').value = rec.notes || '';
    } else {
      titleEl.textContent = 'Catat Kasbon Baru';
      submitEl.textContent = 'Simpan Kasbon';
      document.getElementById('kbEditId').value = '';
      document.getElementById('kbDate').value = U.todayISO();
      document.getElementById('kbDueDate').value = U.addDaysISO(14);
      if (prefill) {
        if (prefill.borrowerName) document.getElementById('kbBorrowerName').value = prefill.borrowerName;
        if (prefill.phone) document.getElementById('kbPhone').value = prefill.phone;
        if (prefill.category) document.getElementById('kbCategory').value = prefill.category;
      }
    }

    openModal('kasbonModal');
    setTimeout(() => document.getElementById('kbBorrowerName').focus(), 80);
  }

  function handleKasbonSubmit(e) {
    e.preventDefault();
    hideError('kbFormError');

    const editId = document.getElementById('kbEditId').value.trim();
    const borrowerName = document.getElementById('kbBorrowerName').value.trim();
    const phone = document.getElementById('kbPhone').value.trim();
    const amount = U.parseRupiahInput(document.getElementById('kbAmount').value);
    const category = document.getElementById('kbCategory').value;
    const date = document.getElementById('kbDate').value || U.todayISO();
    const description = document.getElementById('kbDescription').value.trim();
    const dueDate = document.getElementById('kbDueDate').value || '';
    const notes = document.getElementById('kbNotes').value.trim();

    if (!borrowerName) {
      return showError('kbFormError', 'Nama peminjam wajib diisi.');
    }
    if (amount <= 0) {
      return showError('kbFormError', 'Nominal kasbon harus lebih dari Rp 0.');
    }
    if (!description) {
      return showError('kbFormError', 'Keperluan / keterangan kasbon wajib diisi.');
    }

    if (editId) {
      const rec = state.records.find((r) => r.id === editId);
      if (!rec) return;
      const alreadyPaid = U.calcPaidAmount(rec);
      if (amount < alreadyPaid) {
        return showError(
          'kbFormError',
          'Nominal kasbon tidak boleh lebih kecil dari jumlah yang sudah dibayar (' + U.formatRupiah(alreadyPaid) + ').'
        );
      }
      rec.borrowerName = borrowerName;
      rec.phone = phone;
      rec.amount = amount;
      rec.category = category;
      rec.date = date;
      rec.description = description;
      rec.dueDate = dueDate;
      rec.notes = notes;
      showToast('Catatan kasbon diperbarui');
    } else {
      const newRecord = S.sanitizeRecord({
        id: U.generateId('KB'),
        borrowerName,
        phone,
        category,
        description,
        amount,
        date,
        dueDate,
        notes,
        createdAt: new Date().toISOString(),
        payments: []
      });
      state.records.unshift(newRecord);
      showToast('Kasbon ' + borrowerName + ' berhasil dicatat');
    }

    S.saveState(state);
    closeModal('kasbonModal');
    render();
  }

  // =========================================================================
  // MODALS: Bayar / Cicil
  // =========================================================================

  function openPaymentModal(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;
    const remaining = U.calcRemaining(rec);
    if (remaining <= 0) {
      showToast('Kasbon ini sudah lunas');
      return;
    }

    document.getElementById('paymentForm').reset();
    hideError('payFormError');
    document.getElementById('payRecordId').value = rec.id;
    document.getElementById('payDate').value = U.todayISO();
    document.getElementById('payAmount').value = U.formatInputThousands(remaining);

    document.getElementById('paySummaryCallout').innerHTML = `
      <div>
        <div style="font-weight:700;">${U.escapeHtml(rec.borrowerName)}</div>
        <div style="font-size:12.5px;color:var(--ink-secondary);">${U.escapeHtml(rec.description)}</div>
      </div>
      <div class="tabular" style="text-align:right;">
        <div style="font-size:11.5px;color:var(--ink-muted);font-weight:600;">SISA TAGIHAN</div>
        <div style="font-size:18px;font-weight:800;color:var(--amber-ink);">${U.formatRupiah(remaining)}</div>
      </div>
    `;

    const presets = [
      { label: '25%', val: Math.max(1000, Math.round((remaining * 0.25) / 1000) * 1000) },
      { label: '50%', val: Math.max(1000, Math.round((remaining * 0.5) / 1000) * 1000) },
      { label: 'Lunas (' + U.formatCompactRupiah(remaining) + ')', val: remaining }
    ];

    const chipsWrap = document.getElementById('payQuickChips');
    chipsWrap.innerHTML = presets
      .map((p) => `<button type="button" class="quick-chip" data-pay-preset="${Math.min(remaining, p.val)}">${p.label}</button>`)
      .join('');

    chipsWrap.querySelectorAll('[data-pay-preset]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const val = Number(chip.getAttribute('data-pay-preset')) || 0;
        document.getElementById('payAmount').value = U.formatInputThousands(val);
      });
    });

    openModal('paymentModal');
    setTimeout(() => document.getElementById('payAmount').focus(), 80);
  }

  function handlePaymentSubmit(e) {
    e.preventDefault();
    hideError('payFormError');

    const recordId = document.getElementById('payRecordId').value;
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;

    const remaining = U.calcRemaining(rec);
    const amount = U.parseRupiahInput(document.getElementById('payAmount').value);
    const date = document.getElementById('payDate').value || U.todayISO();
    const method = document.getElementById('payMethod').value;
    const note = document.getElementById('payNote').value.trim();

    if (amount <= 0) {
      return showError('payFormError', 'Nominal pembayaran harus lebih dari Rp 0.');
    }
    if (amount > remaining) {
      return showError(
        'payFormError',
        'Nominal pembayaran melebihi sisa tagihan (' + U.formatRupiah(remaining) + ').'
      );
    }

    rec.payments.push({
      id: U.generateId('PY'),
      amount,
      date,
      method,
      note
    });

    S.saveState(state);
    closeModal('paymentModal');
    render();

    const newRemaining = U.calcRemaining(rec);
    if (newRemaining <= 0) {
      showToast('Alhamdulillah! Kasbon ' + rec.borrowerName + ' kini LUNAS');
    } else {
      showToast('Cicilan ' + U.formatRupiah(amount) + ' berhasil dicatat');
    }
  }

  // =========================================================================
  // MODALS: Detail & Riwayat Pembayaran
  // =========================================================================

  function openDetailModal(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;

    const paid = U.calcPaidAmount(rec);
    const rem = U.calcRemaining(rec);
    const status = U.getRecordStatus(rec);
    const cat = U.CATEGORIES[rec.category] ? U.CATEGORIES[rec.category].label : rec.category;

    document.getElementById('detailModalTitle').textContent = 'Detail Kasbon · ' + rec.id;

    document.getElementById('detailModalBody').innerHTML = `
      <div class="summary-callout">
        <div>
          <div style="font-size:16px;font-weight:800;">${U.escapeHtml(rec.borrowerName)}</div>
          <div style="font-size:13px;color:var(--ink-secondary);margin-top:2px;">${U.escapeHtml(rec.description)}</div>
          <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
            <span class="badge ${status.badgeClass}">${U.escapeHtml(status.label)}</span>
            <span class="badge badge-cat">${U.escapeHtml(cat)}</span>
          </div>
        </div>
        <div class="tabular" style="text-align:right;">
          <div style="font-size:11.5px;color:var(--ink-muted);font-weight:600;">SISA TAGIHAN</div>
          <div style="font-size:20px;font-weight:800;color:${rem > 0 ? 'var(--amber-ink)' : 'var(--emerald-ink)'};">
            ${rem > 0 ? U.formatRupiah(rem) : 'LUNAS'}
          </div>
          <div style="font-size:12px;color:var(--ink-muted);">Total ${U.formatRupiah(rec.amount)}</div>
        </div>
      </div>

      <div class="contact-stats tabular">
        <div>
          <div class="stat-mini-label">Tanggal Kasbon</div>
          <div class="stat-mini-value" style="font-size:14px;">${U.formatDateID(rec.date, true)}</div>
        </div>
        <div>
          <div class="stat-mini-label">Jatuh Tempo</div>
          <div class="stat-mini-value" style="font-size:14px;">${rec.dueDate ? U.formatDateID(rec.dueDate, true) : 'Tidak ditentukan'}</div>
        </div>
        <div>
          <div class="stat-mini-label">No. WhatsApp</div>
          <div class="stat-mini-value" style="font-size:14px;">${rec.phone ? U.escapeHtml(rec.phone) : '-'}</div>
        </div>
        <div>
          <div class="stat-mini-label">Total Terbayar</div>
          <div class="stat-mini-value" style="font-size:14px;color:var(--emerald-ink);">${U.formatRupiah(paid)}</div>
        </div>
      </div>

      ${
        rec.notes
          ? `<div style="font-size:13.5px;color:var(--ink-secondary);background:var(--bg-canvas);padding:10px 13px;border-radius:var(--radius-md);">
               <strong>Catatan:</strong> ${U.escapeHtml(rec.notes)}
             </div>`
          : ''
      }

      <div>
        <div style="font-size:13px;font-weight:700;color:var(--ink-secondary);margin-bottom:8px;">
          Riwayat Cicilan &amp; Pembayaran (${rec.payments.length})
        </div>
        ${
          rec.payments.length === 0
            ? '<p style="font-size:13.5px;color:var(--ink-muted);">Belum ada pembayaran masuk untuk kasbon ini.</p>'
            : `<div class="payment-history-list">
                 ${rec.payments
                   .map(
                     (p) => `
                     <div class="payment-item">
                       <div>
                         <div style="font-weight:700;font-size:14px;color:var(--emerald-ink);" class="tabular">+${U.formatRupiah(p.amount)}</div>
                         <div style="font-size:12.5px;color:var(--ink-muted);" class="tabular">
                           ${U.formatDateID(p.date)} · ${U.escapeHtml(p.method)}${p.note ? ' · ' + U.escapeHtml(p.note) : ''}
                         </div>
                       </div>
                       <button type="button" class="btn btn-ghost btn-sm" data-del-payment="${p.id}" title="Hapus pembayaran ini" aria-label="Hapus pembayaran">
                         ${ICONS.trash}
                       </button>
                     </div>
                   `
                   )
                   .join('')}
               </div>`
        }
      </div>
    `;

    document.getElementById('detailModalFooter').innerHTML = `
      <button type="button" class="btn btn-danger-soft btn-sm" id="detailDeleteRecordBtn" style="margin-right:auto;">${ICONS.trash} Hapus Kasbon</button>
      <button type="button" class="btn btn-secondary btn-sm" id="detailReceiptBtn">${ICONS.receipt} Nota PNG</button>
      ${
        rem > 0
          ? `<button type="button" class="btn btn-primary btn-sm" id="detailPayBtn">${ICONS.wallet} Bayar / Cicil</button>`
          : ''
      }
    `;

    // Wire detail buttons
    document.getElementById('detailReceiptBtn').addEventListener('click', () => {
      closeModal('detailModal');
      openReceiptModal(rec.id);
    });

    const payBtn = document.getElementById('detailPayBtn');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        closeModal('detailModal');
        openPaymentModal(rec.id);
      });
    }

    document.getElementById('detailDeleteRecordBtn').addEventListener('click', () => {
      openConfirm(
        'Hapus Catatan Kasbon?',
        'Kasbon atas nama ' + rec.borrowerName + ' (' + U.formatRupiah(rec.amount) + ') beserta riwayat pembayarannya akan dihapus permanen.',
        () => {
          state.records = state.records.filter((item) => item.id !== rec.id);
          S.saveState(state);
          closeModal('detailModal');
          render();
          showToast('Catatan kasbon dihapus');
        }
      );
    });

    document.querySelectorAll('[data-del-payment]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const payId = btn.getAttribute('data-del-payment');
        openConfirm(
          'Batalkan Pembayaran Ini?',
          'Entri cicilan ini akan dihapus dan sisa tagihan akan otomatis dihitung ulang.',
          () => {
            rec.payments = rec.payments.filter((p) => p.id !== payId);
            S.saveState(state);
            render();
            openDetailModal(rec.id);
            showToast('Pembayaran dibatalkan');
          }
        );
      });
    });

    openModal('detailModal');
  }

  // =========================================================================
  // MODALS: WhatsApp Reminder & Digital Receipt & Settings
  // =========================================================================

  function openWaModalForRecord(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;
    ui.activeWaRecordId = rec.id;
    ui.activeWaTone = 'sopan';

    document.getElementById('waModalTitle').textContent = 'Tagih via WhatsApp — ' + rec.borrowerName;
    document.getElementById('waToneGroup').style.display = 'flex';
    document.querySelectorAll('[data-wa-tone]').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-wa-tone') === 'sopan')
    );
    document.getElementById('waPhoneInput').value = rec.phone || '';
    document.getElementById('waMessagePreview').value = U.buildWhatsAppMessage(
      rec,
      state.settings,
      'sopan'
    );
    openModal('waModal');
  }

  function openWaModalCustom(phone, message, title) {
    ui.activeWaRecordId = null;
    document.getElementById('waModalTitle').textContent = title || 'Kirim Pesan WhatsApp';
    document.getElementById('waToneGroup').style.display = 'none';
    document.getElementById('waPhoneInput').value = phone || '';
    document.getElementById('waMessagePreview').value = message;
    openModal('waModal');
  }

  function openReceiptModal(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;
    ui.activeReceiptRecord = rec;
    const canvas = document.getElementById('receiptCanvas');
    R.renderReceiptToCanvas(canvas, rec, state.settings);
    openModal('receiptModal');
  }

  function openSettingsModal() {
    document.getElementById('setBusinessName').value = state.settings.businessName || '';
    document.getElementById('setPaymentInfo').value = state.settings.paymentInfo || '';
    openModal('settingsModal');
  }

  function handleSettingsSubmit(e) {
    e.preventDefault();
    state.settings.businessName = document.getElementById('setBusinessName').value.trim() || 'KasbonKu';
    state.settings.paymentInfo = document.getElementById('setPaymentInfo').value.trim();
    S.saveState(state);
    updateBusinessLabels();
    closeModal('settingsModal');
    showToast('Profil usaha & info rekening disimpan');
  }

  function handleJSONFileImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = S.parseImportedJSON(String(reader.result || ''));
        openConfirm(
          'Pulihkan Data Backup?',
          'Ditemukan ' + imported.records.length + ' catatan kasbon di file backup. Data saat ini akan diganti dengan data backup tersebut.',
          () => {
            state.records = imported.records;
            if (imported.settings) {
              state.settings = imported.settings;
              applyTheme(state.settings.theme || 'light');
              updateBusinessLabels();
            }
            state.isDemoMode = false;
            S.saveState(state);
            render();
            showToast(imported.records.length + ' catatan kasbon berhasil dipulihkan');
          }
        );
      } catch (err) {
        showToast('Gagal membaca file backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // Modal, Confirm, Clipboard & Toast Helpers
  // =========================================================================

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  function openConfirm(title, message, onOk) {
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').textContent = message;
    ui.confirmCallback = onOk;
    openModal('confirmModal');
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
  }

  function hideError(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = '';
    el.classList.remove('visible');
  }

  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast(successMsg || 'Teks berhasil disalin'))
        .catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Teks berhasil disalin');
    } catch (_) {
      showToast('Gagal menyalin otomatis, silakan salin manual');
    }
    document.body.removeChild(ta);
  }

  function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
