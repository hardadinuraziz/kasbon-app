/**
 * KasbonKu — Digital Receipt / Nota Kasbon Generator (HTML5 Canvas -> PNG)
 */
(function (global) {
  'use strict';

  function wrapLines(ctx, text, maxWidth) {
    const words = String(text || '').split(/\s+/);
    const lines = [];
    let current = '';
    words.forEach((word) => {
      const test = current ? current + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);
    return lines.length ? lines : ['-'];
  }

  function renderReceiptToCanvas(canvas, record, settings) {
    const U = global.KasbonUtils;
    const paid = U.calcPaidAmount(record);
    const remaining = U.calcRemaining(record);
    const isPaid = remaining <= 0;
    const payments = Array.isArray(record.payments) ? record.payments : [];
    const paymentInfoLines = (settings.paymentInfo || '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const width = 760;
    const padX = 56;
    const contentWidth = width - padX * 2;

    const ctx = canvas.getContext('2d');
    ctx.font = '500 22px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const descLines = wrapLines(ctx, record.description, contentWidth - 190);
    const noteLines = record.notes ? wrapLines(ctx, record.notes, contentWidth) : [];

    // Dynamic height calculation
    let height = 560;
    height += descLines.length * 30;
    if (payments.length > 0) {
      height += 54 + Math.min(payments.length, 6) * 42;
      if (payments.length > 6) height += 28;
    }
    if (noteLines.length > 0) {
      height += 46 + noteLines.length * 26;
    }
    if (!isPaid && paymentInfoLines.length > 0) {
      height += 56 + paymentInfoLines.length * 28;
    }
    height += 110; // Footer & bottom margin

    const dpr = 2;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Outer subtle warm paper background
    ctx.fillStyle = '#F2EFE8';
    ctx.fillRect(0, 0, width, height);

    // Receipt card container
    const cardX = 24;
    const cardY = 24;
    const cardW = width - 48;
    const cardH = height - 48;

    ctx.save();
    ctx.shadowColor = 'rgba(20, 32, 28, 0.08)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    roundRect(ctx, cardX, cardY, cardW, cardH, 24);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    // Top emerald header band
    ctx.save();
    roundRectTop(ctx, cardX, cardY, cardW, 132, 24);
    ctx.fillStyle = '#0F5C45';
    ctx.fill();
    ctx.restore();

    // Header brand title
    const bizName = (settings && settings.businessName) ? settings.businessName : 'KasbonKu';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 28px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(bizName, padX, cardY + 58);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '500 17px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('NOTA CATATAN KASBON DIGITAL', padX, cardY + 90);

    // Status pill in header
    const pillText = isPaid ? 'LUNAS' : 'BELUM LUNAS';
    ctx.font = '700 16px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const pillW = ctx.measureText(pillText).width + 34;
    const pillX = cardX + cardW - 32 - pillW;
    const pillY = cardY + 46;
    roundRect(ctx, pillX, pillY, pillW, 38, 19);
    ctx.fillStyle = isPaid ? '#D1FAE5' : '#FEF3C7';
    ctx.fill();
    ctx.fillStyle = isPaid ? '#065F46' : '#92400E';
    ctx.fillText(pillText, pillX + 17, pillY + 25);

    // Meta row
    let y = cardY + 172;
    ctx.fillStyle = '#73827C';
    ctx.font = '500 16px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('NO. REFERENSI', padX, y);
    ctx.textAlign = 'right';
    ctx.fillText('TANGGAL KASBON', width - padX, y);
    ctx.textAlign = 'left';

    y += 28;
    ctx.fillStyle = '#14201C';
    ctx.font = '600 19px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(record.id, padX, y);
    ctx.textAlign = 'right';
    ctx.fillText(U.formatDateID(record.date, true), width - padX, y);
    ctx.textAlign = 'left';

    // Dashed divider
    y += 26;
    drawDashedLine(ctx, padX, y, width - padX);

    // Borrower & description rows
    y += 38;
    const catLabel = U.CATEGORIES[record.category] ? U.CATEGORIES[record.category].label : record.category;
    y = drawKeyValue(ctx, 'Nama Peminjam', record.borrowerName + ' (' + catLabel + ')', padX, y, width - padX);
    if (record.phone) {
      y = drawKeyValue(ctx, 'No. WhatsApp', record.phone, padX, y, width - padX);
    }
    if (record.dueDate) {
      y = drawKeyValue(ctx, 'Jatuh Tempo', U.formatDateID(record.dueDate, true), padX, y, width - padX);
    }

    // Description (multi-line)
    ctx.fillStyle = '#6B7A75';
    ctx.font = '500 18px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('Keperluan', padX, y);
    ctx.fillStyle = '#14201C';
    ctx.font = '600 19px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'right';
    descLines.forEach((line, idx) => {
      ctx.fillText(line, width - padX, y + idx * 28);
    });
    ctx.textAlign = 'left';
    y += descLines.length * 28 + 18;

    // Summary Box
    const boxH = 152;
    roundRect(ctx, padX, y, contentWidth, boxH, 16);
    ctx.fillStyle = '#F7F6F2';
    ctx.fill();
    ctx.strokeStyle = 'rgba(20, 32, 28, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    let by = y + 40;
    ctx.fillStyle = '#53625D';
    ctx.font = '500 18px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('Total Kasbon', padX + 24, by);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#14201C';
    ctx.font = '600 20px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(U.formatRupiah(record.amount), width - padX - 24, by);
    ctx.textAlign = 'left';

    by += 36;
    ctx.fillStyle = '#53625D';
    ctx.font = '500 18px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('Sudah Dibayar', padX + 24, by);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0E7A55';
    ctx.font = '600 20px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText('- ' + U.formatRupiah(paid), width - padX - 24, by);
    ctx.textAlign = 'left';

    by += 20;
    drawDashedLine(ctx, padX + 24, by, width - padX - 24);

    by += 36;
    ctx.fillStyle = '#14201C';
    ctx.font = '700 21px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(isPaid ? 'Status Akhir' : 'Sisa Tagihan', padX + 24, by);
    ctx.textAlign = 'right';
    ctx.fillStyle = isPaid ? '#0E7A55' : '#C25E00';
    ctx.font = '800 26px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(isPaid ? 'Rp 0 (LUNAS)' : U.formatRupiah(remaining), width - padX - 24, by);
    ctx.textAlign = 'left';

    y += boxH + 34;

    // Payment History section
    if (payments.length > 0) {
      ctx.fillStyle = '#73827C';
      ctx.font = '700 15px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('RIWAYAT PEMBAYARAN (' + payments.length + ')', padX, y);
      y += 28;

      const shown = payments.slice(0, 6);
      shown.forEach((p) => {
        ctx.fillStyle = '#14201C';
        ctx.font = '500 17px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        const leftLabel = U.formatDateID(p.date) + ' · ' + p.method + (p.note ? ' (' + p.note + ')' : '');
        ctx.fillText(truncateText(ctx, leftLabel, contentWidth - 180), padX, y);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#0E7A55';
        ctx.font = '600 18px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('+' + U.formatRupiah(p.amount), width - padX, y);
        ctx.textAlign = 'left';
        y += 38;
      });

      if (payments.length > 6) {
        ctx.fillStyle = '#73827C';
        ctx.font = '500 15px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('+ ' + (payments.length - 6) + ' pembayaran lainnya', padX, y);
        y += 26;
      }
      y += 8;
    }

    // Notes
    if (noteLines.length > 0) {
      ctx.fillStyle = '#73827C';
      ctx.font = '700 15px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('CATATAN', padX, y);
      y += 26;
      ctx.fillStyle = '#4A5954';
      ctx.font = '500 17px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      noteLines.forEach((line) => {
        ctx.fillText(line, padX, y);
        y += 25;
      });
      y += 14;
    }

    // Payment info when unpaid
    if (!isPaid && paymentInfoLines.length > 0) {
      drawDashedLine(ctx, padX, y, width - padX);
      y += 32;
      ctx.fillStyle = '#73827C';
      ctx.font = '700 15px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillText('INFO PEMBAYARAN / REKENING', padX, y);
      y += 28;
      ctx.fillStyle = '#14201C';
      ctx.font = '500 17px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      paymentInfoLines.forEach((line) => {
        ctx.fillText(line, padX, y);
        y += 26;
      });
    }

    // Watermark stamp when LUNAS
    if (isPaid) {
      ctx.save();
      ctx.translate(width - 175, cardY + 265);
      ctx.rotate(-0.22);
      ctx.strokeStyle = 'rgba(14, 122, 85, 0.24)';
      ctx.lineWidth = 5;
      roundRect(ctx, -84, -30, 168, 60, 10);
      ctx.stroke();
      ctx.fillStyle = 'rgba(14, 122, 85, 0.28)';
      ctx.font = '800 28px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LUNAS', 0, 10);
      ctx.restore();
    }

    // Footer
    const footerY = cardY + cardH - 34;
    ctx.fillStyle = '#8B9993';
    ctx.font = '500 15px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(
      'Dicetak pada ' + U.formatDateID(U.todayISO(), true) + ' · KasbonKu Offline Ledger',
      width / 2,
      footerY
    );
    ctx.textAlign = 'left';
  }

  function drawKeyValue(ctx, key, val, leftX, y, rightX) {
    ctx.fillStyle = '#6B7A75';
    ctx.font = '500 18px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(key, leftX, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#14201C';
    ctx.font = '600 19px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(truncateText(ctx, val, rightX - leftX - 180), rightX, y);
    ctx.textAlign = 'left';
    return y + 36;
  }

  function truncateText(ctx, text, maxW) {
    const str = String(text || '');
    if (ctx.measureText(str).width <= maxW) return str;
    let out = str;
    while (out.length > 3 && ctx.measureText(out + '…').width > maxW) {
      out = out.slice(0, -1);
    }
    return out + '…';
  }

  function drawDashedLine(ctx, x1, y, x2) {
    ctx.save();
    ctx.strokeStyle = 'rgba(20, 32, 28, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function roundRectTop(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function downloadReceiptCanvas(canvas, record) {
    const slug = String(record.borrowerName || 'kasbon')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const a = document.createElement('a');
    a.download = 'nota-kasbon-' + slug + '-' + record.id.toLowerCase() + '.png';
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  global.KasbonReceipt = {
    renderReceiptToCanvas,
    downloadReceiptCanvas
  };
})(window);
