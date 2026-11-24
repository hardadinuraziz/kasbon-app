/**
 * KasbonKu — Offline Storage, Sample Data & Export/Import Module
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'kasbonku_state_v1';

  function getDefaultSettings() {
    return {
      businessName: 'KasbonKu — Catatan Usaha',
      ownerName: '',
      paymentInfo: 'BCA 1234567890 a.n. Pemilik Usaha\nGoPay / DANA: 0812-3456-7890',
      theme: 'light'
    };
  }

  function createDemoRecords() {
    const U = global.KasbonUtils;
    return [
      {
        id: 'KB-DEMO-01',
        borrowerName: 'Budi Santoso',
        phone: '081234567891',
        category: 'karyawan',
        description: 'Kasbon gaji — kebutuhan servis motor',
        amount: 750000,
        date: U.addDaysISO(-14),
        dueDate: U.addDaysISO(-2),
        notes: 'Rencana potong gaji akhir bulan atau cicil 2x',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        payments: [
          {
            id: 'PY-DEMO-01',
            amount: 250000,
            date: U.addDaysISO(-6),
            method: 'Potong Gaji',
            note: 'Cicilan pertama'
          }
        ]
      },
      {
        id: 'KB-DEMO-02',
        borrowerName: 'Siti Aminah',
        phone: '085678901234',
        category: 'pelanggan',
        description: 'Belanja sembako & beras 10kg (Warung)',
        amount: 320000,
        date: U.addDaysISO(-5),
        dueDate: U.addDaysISO(2),
        notes: 'Langganan rutin RT 04',
        createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        payments: [
          {
            id: 'PY-DEMO-02',
            amount: 120000,
            date: U.addDaysISO(-2),
            method: 'Tunai',
            note: 'Titip bayar sebagian'
          }
        ]
      },
      {
        id: 'KB-DEMO-03',
        borrowerName: 'Rizky Pratama',
        phone: '082198765432',
        category: 'karyawan',
        description: 'Uang muka operasional kirim barang',
        amount: 500000,
        date: U.addDaysISO(-3),
        dueDate: U.addDaysISO(7),
        notes: 'Termasuk bensin dan tol luar kota',
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        payments: []
      },
      {
        id: 'KB-DEMO-04',
        borrowerName: 'Dewi Lestari',
        phone: '081345678902',
        category: 'teman',
        description: 'Talangan pesan seragam komunitas',
        amount: 240000,
        date: U.addDaysISO(-9),
        dueDate: U.addDaysISO(5),
        notes: '2 pcs ukuran M dan L',
        createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
        payments: [
          {
            id: 'PY-DEMO-03',
            amount: 100000,
            date: U.addDaysISO(-4),
            method: 'QRIS / E-Wallet',
            note: 'DP via DANA'
          }
        ]
      },
      {
        id: 'KB-DEMO-05',
        borrowerName: 'Hendra Wijaya',
        phone: '087712345678',
        category: 'pelanggan',
        description: 'Paket catering rapat 15 box',
        amount: 450000,
        date: U.addDaysISO(-18),
        dueDate: U.addDaysISO(-10),
        notes: 'Pengiriman kantor kecamatan',
        createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
        payments: [
          {
            id: 'PY-DEMO-04',
            amount: 200000,
            date: U.addDaysISO(-15),
            method: 'Transfer Bank',
            note: 'DP awal'
          },
          {
            id: 'PY-DEMO-05',
            amount: 250000,
            date: U.addDaysISO(-11),
            method: 'Transfer Bank',
            note: 'Pelunasan via BCA'
          }
        ]
      },
      {
        id: 'KB-DEMO-06',
        borrowerName: 'Budi Santoso',
        phone: '081234567891',
        category: 'operasional',
        description: 'Kasbon beli pulsa & paket data toko',
        amount: 150000,
        date: U.addDaysISO(-26),
        dueDate: U.addDaysISO(-19),
        notes: 'Sudah selesai direimburse',
        createdAt: new Date(Date.now() - 26 * 86400000).toISOString(),
        payments: [
          {
            id: 'PY-DEMO-06',
            amount: 150000,
            date: U.addDaysISO(-20),
            method: 'Tunai',
            note: 'Lunas'
          }
        ]
      }
    ];
  }

  function loadState() {
    try {
      const raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.records)) {
          return {
            records: parsed.records.map(sanitizeRecord),
            settings: Object.assign(getDefaultSettings(), parsed.settings || {}),
            isDemoMode: Boolean(parsed.isDemoMode)
          };
        }
      }
    } catch (err) {
      console.warn('Gagal membaca localStorage:', err);
    }

    const initial = {
      records: createDemoRecords(),
      settings: getDefaultSettings(),
      isDemoMode: true
    };
    saveState(initial);
    return initial;
  }

  function sanitizeRecord(r) {
    const U = global.KasbonUtils;
    return {
      id: String(r.id || U.generateId('KB')),
      borrowerName: String(r.borrowerName || '').trim(),
      phone: String(r.phone || '').trim(),
      category: U.CATEGORIES[r.category] ? r.category : 'pelanggan',
      description: String(r.description || '').trim(),
      amount: Math.max(0, Math.round(Number(r.amount) || 0)),
      date: r.date || U.todayISO(),
      dueDate: r.dueDate || '',
      notes: String(r.notes || '').trim(),
      createdAt: r.createdAt || new Date().toISOString(),
      payments: Array.isArray(r.payments)
        ? r.payments.map((p) => ({
            id: String(p.id || U.generateId('PY')),
            amount: Math.max(0, Math.round(Number(p.amount) || 0)),
            date: p.date || U.todayISO(),
            method: String(p.method || 'Tunai'),
            note: String(p.note || '').trim()
          }))
        : []
    };
  }

  function saveState(state) {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('Gagal menyimpan ke localStorage:', err);
      return false;
    }
  }

  function exportCSV(records) {
    const U = global.KasbonUtils;
    const headers = [
      'ID',
      'Tanggal Kasbon',
      'Nama Peminjam',
      'No WhatsApp',
      'Kategori',
      'Keterangan',
      'Total Kasbon (Rp)',
      'Sudah Dibayar (Rp)',
      'Sisa Tagihan (Rp)',
      'Jatuh Tempo',
      'Status',
      'Catatan'
    ];

    const escapeCSV = (val) => {
      const s = String(val == null ? '' : val);
      if (/[",\n\r]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    const rows = records.map((r) => {
      const paid = U.calcPaidAmount(r);
      const rem = U.calcRemaining(r);
      const status = U.getRecordStatus(r);
      const cat = U.CATEGORIES[r.category] ? U.CATEGORIES[r.category].label : r.category;
      return [
        r.id,
        r.date,
        r.borrowerName,
        r.phone,
        cat,
        r.description,
        r.amount,
        paid,
        rem,
        r.dueDate || '-',
        status.label,
        r.notes || ''
      ].map(escapeCSV).join(',');
    });

    const bom = '\uFEFF';
    const csvContent = bom + headers.join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, 'kasbonku-laporan-' + U.todayISO() + '.csv');
  }

  function exportJSON(state) {
    const U = global.KasbonUtils;
    const payload = {
      app: 'KasbonKu',
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      records: state.records
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });
    triggerDownload(blob, 'kasbonku-backup-' + U.todayISO() + '.json');
  }

  function parseImportedJSON(jsonText) {
    const parsed = JSON.parse(jsonText);
    if (!parsed || !Array.isArray(parsed.records)) {
      throw new Error('Format file backup tidak valid (daftar kasbon tidak ditemukan).');
    }
    return {
      records: parsed.records.map(sanitizeRecord).filter((r) => r.borrowerName && r.amount > 0),
      settings: parsed.settings
        ? Object.assign(getDefaultSettings(), parsed.settings)
        : null
    };
  }

  function buildReportWhatsAppText(state) {
    const U = global.KasbonUtils;
    const records = state.records;
    const biz = state.settings.businessName || 'KasbonKu';
    let totalKasbon = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    const activeList = [];

    records.forEach((r) => {
      const paid = U.calcPaidAmount(r);
      const rem = U.calcRemaining(r);
      totalKasbon += r.amount;
      totalPaid += paid;
      totalRemaining += rem;
      if (rem > 0) {
        activeList.push({ record: r, remaining: rem, status: U.getRecordStatus(r) });
      }
    });

    activeList.sort((a, b) => b.remaining - a.remaining);

    const lines = [
      '📒 *LAPORAN KASBON — ' + biz.toUpperCase() + '*',
      'Tanggal: ' + U.formatDateID(U.todayISO(), true),
      '────────────────────',
      '• Total Dicatat: ' + U.formatRupiah(totalKasbon) + ' (' + records.length + ' transaksi)',
      '• Sudah Terbayar: ' + U.formatRupiah(totalPaid),
      '• *Sisa Belum Lunas: ' + U.formatRupiah(totalRemaining) + '* (' + activeList.length + ' aktif)'
    ];

    if (activeList.length > 0) {
      lines.push('', '*Rincian Belum Lunas:*');
      activeList.slice(0, 15).forEach((item, i) => {
        const tag = item.status.code === 'jatuh_tempo' ? ' ⚠️' : '';
        lines.push(
          (i + 1) + '. ' + item.record.borrowerName + ' — *' + U.formatRupiah(item.remaining) + '*' + tag +
          ' (' + item.record.description + ')'
        );
      });
      if (activeList.length > 15) {
        lines.push('...dan ' + (activeList.length - 15) + ' kasbon aktif lainnya.');
      }
    } else {
      lines.push('', '✅ Semua kasbon sudah lunas!');
    }

    lines.push('', '_Dibuat dengan KasbonKu_');
    return lines.join('\n');
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  global.KasbonStorage = {
    getDefaultSettings,
    createDemoRecords,
    loadState,
    saveState,
    sanitizeRecord,
    exportCSV,
    exportJSON,
    parseImportedJSON,
    buildReportWhatsAppText,
    triggerDownload
  };
})(window);
