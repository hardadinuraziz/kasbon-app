/**
 * KasbonKu — Minimalist Notebook Glassmorphism Controller
 * Pure Vanilla JS | Offline-First | Low-Text Ledger UI
 */
(function (global) {
  'use strict';

  const U = global.KasbonUtils;
  const S = global.KasbonStorage;
  const R = global.KasbonReceipt;

  const ICONS = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>',
    receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    arrowDownLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7 7 17"/><path d="M17 17H7V7"/></svg>',
    arrowUpRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
  };

  let state = S.loadState();

  const ui = {
    view: 'beranda',
    search: '',
    statusFilter: 'semua',
    sortBy: 'terbaru',
    mutasiType: 'semua',
    mutasiMonth: 'semua',
    activeWaRecordId: null,
    activeWaTone: 'sopan',
    activeReceiptRecord: null,
    confirmCallback: null
  };

  // =========================================================================
  // Initialization
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
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  function bindStaticEvents() {
    document.querySelectorAll('[data-view]').forEach((btn) => {
      btn.addEventListener('click', () => setView(btn.getAttribute('data-view')));
    });

    document.getElementById('topNewKasbonBtn').addEventListener('click', () => openKasbonModal());
    document.getElementById('mobileNewKasbonBtn').addEventListener('click', () => openKasbonModal());
    document.getElementById('themeToggleBtn').addEventListener('click', toggleTheme);
    document.getElementById('settingsOpenBtn').addEventListener('click', openSettingsModal);

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
        if (openModals.length > 0) closeModal(openModals[openModals.length - 1].id);
      }
    });

    const kbAmount = document.getElementById('kbAmount');
    kbAmount.addEventListener('input', () => {
      kbAmount.value = U.formatInputThousands(kbAmount.value);
    });

    const payAmount = document.getElementById('payAmount');
    payAmount.addEventListener('input', () => {
      payAmount.value = U.formatInputThousands(payAmount.value);
    });

    document.querySelectorAll('[data-add-amount]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const addVal = Number(chip.getAttribute('data-add-amount')) || 0;
        const current = U.parseRupiahInput(kbAmount.value);
        kbAmount.value = U.formatInputThousands(current + addVal);
      });
    });

    const kbBorrowerName = document.getElementById('kbBorrowerName');
    kbBorrowerName.addEventListener('change', () => {
      const entered = kbBorrowerName.value.trim().toLowerCase();
      if (!entered) return;
      const existing = state.records.find((r) => r.borrowerName.toLowerCase() === entered);
      if (existing) {
        const phoneInput = document.getElementById('kbPhone');
        if (!phoneInput.value.trim() && existing.phone) phoneInput.value = existing.phone;
        document.getElementById('kbCategory').value = existing.category;
      }
    });

    document.getElementById('kasbonForm').addEventListener('submit', handleKasbonSubmit);
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmit);
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);

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
      copyText(document.getElementById('waMessagePreview').value, 'Pesan disalin');
    });

    document.getElementById('waSendBtn').addEventListener('click', () => {
      const msg = document.getElementById('waMessagePreview').value;
      const phone = U.normalizePhoneWA(document.getElementById('waPhoneInput').value);
      const url = phone
        ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent(msg)
        : 'https://wa.me/?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener');
    });

    document.getElementById('downloadReceiptBtn').addEventListener('click', () => {
      if (!ui.activeReceiptRecord) return;
      R.downloadReceiptCanvas(document.getElementById('receiptCanvas'), ui.activeReceiptRecord);
      showToast('Nota PNG diunduh');
    });

    document.getElementById('confirmModalOkBtn').addEventListener('click', () => {
      const cb = ui.confirmCallback;
      closeModal('confirmModal');
      if (typeof cb === 'function') cb();
    });

    document.getElementById('jsonImportInput').addEventListener('change', handleJSONFileImport);
  }

  // =========================================================================
  // Theme, Labels & Navigation
  // =========================================================================

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggleBtn').innerHTML = isDark ? ICONS.sun : ICONS.moon;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', isDark ? '#101312' : '#EEEAE0');
  }

  function toggleTheme() {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    S.saveState(state);
    applyTheme(state.settings.theme);
  }

  function updateBusinessLabels() {
    const raw = (state.settings.businessName || '').trim();
    const shortName = raw.replace(/^KasbonKu\s*[—-]\s*/i, '') || 'Buku Catatan';
    document.getElementById('dockBusinessName').textContent = shortName;
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
  // Aggregations
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
          name: r.borrowerName.trim(),
          phone: r.phone || '',
          category: r.category,
          records: [],
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
    const sum = computeSummary();
    const contacts = computeContacts();
    document.getElementById('navActiveCount').textContent = sum.activeCount;
    document.getElementById('navContactCount').textContent = contacts.length;
  }

  function render() {
    updateNavCounts();
    const root = document.getElementById('appRoot');
    if (ui.view === 'beranda') renderBeranda(root);
    else if (ui.view === 'kontak') renderKontak(root);
    else if (ui.view === 'mutasi') renderMutasi(root);
    else if (ui.view === 'laporan') renderLaporan(root);
  }

  // =========================================================================
  // VIEW 1: BUKU KASBON
  // =========================================================================

  function renderBeranda(root) {
    const sum = computeSummary();

    root.innerHTML = `
      <div class="book-header">
        <div class="book-title-group">
          <h1 class="book-title">Buku Kasbon</h1>
          <span class="book-date mono">${U.formatDateID(U.todayISO())}</span>
        </div>
        <div class="book-header-right">
          ${state.isDemoMode ? '<button type="button" class="whisper-pill" id="clearDemoBtn">Data Contoh · Kosongkan</button>' : ''}
          <button type="button" class="whisper-pill" id="quickCopyReportBtn" title="Salin rekap teks untuk WhatsApp">
            ${ICONS.copy}
            <span>Rekap WA</span>
          </button>
        </div>
      </div>

      <section class="summary-strip glass-panel" aria-label="Ringkasan">
        <button type="button" class="summary-cell" id="sumActiveBtn">
          <div class="summary-k">
            <span>Aktif</span>
            <span class="summary-tag mono">${sum.activeCount}</span>
          </div>
          <div class="summary-v amber mono">${U.formatRupiah(sum.totalRemaining)}</div>
        </button>

        <button type="button" class="summary-cell" id="sumPaidBtn">
          <div class="summary-k">
            <span>Masuk</span>
            <span class="summary-tag mono">${sum.recoveryRate}%</span>
          </div>
          <div class="summary-v emerald mono">${U.formatRupiah(sum.totalPaid)}</div>
        </button>

        <button type="button" class="summary-cell" id="sumOverdueBtn">
          <div class="summary-k">
            <span>Tempo</span>
            <span class="summary-tag mono">${sum.overdueCount}</span>
          </div>
          <div class="summary-v ${sum.overdueCount > 0 ? 'crimson' : 'emerald'} mono">${U.formatRupiah(sum.overdueAmount)}</div>
        </button>
      </section>

      <section class="filter-bar" aria-label="Filter">
        <div class="search-pill">
          ${ICONS.search}
          <input type="search" id="searchKasbonInput" class="search-field" value="${U.escapeHtml(ui.search)}" placeholder="Cari nama atau keperluan...">
        </div>

        <div class="seg-pills" role="tablist">
          ${renderStatusPill('semua', 'Semua')}
          ${renderStatusPill('belum_lunas', 'Aktif')}
          ${renderStatusPill('jatuh_tempo', 'Tempo')}
          ${renderStatusPill('lunas', 'Lunas')}
        </div>

        <select id="sortFilterSelect" class="select-pill" aria-label="Urutkan">
          <option value="terbaru" ${ui.sortBy === 'terbaru' ? 'selected' : ''}>Terbaru</option>
          <option value="sisa_terbesar" ${ui.sortBy === 'sisa_terbesar' ? 'selected' : ''}>Nominal</option>
          <option value="jatuh_tempo" ${ui.sortBy === 'jatuh_tempo' ? 'selected' : ''}>Tempo</option>
          <option value="nama_az" ${ui.sortBy === 'nama_az' ? 'selected' : ''}>A–Z</option>
        </select>
      </section>

      <section id="ledgerListContainer" class="ledger-sheet glass-panel ruled" aria-live="polite"></section>
    `;

    document.getElementById('quickCopyReportBtn').addEventListener('click', () => {
      copyText(S.buildReportWhatsAppText(state), 'Rekap WA disalin');
    });

    const clearDemoBtn = document.getElementById('clearDemoBtn');
    if (clearDemoBtn) {
      clearDemoBtn.addEventListener('click', () => {
        openConfirm('Kosongkan Buku?', 'Hapus seluruh data contoh dan mulai catatan baru?', () => {
          state.records = [];
          state.isDemoMode = false;
          S.saveState(state);
          render();
          showToast('Buku dikosongkan');
        });
      });
    }

    document.getElementById('sumActiveBtn').addEventListener('click', () => setStatusFilter('belum_lunas'));
    document.getElementById('sumPaidBtn').addEventListener('click', () => setStatusFilter('lunas'));
    document.getElementById('sumOverdueBtn').addEventListener('click', () => setStatusFilter('jatuh_tempo'));

    document.getElementById('searchKasbonInput').addEventListener('input', (e) => {
      ui.search = e.target.value;
      renderLedgerRows();
    });

    document.getElementById('sortFilterSelect').addEventListener('change', (e) => {
      ui.sortBy = e.target.value;
      renderLedgerRows();
    });

    document.querySelectorAll('[data-status-filter]').forEach((pill) => {
      pill.addEventListener('click', () => setStatusFilter(pill.getAttribute('data-status-filter')));
    });

    renderLedgerRows();
  }

  function renderStatusPill(code, label) {
    return `<button type="button" class="seg-pill ${ui.statusFilter === code ? 'active' : ''}" data-status-filter="${code}">${label}</button>`;
  }

  function setStatusFilter(code) {
    ui.statusFilter = code;
    document.querySelectorAll('[data-status-filter]').forEach((pill) => {
      pill.classList.toggle('active', pill.getAttribute('data-status-filter') === code);
    });
    renderLedgerRows();
  }

  function getFilteredRecords() {
    const q = ui.search.trim().toLowerCase();

    const filtered = state.records.filter((r) => {
      const status = U.getRecordStatus(r);
      const rem = U.calcRemaining(r);

      if (ui.statusFilter === 'belum_lunas' && rem <= 0) return false;
      if (ui.statusFilter === 'lunas' && rem > 0) return false;
      if (ui.statusFilter === 'jatuh_tempo' && status.code !== 'jatuh_tempo') return false;

      if (q) {
        const hay = (r.borrowerName + ' ' + r.description + ' ' + r.phone + ' ' + r.notes).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      if (ui.sortBy === 'sisa_terbesar') return U.calcRemaining(b) - U.calcRemaining(a);
      if (ui.sortBy === 'nama_az') return a.borrowerName.localeCompare(b.borrowerName, 'id');
      if (ui.sortBy === 'jatuh_tempo') {
        const aPaid = U.calcRemaining(a) <= 0;
        const bPaid = U.calcRemaining(b) <= 0;
        if (aPaid !== bPaid) return aPaid ? 1 : -1;
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return b.date.localeCompare(a.date);
      }
      if (b.date !== a.date) return b.date.localeCompare(a.date);
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });

    return filtered;
  }

  function renderLedgerRows() {
    const container = document.getElementById('ledgerListContainer');
    if (!container) return;

    const list = getFilteredRecords();

    if (list.length === 0) {
      const hasAny = state.records.length > 0;
      container.classList.remove('ruled');
      container.innerHTML = `
        <div class="empty-sheet">
          <p>${hasAny ? 'Tidak ada catatan cocok.' : 'Buku catatan masih kosong.'}</p>
          ${
            hasAny
              ? '<button type="button" class="btn-glass" id="resetFilterBtn">Tampilkan Semua</button>'
              : '<button type="button" class="btn-ink" id="emptyAddBtn">' + ICONS.plus + ' Catat Pertama</button>'
          }
        </div>
      `;
      const resetBtn = document.getElementById('resetFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          ui.search = '';
          ui.statusFilter = 'semua';
          render();
        });
      }
      const addBtn = document.getElementById('emptyAddBtn');
      if (addBtn) addBtn.addEventListener('click', () => openKasbonModal());
      return;
    }

    container.classList.add('ruled');
    container.innerHTML = list.map((r) => buildLedgerRowHtml(r)).join('');

    container.querySelectorAll('.ledger-row').forEach((row) => {
      row.addEventListener('click', () => openDetailModal(row.getAttribute('data-row-id')));
    });

    container.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'pay') openPaymentModal(id);
        else if (action === 'wa') openWaModalForRecord(id);
        else if (action === 'receipt') openReceiptModal(id);
        else if (action === 'edit') openKasbonModal(id);
      });
    });
  }

  function compactDueTag(record, status) {
    if (status.code === 'lunas') return { text: 'Lunas', cls: 'paid' };
    if (!record.dueDate) return { text: '', cls: '' };
    const diff = U.daysDiffFromToday(record.dueDate);
    if (diff === null) return { text: '', cls: '' };
    if (diff < 0) return { text: 'Telat ' + Math.abs(diff) + ' hr', cls: 'overdue' };
    if (diff === 0) return { text: 'Tempo hari ini', cls: 'overdue' };
    if (diff <= 3) return { text: diff + ' hr lagi', cls: 'soon' };
    return { text: 'Tempo ' + U.formatDateID(record.dueDate), cls: '' };
  }

  function buildLedgerRowHtml(r) {
    const paid = U.calcPaidAmount(r);
    const rem = U.calcRemaining(r);
    const pct = r.amount > 0 ? Math.min(100, Math.round((paid / r.amount) * 100)) : 100;
    const status = U.getRecordStatus(r);
    const isPaid = rem <= 0;
    const dotCls = isPaid ? 'paid' : status.code === 'jatuh_tempo' ? 'overdue' : 'active';
    const cat = U.CATEGORIES[r.category] ? U.CATEGORIES[r.category].label.split(' ')[0] : r.category;
    const due = compactDueTag(r, status);

    return `
      <div class="ledger-row ${isPaid ? 'is-paid' : ''}" data-row-id="${r.id}" role="button" tabindex="0">
        <span class="row-dot ${dotCls}" aria-hidden="true"></span>

        <div class="row-main">
          <div class="row-top">
            <span class="row-name">${U.escapeHtml(r.borrowerName)}</span>
            <span class="row-cat">${U.escapeHtml(cat)}</span>
          </div>
          <div class="row-desc">${U.escapeHtml(r.description)}</div>
          <div class="row-meta mono">
            <span>${U.formatDateID(r.date)}</span>
            ${due.text ? `<span>·</span><span class="due-flag ${due.cls}">${U.escapeHtml(due.text)}</span>` : ''}
            ${r.payments.length > 0 ? `<span>·</span><span>${r.payments.length}x</span>` : ''}
          </div>
        </div>

        <div class="row-right">
          <div class="row-figure">
            <div class="fig-main ${dotCls} mono">${isPaid ? 'Lunas' : U.formatRupiah(rem)}</div>
            <div class="fig-sub mono">${isPaid ? U.formatRupiah(r.amount) : 'dari ' + U.formatRupiah(r.amount)}</div>
            ${
              !isPaid && paid > 0
                ? `<div class="hairline-progress" aria-hidden="true"><div class="hairline-fill" style="width:${pct}%;"></div></div>`
                : ''
            }
          </div>

          <div class="row-tools">
            ${!isPaid ? `<button type="button" class="btn-pay" data-action="pay" data-id="${r.id}">Bayar</button>` : ''}
            ${!isPaid ? `<button type="button" class="row-icon-btn wa" data-action="wa" data-id="${r.id}" title="Tagih WhatsApp" aria-label="Tagih WhatsApp">${ICONS.wa}</button>` : ''}
            <button type="button" class="row-icon-btn" data-action="receipt" data-id="${r.id}" title="Nota PNG" aria-label="Nota PNG">${ICONS.receipt}</button>
            <button type="button" class="row-icon-btn" data-action="edit" data-id="${r.id}" title="Edit" aria-label="Edit">${ICONS.edit}</button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VIEW 2: BUKU NAMA
  // =========================================================================

  function renderKontak(root) {
    const contacts = computeContacts();

    root.innerHTML = `
      <div class="book-header">
        <div class="book-title-group">
          <h1 class="book-title">Buku Nama</h1>
          <span class="book-date mono">${contacts.length} orang</span>
        </div>
      </div>

      ${
        contacts.length === 0
          ? `<div class="ledger-sheet glass-panel"><div class="empty-sheet"><p>Belum ada nama tercatat.</p></div></div>`
          : `<section class="name-grid">
               ${contacts.map((c) => buildNameCardHtml(c)).join('')}
             </section>`
      }
    `;

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
          setView('beranda');
        } else if (action === 'wa') {
          const activeRecs = contact.records.filter((r) => U.calcRemaining(r) > 0);
          openWaModalCustom(
            contact.phone,
            U.buildContactSummaryWA(contact.name, activeRecs, state.settings),
            'Rekap — ' + contact.name
          );
        }
      });
    });
  }

  function buildNameCardHtml(c) {
    return `
      <article class="name-card glass-panel">
        <div class="name-head">
          <div class="name-id">
            <div class="mini-avatar">${U.escapeHtml(U.getInitials(c.name))}</div>
            <div style="min-width:0;">
              <div class="row-name">${U.escapeHtml(c.name)}</div>
              <div class="row-cat mono">${c.phone ? U.escapeHtml(c.phone) : '—'} · ${c.records.length}x</div>
            </div>
          </div>
          ${c.overdueCount > 0 ? `<span class="due-flag overdue mono" style="font-size:11.5px;">${c.overdueCount} telat</span>` : ''}
        </div>

        <div class="name-figures mono">
          <div>
            <div class="kv-k">Sisa</div>
            <div style="font-size:16px;font-weight:600;color:${c.totalRemaining > 0 ? 'var(--amber)' : 'var(--emerald)'};">
              ${c.totalRemaining > 0 ? U.formatRupiah(c.totalRemaining) : 'Lunas'}
            </div>
          </div>
          <div style="text-align:right;">
            <div class="kv-k">Masuk</div>
            <div style="font-size:13.5px;font-weight:600;color:var(--emerald);">${U.formatRupiah(c.totalPaid)}</div>
          </div>
        </div>

        <div class="name-foot">
          <button type="button" class="btn-glass" style="padding:5px 11px;font-size:12px;" data-contact-action="filter" data-contact-name="${U.escapeHtml(c.name)}">Lihat</button>
          <div class="row-tools">
            ${c.activeCount > 0 ? `<button type="button" class="row-icon-btn wa" data-contact-action="wa" data-contact-name="${U.escapeHtml(c.name)}" title="Rekap WhatsApp">${ICONS.wa}</button>` : ''}
            <button type="button" class="row-icon-btn" data-contact-action="add" data-contact-name="${U.escapeHtml(c.name)}" title="Catat Kasbon Baru">${ICONS.plus}</button>
          </div>
        </div>
      </article>
    `;
  }

  // =========================================================================
  // VIEW 3: MUTASI
  // =========================================================================

  function renderMutasi(root) {
    const events = [];
    const monthSet = new Set();

    state.records.forEach((r) => {
      if (r.date && r.date.length >= 7) monthSet.add(r.date.slice(0, 7));
      events.push({
        type: 'keluar',
        date: r.date,
        name: r.borrowerName,
        sub: r.description,
        amount: r.amount
      });
      r.payments.forEach((p) => {
        if (p.date && p.date.length >= 7) monthSet.add(p.date.slice(0, 7));
        events.push({
          type: 'masuk',
          date: p.date,
          name: r.borrowerName,
          sub: p.method + (p.note ? ' · ' + p.note : ''),
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
      <div class="book-header">
        <div class="book-title-group">
          <h1 class="book-title">Mutasi</h1>
          <span class="book-date mono">-${U.formatCompactRupiah(totalOut)} / +${U.formatCompactRupiah(totalIn)}</span>
        </div>
      </div>

      <section class="filter-bar">
        <div class="seg-pills">
          <button type="button" class="seg-pill ${ui.mutasiType === 'semua' ? 'active' : ''}" data-mutasi-type="semua">Semua</button>
          <button type="button" class="seg-pill ${ui.mutasiType === 'masuk' ? 'active' : ''}" data-mutasi-type="masuk">Masuk</button>
          <button type="button" class="seg-pill ${ui.mutasiType === 'keluar' ? 'active' : ''}" data-mutasi-type="keluar">Keluar</button>
        </div>

        <select id="mutasiMonthSelect" class="select-pill" aria-label="Bulan">
          <option value="semua" ${ui.mutasiMonth === 'semua' ? 'selected' : ''}>Semua Bulan</option>
          ${months.map((m) => `<option value="${m}" ${ui.mutasiMonth === m ? 'selected' : ''}>${U.formatMonthLabel(m)}</option>`).join('')}
        </select>
      </section>

      <section class="ledger-sheet glass-panel">
        ${
          filtered.length === 0
            ? '<div class="empty-sheet"><p>Belum ada mutasi.</p></div>'
            : filtered
                .map(
                  (ev) => `
                  <div class="mutasi-row">
                    <div class="mutasi-left">
                      <div class="mutasi-mark ${ev.type === 'masuk' ? 'in' : 'out'}">
                        ${ev.type === 'masuk' ? ICONS.arrowDownLeft : ICONS.arrowUpRight}
                      </div>
                      <div style="min-width:0;">
                        <div class="row-name" style="font-size:14px;">${U.escapeHtml(ev.name)}</div>
                        <div class="row-meta mono" style="margin-top:1px;">
                          <span>${U.formatDateID(ev.date)}</span>
                          <span>·</span>
                          <span>${U.escapeHtml(ev.sub)}</span>
                        </div>
                      </div>
                    </div>
                    <div class="mutasi-val mono ${ev.type === 'masuk' ? 'in' : 'out'}">
                      ${ev.type === 'masuk' ? '+' : '-'}${U.formatRupiah(ev.amount)}
                    </div>
                  </div>
                `
                )
                .join('')
        }
      </section>
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
      <div class="book-header">
        <div class="book-title-group">
          <h1 class="book-title">Laporan</h1>
          <span class="book-date mono">${state.records.length} catatan</span>
        </div>
      </div>

      <section class="report-split">
        <article class="glass-box glass-panel">
          <div class="box-head">
            <span class="box-label">6 Bulan</span>
            <div class="legend-inline">
              <span><span class="dot-mini" style="background:var(--amber-bar);"></span>Keluar</span>
              <span><span class="dot-mini" style="background:var(--emerald-bar);"></span>Masuk</span>
            </div>
          </div>
          ${buildMonthlySvgChart(monthlyStats)}
        </article>

        <article class="glass-box glass-panel">
          <div class="box-head">
            <span class="box-label">Kategori Aktif</span>
          </div>
          <div class="cat-bars">
            ${catBreakdown}
          </div>
        </article>
      </section>

      <section class="tools-strip glass-panel" aria-label="Ekspor dan Cadangan">
        <div class="tools-group">
          <button type="button" class="btn-wa" id="repCopyWaBtn">${ICONS.copy} WA</button>
          <button type="button" class="btn-glass" id="repExportCsvBtn">${ICONS.download} CSV</button>
          <button type="button" class="btn-glass" id="repExportJsonBtn">${ICONS.download} Backup</button>
          <button type="button" class="btn-glass" id="repImportJsonBtn">${ICONS.upload} Restore</button>
        </div>
        <div class="tools-group">
          <button type="button" class="btn-glass" id="repLoadDemoBtn">Contoh</button>
          <button type="button" class="btn-danger" id="repResetBtn">Reset</button>
        </div>
      </section>
    `;

    document.getElementById('repCopyWaBtn').addEventListener('click', () => {
      copyText(S.buildReportWhatsAppText(state), 'Laporan WA disalin');
    });

    document.getElementById('repExportCsvBtn').addEventListener('click', () => {
      if (state.records.length === 0) return showToast('Data kosong');
      S.exportCSV(state.records);
      showToast('CSV diunduh');
    });

    document.getElementById('repExportJsonBtn').addEventListener('click', () => {
      S.exportJSON(state);
      showToast('Backup JSON diunduh');
    });

    document.getElementById('repImportJsonBtn').addEventListener('click', () => {
      const input = document.getElementById('jsonImportInput');
      input.value = '';
      input.click();
    });

    document.getElementById('repLoadDemoBtn').addEventListener('click', () => {
      openConfirm('Muat Contoh?', 'Ganti data saat ini dengan data contoh?', () => {
        state.records = S.createDemoRecords();
        state.isDemoMode = true;
        S.saveState(state);
        render();
        showToast('Data contoh dimuat');
      });
    });

    document.getElementById('repResetBtn').addEventListener('click', () => {
      openConfirm('Hapus Semua?', 'Seluruh catatan kasbon akan dihapus dari perangkat ini.', () => {
        state.records = [];
        state.isDemoMode = false;
        S.saveState(state);
        render();
        showToast('Data dihapus');
      });
    });
  }

  function computeMonthlyChartData() {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ym = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
      buckets.push({ ym, label: U.MONTHS_ID[d.getMonth()], out: 0, in: 0 });
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
    const width = 460;
    const height = 180;
    const padX = 8;
    const padTop = 14;
    const padBottom = 28;
    const chartH = height - padTop - padBottom;
    const groupW = (width - padX * 2) / buckets.length;
    const barW = 14;
    const gap = 5;

    const lines = [0, 0.5, 1]
      .map((r) => {
        const y = padTop + chartH * (1 - r);
        return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" stroke="currentColor" stroke-opacity="0.08" stroke-dasharray="3 4"/>`;
      })
      .join('');

    const bars = buckets
      .map((b, i) => {
        const cx = padX + i * groupW + groupW / 2;
        const hOut = Math.round((b.out / maxVal) * chartH);
        const hIn = Math.round((b.in / maxVal) * chartH);
        return `
          <g>
            <rect x="${cx - barW - gap / 2}" y="${padTop + chartH - hOut}" width="${barW}" height="${Math.max(2, hOut)}" rx="4" fill="var(--amber-bar)">
              <title>${b.label} Keluar: ${U.formatRupiah(b.out)}</title>
            </rect>
            <rect x="${cx + gap / 2}" y="${padTop + chartH - hIn}" width="${barW}" height="${Math.max(2, hIn)}" rx="4" fill="var(--emerald-bar)">
              <title>${b.label} Masuk: ${U.formatRupiah(b.in)}</title>
            </rect>
            <text x="${cx}" y="${height - 8}" text-anchor="middle" font-size="11" font-weight="600" fill="var(--ink-3)">${b.label}</text>
          </g>
        `;
      })
      .join('');

    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="180" role="img" aria-label="Grafik Bulanan">${lines}${bars}</svg>`;
  }

  function computeCategoryBreakdown() {
    const totals = {};
    let grand = 0;
    Object.keys(U.CATEGORIES).forEach((k) => {
      totals[k] = 0;
    });

    state.records.forEach((r) => {
      const rem = U.calcRemaining(r);
      if (rem > 0) {
        const key = totals[r.category] !== undefined ? r.category : 'pelanggan';
        totals[key] += rem;
        grand += rem;
      }
    });

    if (grand <= 0) return '<p style="font-size:13px;color:var(--ink-3);">Semua lunas.</p>';

    return Object.keys(U.CATEGORIES)
      .map((k) => {
        const val = totals[k];
        const pct = Math.round((val / grand) * 100);
        const shortLabel = U.CATEGORIES[k].label.split(' ')[0];
        return `
          <div>
            <div class="cat-line">
              <span style="font-weight:600;">${shortLabel}</span>
              <span class="mono" style="color:var(--ink-2);">${U.formatCompactRupiah(val)} · ${pct}%</span>
            </div>
            <div class="hairline-progress" style="height:4px;">
              <div class="hairline-fill" style="width:${pct}%;background:var(--sage);"></div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // =========================================================================
  // MODALS: Catat / Edit, Bayar, Detail, WA, Nota, Profil
  // =========================================================================

  function openKasbonModal(editId, prefill) {
    document.getElementById('kasbonForm').reset();
    hideError('kbFormError');

    const names = Array.from(new Set(state.records.map((r) => r.borrowerName.trim()).filter(Boolean)));
    document.getElementById('borrowerSuggestions').innerHTML = names
      .map((n) => `<option value="${U.escapeHtml(n)}">`)
      .join('');

    if (editId) {
      const rec = state.records.find((r) => r.id === editId);
      if (!rec) return;
      document.getElementById('kasbonModalTitle').textContent = 'Edit Kasbon';
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
      document.getElementById('kasbonModalTitle').textContent = 'Catat Kasbon';
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
    setTimeout(() => document.getElementById('kbBorrowerName').focus(), 60);
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

    if (!borrowerName) return showError('kbFormError', 'Nama wajib diisi.');
    if (amount <= 0) return showError('kbFormError', 'Nominal harus lebih dari 0.');
    if (!description) return showError('kbFormError', 'Keperluan wajib diisi.');

    if (editId) {
      const rec = state.records.find((r) => r.id === editId);
      if (!rec) return;
      const paid = U.calcPaidAmount(rec);
      if (amount < paid) return showError('kbFormError', 'Minimal ' + U.formatRupiah(paid) + ' (sudah dibayar).');
      Object.assign(rec, { borrowerName, phone, amount, category, date, description, dueDate, notes });
      showToast('Tersimpan');
    } else {
      state.records.unshift(
        S.sanitizeRecord({
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
        })
      );
      showToast('Kasbon dicatat');
    }

    S.saveState(state);
    closeModal('kasbonModal');
    render();
  }

  function openPaymentModal(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;
    const rem = U.calcRemaining(rec);
    if (rem <= 0) return showToast('Sudah lunas');

    document.getElementById('paymentForm').reset();
    hideError('payFormError');
    document.getElementById('payRecordId').value = rec.id;
    document.getElementById('payDate').value = U.todayISO();
    document.getElementById('payAmount').value = U.formatInputThousands(rem);

    document.getElementById('paySummaryCallout').innerHTML = `
      <div style="min-width:0;">
        <div style="font-weight:700;">${U.escapeHtml(rec.borrowerName)}</div>
        <div style="font-size:12px;color:var(--ink-3);">${U.escapeHtml(rec.description)}</div>
      </div>
      <div class="mono" style="text-align:right;">
        <div class="kv-k">Sisa</div>
        <div style="font-size:16px;font-weight:600;color:var(--amber);">${U.formatRupiah(rem)}</div>
      </div>
    `;

    const presets = [
      { label: '25%', val: Math.max(1000, Math.round((rem * 0.25) / 1000) * 1000) },
      { label: '50%', val: Math.max(1000, Math.round((rem * 0.5) / 1000) * 1000) },
      { label: 'Lunas', val: rem }
    ];

    const wrap = document.getElementById('payQuickChips');
    wrap.innerHTML = presets
      .map((p) => `<button type="button" class="chip-btn" data-pay-preset="${Math.min(rem, p.val)}">${p.label}</button>`)
      .join('');
    wrap.querySelectorAll('[data-pay-preset]').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.getElementById('payAmount').value = U.formatInputThousands(Number(chip.getAttribute('data-pay-preset')));
      });
    });

    openModal('paymentModal');
    setTimeout(() => document.getElementById('payAmount').focus(), 60);
  }

  function handlePaymentSubmit(e) {
    e.preventDefault();
    hideError('payFormError');

    const rec = state.records.find((r) => r.id === document.getElementById('payRecordId').value);
    if (!rec) return;

    const rem = U.calcRemaining(rec);
    const amount = U.parseRupiahInput(document.getElementById('payAmount').value);
    const date = document.getElementById('payDate').value || U.todayISO();
    const method = document.getElementById('payMethod').value;
    const note = document.getElementById('payNote').value.trim();

    if (amount <= 0) return showError('payFormError', 'Nominal harus lebih dari 0.');
    if (amount > rem) return showError('payFormError', 'Melebihi sisa ' + U.formatRupiah(rem));

    rec.payments.push({ id: U.generateId('PY'), amount, date, method, note });
    S.saveState(state);
    closeModal('paymentModal');
    render();
    showToast(U.calcRemaining(rec) <= 0 ? 'Lunas!' : 'Cicilan tersimpan');
  }

  function openDetailModal(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;

    const paid = U.calcPaidAmount(rec);
    const rem = U.calcRemaining(rec);

    document.getElementById('detailModalTitle').textContent = rec.borrowerName;

    document.getElementById('detailModalBody').innerHTML = `
      <div class="mini-ledger-box">
        <div>
          <div style="font-weight:600;font-size:14px;">${U.escapeHtml(rec.description)}</div>
          <div class="kv-k mono" style="margin-top:2px;">${rec.id}</div>
        </div>
        <div class="mono" style="text-align:right;">
          <div class="kv-k">${rem > 0 ? 'Sisa' : 'Status'}</div>
          <div style="font-size:17px;font-weight:600;color:${rem > 0 ? 'var(--amber)' : 'var(--emerald)'};">
            ${rem > 0 ? U.formatRupiah(rem) : 'Lunas'}
          </div>
        </div>
      </div>

      <div class="detail-kv-grid mono">
        <div>
          <div class="kv-k">Total</div>
          <div class="kv-v">${U.formatRupiah(rec.amount)}</div>
        </div>
        <div>
          <div class="kv-k">Masuk</div>
          <div class="kv-v" style="color:var(--emerald);">${U.formatRupiah(paid)}</div>
        </div>
        <div>
          <div class="kv-k">Tanggal</div>
          <div class="kv-v">${U.formatDateID(rec.date)}</div>
        </div>
        <div>
          <div class="kv-k">Tempo</div>
          <div class="kv-v">${rec.dueDate ? U.formatDateID(rec.dueDate) : '—'}</div>
        </div>
      </div>

      ${rec.notes ? `<div style="font-size:13px;color:var(--ink-2);">${U.escapeHtml(rec.notes)}</div>` : ''}

      <div>
        <div class="kv-k" style="margin-bottom:6px;">Cicilan (${rec.payments.length})</div>
        ${
          rec.payments.length === 0
            ? '<p style="font-size:13px;color:var(--ink-3);">Belum ada pembayaran.</p>'
            : `<div class="pay-log">
                 ${rec.payments
                   .map(
                     (p) => `
                     <div class="pay-log-row">
                       <div>
                         <div class="mono" style="font-weight:600;font-size:13.5px;color:var(--emerald);">+${U.formatRupiah(p.amount)}</div>
                         <div class="kv-k mono">${U.formatDateID(p.date)} · ${U.escapeHtml(p.method)}${p.note ? ' · ' + U.escapeHtml(p.note) : ''}</div>
                       </div>
                       <button type="button" class="row-icon-btn" data-del-payment="${p.id}" title="Hapus">${ICONS.trash}</button>
                     </div>
                   `
                   )
                   .join('')}
               </div>`
        }
      </div>
    `;

    document.getElementById('detailModalFooter').innerHTML = `
      <button type="button" class="btn-danger" id="detailDeleteBtn" style="margin-right:auto;">Hapus</button>
      <button type="button" class="btn-glass" id="detailReceiptBtn">Nota</button>
      ${rem > 0 ? '<button type="button" class="btn-ink" id="detailPayBtn">Bayar</button>' : ''}
    `;

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

    document.getElementById('detailDeleteBtn').addEventListener('click', () => {
      openConfirm('Hapus Catatan?', 'Hapus kasbon ' + rec.borrowerName + ' secara permanen?', () => {
        state.records = state.records.filter((i) => i.id !== rec.id);
        S.saveState(state);
        closeModal('detailModal');
        render();
        showToast('Dihapus');
      });
    });

    document.querySelectorAll('[data-del-payment]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const payId = btn.getAttribute('data-del-payment');
        openConfirm('Batalkan Cicilan?', 'Hapus pembayaran ini dan hitung ulang sisa?', () => {
          rec.payments = rec.payments.filter((p) => p.id !== payId);
          S.saveState(state);
          render();
          openDetailModal(rec.id);
          showToast('Cicilan dihapus');
        });
      });
    });

    openModal('detailModal');
  }

  function openWaModalForRecord(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;
    ui.activeWaRecordId = rec.id;
    ui.activeWaTone = 'sopan';

    document.getElementById('waModalTitle').textContent = 'WhatsApp · ' + rec.borrowerName;
    document.getElementById('waToneGroup').style.display = 'grid';
    document.querySelectorAll('[data-wa-tone]').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-wa-tone') === 'sopan')
    );
    document.getElementById('waPhoneInput').value = rec.phone || '';
    document.getElementById('waMessagePreview').value = U.buildWhatsAppMessage(rec, state.settings, 'sopan');
    openModal('waModal');
  }

  function openWaModalCustom(phone, message, title) {
    ui.activeWaRecordId = null;
    document.getElementById('waModalTitle').textContent = title || 'WhatsApp';
    document.getElementById('waToneGroup').style.display = 'none';
    document.getElementById('waPhoneInput').value = phone || '';
    document.getElementById('waMessagePreview').value = message;
    openModal('waModal');
  }

  function openReceiptModal(recordId) {
    const rec = state.records.find((r) => r.id === recordId);
    if (!rec) return;
    ui.activeReceiptRecord = rec;
    R.renderReceiptToCanvas(document.getElementById('receiptCanvas'), rec, state.settings);
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
    showToast('Profil disimpan');
  }

  function handleJSONFileImport(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = S.parseImportedJSON(String(reader.result || ''));
        openConfirm('Restore Backup?', 'Pulihkan ' + imported.records.length + ' catatan dari file ini?', () => {
          state.records = imported.records;
          if (imported.settings) {
            state.settings = imported.settings;
            applyTheme(state.settings.theme || 'light');
            updateBusinessLabels();
          }
          state.isDemoMode = false;
          S.saveState(state);
          render();
          showToast('Backup dipulihkan');
        });
      } catch (err) {
        showToast(err.message);
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // Helpers
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
      navigator.clipboard.writeText(text).then(() => showToast(successMsg)).catch(() => fallbackCopy(text, successMsg));
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
      showToast(successMsg);
    } catch (_) {
      showToast('Gagal menyalin');
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
      toast.style.transition = 'opacity 180ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 2400);
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
