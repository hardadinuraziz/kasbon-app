/**
 * KasbonKu — Utility Helpers
 * Formatting Rupiah, tanggal Indonesia, nomor WhatsApp, status jatuh tempo, dan sanitasi HTML.
 */
(function (global) {
  'use strict';

  const MONTHS_ID = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  const MONTHS_FULL_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const CATEGORIES = {
    karyawan: { label: 'Karyawan', badgeClass: 'cat-karyawan' },
    pelanggan: { label: 'Pelanggan', badgeClass: 'cat-pelanggan' },
    teman: { label: 'Teman / Keluarga', badgeClass: 'cat-teman' },
    operasional: { label: 'Operasional', badgeClass: 'cat-operasional' }
  };

  const PAYMENT_METHODS = ['Tunai', 'Transfer Bank', 'QRIS / E-Wallet', 'Potong Gaji'];

  function generateId(prefix) {
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    const ts = Date.now().toString(36).toUpperCase();
    return (prefix || 'KB') + '-' + ts + '-' + rand;
  }

  function formatRupiah(amount, withPrefix) {
    const num = Math.round(Number(amount) || 0);
    const abs = Math.abs(num);
    const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const prefix = withPrefix === false ? '' : 'Rp ';
    return (num < 0 ? '-' : '') + prefix + formatted;
  }

  function formatCompactRupiah(amount) {
    const num = Number(amount) || 0;
    const abs = Math.abs(num);
    if (abs >= 1000000000) {
      return 'Rp ' + (num / 1000000000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'M';
    }
    if (abs >= 1000000) {
      return 'Rp ' + (num / 1000000).toFixed(1).replace(/\.0$/, '').replace('.', ',') + 'jt';
    }
    if (abs >= 1000) {
      return 'Rp ' + Math.round(num / 1000) + 'rb';
    }
    return formatRupiah(num);
  }

  function parseRupiahInput(str) {
    if (typeof str === 'number') return Math.max(0, Math.round(str));
    const digits = String(str || '').replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  }

  function formatInputThousands(val) {
    const num = parseRupiahInput(val);
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function toISODate(date) {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function todayISO() {
    return toISODate(new Date());
  }

  function addDaysISO(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return toISODate(d);
  }

  function parseLocalDate(isoStr) {
    if (!isoStr) return null;
    const parts = String(isoStr).split('-');
    if (parts.length !== 3) return null;
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    return isNaN(d.getTime()) ? null : d;
  }

  function formatDateID(isoStr, fullMonth) {
    const d = parseLocalDate(isoStr);
    if (!d) return '-';
    const months = fullMonth ? MONTHS_FULL_ID : MONTHS_ID;
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  function formatMonthLabel(yearMonth) {
    if (!yearMonth || !yearMonth.includes('-')) return yearMonth || '';
    const parts = yearMonth.split('-');
    const monthIdx = Number(parts[1]) - 1;
    return (MONTHS_ID[monthIdx] || '') + ' ' + parts[0];
  }

  function daysDiffFromToday(isoStr) {
    const target = parseLocalDate(isoStr);
    if (!target) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((target - today) / 86400000);
  }

  function calcPaidAmount(record) {
    if (!record || !Array.isArray(record.payments)) return 0;
    return record.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  }

  function calcRemaining(record) {
    const total = Number(record.amount) || 0;
    const paid = calcPaidAmount(record);
    return Math.max(0, total - paid);
  }

  function getRecordStatus(record) {
    const remaining = calcRemaining(record);
    if (remaining <= 0) {
      return {
        code: 'lunas',
        label: 'Lunas',
        dueText: 'Sudah lunas',
        badgeClass: 'badge-lunas'
      };
    }

    if (record.dueDate) {
      const diff = daysDiffFromToday(record.dueDate);
      if (diff !== null && diff < 0) {
        return {
          code: 'jatuh_tempo',
          label: 'Terlambat ' + Math.abs(diff) + ' hari',
          dueText: 'Jatuh tempo ' + formatDateID(record.dueDate),
          badgeClass: 'badge-overdue'
        };
      }
      if (diff === 0) {
        return {
          code: 'jatuh_tempo',
          label: 'Jatuh tempo hari ini',
          dueText: 'Hari ini (' + formatDateID(record.dueDate) + ')',
          badgeClass: 'badge-overdue'
        };
      }
      if (diff !== null && diff <= 3) {
        return {
          code: 'belum_lunas',
          label: diff + ' hari lagi',
          dueText: 'Jatuh tempo ' + formatDateID(record.dueDate),
          badgeClass: 'badge-soon'
        };
      }
      return {
        code: 'belum_lunas',
        label: 'Belum Lunas',
        dueText: 'Jatuh tempo ' + formatDateID(record.dueDate),
        badgeClass: 'badge-active'
      };
    }

    return {
      code: 'belum_lunas',
      label: 'Belum Lunas',
      dueText: 'Tanpa tenggat waktu',
      badgeClass: 'badge-active'
    };
  }

  function normalizePhoneWA(phone) {
    const digits = String(phone || '').replace(/[^\d]/g, '');
    if (!digits) return '';
    if (digits.startsWith('62')) return digits;
    if (digits.startsWith('0')) return '62' + digits.slice(1);
    if (digits.startsWith('8')) return '62' + digits;
    return digits;
  }

  function getInitials(name) {
    const cleaned = String(name || '').trim();
    if (!cleaned) return '?';
    const parts = cleaned.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getAvatarPalette(name) {
    const palettes = [
      { bg: '#E6F4EF', text: '#0F5C45' },
      { bg: '#FEF0E1', text: '#A84E00' },
      { bg: '#E8F0FE', text: '#1D4ED8' },
      { bg: '#FCE8EC', text: '#A61B3A' },
      { bg: '#EFECE6', text: '#5B4E3C' },
      { bg: '#E5F5F7', text: '#0F6273' }
    ];
    let hash = 0;
    const str = String(name || '');
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) % 997;
    }
    return palettes[Math.abs(hash) % palettes.length];
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildWhatsAppMessage(record, settings, tone) {
    const paid = calcPaidAmount(record);
    const remaining = calcRemaining(record);
    const biz = (settings && settings.businessName) ? settings.businessName : 'KasbonKu';
    const paymentInfo = (settings && settings.paymentInfo) ? settings.paymentInfo.trim() : '';
    const dueLine = record.dueDate
      ? '\n• Jatuh Tempo: ' + formatDateID(record.dueDate, true)
      : '';
    const paidLine = paid > 0
      ? '\n• Sudah Dibayar: ' + formatRupiah(paid)
      : '';
    const paymentBlock = paymentInfo
      ? '\n\nPembayaran dapat dikirim ke:\n' + paymentInfo
      : '';

    if (tone === 'formal') {
      return (
        'Halo Bapak/Ibu ' + record.borrowerName + ',\n\n' +
        'Berikut kami sampaikan pengingat rincian kasbon dari *' + biz + '*:\n' +
        '• Keperluan: ' + record.description + '\n' +
        '• Tanggal Kasbon: ' + formatDateID(record.date, true) + '\n' +
        '• Total Kasbon: ' + formatRupiah(record.amount) +
        paidLine + '\n' +
        '• *Sisa Tagihan: ' + formatRupiah(remaining) + '*' +
        dueLine +
        paymentBlock +
        '\n\nMohon konfirmasi apabila sudah melakukan pembayaran. Terima kasih atas perhatiannya.'
      );
    }

    if (tone === 'santai') {
      return (
        'Halo ' + record.borrowerName + ' 👋\n\n' +
        'Sekadar ngingetin catatan kasbon kemarin (' + record.description + ') ya:\n' +
        '• Total: ' + formatRupiah(record.amount) +
        paidLine + '\n' +
        '• *Sisa: ' + formatRupiah(remaining) + '*' +
        dueLine +
        paymentBlock +
        '\n\nKalau sudah transfer/bayar kabarin ya, terima kasih banyak! 🙏'
      );
    }

    // Default: sopan / ramah
    return (
      'Assalamu\'alaikum / Halo Kak ' + record.borrowerName + ',\n\n' +
      'Izin mengingatkan catatan kasbon di *' + biz + '*:\n' +
      '• Keterangan: ' + record.description + '\n' +
      '• Tanggal: ' + formatDateID(record.date, true) + '\n' +
      '• Total Kasbon: ' + formatRupiah(record.amount) +
      paidLine + '\n' +
      '• *Sisa Belum Lunas: ' + formatRupiah(remaining) + '*' +
      dueLine +
      paymentBlock +
      '\n\nJika sudah dibayar, mohon abaikan pesan ini atau kirim bukti transfernya ya. Terima kasih 🙏'
    );
  }

  function buildContactSummaryWA(contactName, activeRecords, settings) {
    const biz = (settings && settings.businessName) ? settings.businessName : 'KasbonKu';
    const paymentInfo = (settings && settings.paymentInfo) ? settings.paymentInfo.trim() : '';
    const totalRemaining = activeRecords.reduce((sum, r) => sum + calcRemaining(r), 0);
    const lines = activeRecords.map((r, idx) => {
      const rem = calcRemaining(r);
      const due = r.dueDate ? ' (tempo ' + formatDateID(r.dueDate) + ')' : '';
      return (idx + 1) + '. ' + r.description + ' — *' + formatRupiah(rem) + '*' + due;
    });
    const paymentBlock = paymentInfo
      ? '\n\nInfo Pembayaran:\n' + paymentInfo
      : '';

    return (
      'Halo ' + contactName + ',\n\n' +
      'Berikut rekap kasbon yang masih aktif di *' + biz + '*:\n' +
      lines.join('\n') + '\n\n' +
      '*Total Sisa Kasbon: ' + formatRupiah(totalRemaining) + '*' +
      paymentBlock +
      '\n\nTerima kasih banyak 🙏'
    );
  }

  global.KasbonUtils = {
    MONTHS_ID,
    MONTHS_FULL_ID,
    CATEGORIES,
    PAYMENT_METHODS,
    generateId,
    formatRupiah,
    formatCompactRupiah,
    parseRupiahInput,
    formatInputThousands,
    toISODate,
    todayISO,
    addDaysISO,
    parseLocalDate,
    formatDateID,
    formatMonthLabel,
    daysDiffFromToday,
    calcPaidAmount,
    calcRemaining,
    getRecordStatus,
    normalizePhoneWA,
    getInitials,
    getAvatarPalette,
    escapeHtml,
    buildWhatsAppMessage,
    buildContactSummaryWA
  };
})(window);
