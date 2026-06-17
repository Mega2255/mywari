import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logo from '../assets/logo.jpeg'; // ← adjust extension if needed (.svg, .jpg, etc.)

// Helper: load an image URL/import into a base64 data URL
const getBase64FromImport = (imgSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = imgSrc;
  });
};

export const generateReceipt = async (booking) => {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.width;   // 210
  const H = doc.internal.pageSize.height;  // 297

  // ─── COLOURS ────────────────────────────────────────────────
  const olive       = [107, 142, 35];
  const oliveLight  = [245, 250, 240];
  const bark        = [92,  61,  46];
  const cream       = [245, 240, 232];
  const white       = [255, 255, 255];
  const dark        = [30,  30,  30];
  const mid         = [90,  90,  90];
  const success     = [22,  163, 74];
  const successBg   = [220, 252, 231];

  // ─── HEADER BAND ────────────────────────────────────────────
  // Deep olive gradient effect via two overlapping rects
  doc.setFillColor(...olive);
  doc.rect(0, 0, W, 58, 'F');
  doc.setFillColor(85, 115, 25);           // slightly darker band at top
  doc.rect(0, 0, W, 6, 'F');
  doc.setFillColor(bark[0], bark[1], bark[2]);
  doc.rect(0, 52, W, 6, 'F');             // bark accent stripe at bottom of header

  // ─── LOGO ───────────────────────────────────────────────────
  try {
    const logoBase64 = await getBase64FromImport(logo);
    // Place logo at top-left; tweak width/height to suit your logo aspect ratio
    doc.addImage(logoBase64, 'PNG', 12, 8, 36, 36);
  } catch {
    // Fallback: text logo if image fails to load
    doc.setTextColor(...white);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('My Wari', 14, 30);
  }

  // Tagline beside / under logo
  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Trusted Nigerian Real Estate Platform', 52, 20);

  // Divider line inside header
  doc.setDrawColor(...white);
  doc.setLineWidth(0.3);
  doc.line(52, 23, W - 14, 23);

  // Website URL
  doc.setFontSize(8);
  doc.setTextColor(210, 230, 180);
  doc.text('www.mywari.com.ng  |  hello@mywari.com  |  +234 816 298 3569  MY WARI', 52, 30);

  // ─── RECEIPT TITLE ROW ──────────────────────────────────────
  doc.setTextColor(...dark);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOKING RECEIPT', 14, 78);

  // Status badge
  doc.setFillColor(...successBg);
  doc.roundedRect(W - 57, 68, 44, 13, 3, 3, 'F');
  doc.setTextColor(...success);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIRMED', W - 50, 76.5);

  // Meta row
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mid);
  const receiptNo = `MWR-${booking.id?.slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr   = new Date(booking.createdAt).toLocaleDateString('en-NG', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.text(`Receipt No: ${receiptNo}`, 14, 86);
  doc.text(`Issued: ${dateStr}`, 14, 92);

  // Thin horizontal rule
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.line(14, 97, W - 14, 97);

  // ─── TWO-COLUMN INFO CARDS ──────────────────────────────────
  const cardY = 103;
  const cardH  = 34;

  // Guest card
  doc.setFillColor(...oliveLight);
  doc.roundedRect(14, cardY, 85, cardH, 4, 4, 'F');
  doc.setFillColor(...olive);
  doc.roundedRect(14, cardY, 85, 7, 4, 4, 'F');
  doc.rect(14, cardY + 4, 85, 3, 'F');   // square bottom corners of top bar
  doc.setTextColor(...white);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('GUEST INFORMATION', 18, cardY + 5.2);

  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(booking.userName || '—', 18, cardY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mid);
  doc.text(booking.userEmail || '—', 18, cardY + 23);
  doc.text('Guest', 18, cardY + 29);

  // Property card
  doc.setFillColor(...oliveLight);
  doc.roundedRect(W - 99, cardY, 85, cardH, 4, 4, 'F');
  doc.setFillColor(...bark);
  doc.roundedRect(W - 99, cardY, 85, 7, 4, 4, 'F');
  doc.rect(W - 99, cardY + 4, 85, 3, 'F');
  doc.setTextColor(...white);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPERTY', W - 95, cardY + 5.2);

  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const propTitle = doc.splitTextToSize(booking.propertyTitle || '—', 78);
  doc.text(propTitle[0], W - 95, cardY + 16);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...mid);
  doc.text(`Agent: ${booking.agentName || '—'}`, W - 95, cardY + 23);
  const typeLabel = booking.type
    ? booking.type.charAt(0).toUpperCase() + booking.type.slice(1)
    : '—';
  doc.text(`Type: ${typeLabel}`, W - 95, cardY + 29);

  // ─── BOOKING DETAILS TABLE ──────────────────────────────────
  const tableStartY = cardY + cardH + 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...dark);
  doc.text('Booking Details', 14, tableStartY - 2);

  doc.autoTable({
    startY: tableStartY + 2,
    head: [['', '']],
    body: [
      ['Check-in',          booking.checkIn  || '—'],
      ['Check-out',         booking.checkOut || '—'],
      ['Duration',          `${booking.nights || 0} night(s)`],
      ['Payment Reference', booking.paymentRef || 'N/A'],
    ],
    showHead: false,
    styles:          { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 75, textColor: dark },
      1: { textColor: [60, 60, 60] },
    },
    alternateRowStyles: { fillColor: oliveLight },
    tableLineColor: [220, 220, 220],
    tableLineWidth: 0.2,
    margin: { left: 14, right: 14 },
  });

  // ─── PAYMENT SUMMARY ────────────────────────────────────────
  const payY = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...dark);
  doc.text('Payment Summary', 14, payY - 2);

  const basePrice  = parseInt(booking.price || 0) * (booking.nights || 1);
  const serviceFee = booking.serviceFee || 0;
  const total      = booking.total || 0;

  doc.autoTable({
    startY: payY + 2,
    body: [
      ['Base Price',       `\u20A6${basePrice.toLocaleString()}`],
      ['Service Fee (5%)', `\u20A6${serviceFee.toLocaleString()}`],
      ['TOTAL PAID',       `\u20A6${total.toLocaleString()}`],
    ],
    styles:          { fontSize: 10, cellPadding: 6 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100 },
      1: { halign: 'right' },
    },
    margin: { left: 14, right: 14 },
    tableLineColor: [220, 220, 220],
    tableLineWidth: 0.2,
    didParseCell: (data) => {
      if (data.row.index === 2) {
        data.cell.styles.fillColor   = olive;
        data.cell.styles.textColor   = white;
        data.cell.styles.fontStyle   = 'bold';
        data.cell.styles.fontSize    = 12;
      }
    },
  });

  // ─── THANK-YOU NOTE ─────────────────────────────────────────
  const noteY = doc.lastAutoTable.finalY + 14;
  doc.setFillColor(...cream);
  doc.roundedRect(14, noteY, W - 28, 22, 4, 4, 'F');
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...bark);
  doc.text('Thank you for choosing My Wari!', W / 2, noteY + 8, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...mid);
  doc.text(
    'This receipt is your proof of payment. Please keep it safe for your records.',
    W / 2, noteY + 15, { align: 'center' },
  );

  // ─── FOOTER ─────────────────────────────────────────────────
  // Bark accent stripe
  doc.setFillColor(...bark);
  doc.rect(0, H - 22, W, 3, 'F');
  doc.setFillColor(...cream);
  doc.rect(0, H - 19, W, 19, 'F');

  doc.setFontSize(8);
  doc.setTextColor(...mid);
  doc.text(
    'My Wari  |  hello@mywari.com  |  +234 816 298 3569 MY WARI  |  www.mywari.com.ng',
    W / 2, H - 11, { align: 'center' },
  );
  doc.text('Victoria Island, Lagos, Nigeria', W / 2, H - 5, { align: 'center' });

  // ─── SAVE ───────────────────────────────────────────────────
  doc.save(`MyWari-Receipt-${booking.id?.slice(-8) || 'Booking'}.pdf`);
};