import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { KPIs, ProjectInputs, Trade, EquipmentItem, CostCategory } from './types';
import { formatCurrency, formatPercent } from './calculations';
import { format } from 'date-fns';

export function generateClientProposal(
  projectInputs: ProjectInputs,
  kpis: KPIs,
  trades: Trade[],
  equipment: EquipmentItem[],
  categories: CostCategory[]
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Modern color palette - Navy to Turquoise gradient
  const darkNavy: [number, number, number] = [26, 35, 50];        // #1a2332
  const deepBlue: [number, number, number] = [31, 69, 95];        // #1f455f
  const oceanBlue: [number, number, number] = [45, 106, 135];     // #2d6a87
  const tealBlue: [number, number, number] = [58, 141, 165];      // #3a8da5
  const turquoise: [number, number, number] = [80, 213, 205];     // #50d5cd
  const mintAccent: [number, number, number] = [152, 229, 224];   // #98e5e0
  const white: [number, number, number] = [255, 255, 255];
  const lightBg: [number, number, number] = [248, 251, 252];

  let currentPage = 1;

  // Helper: Draw gradient (simulated with bands)
  const drawGradient = (x: number, y: number, width: number, height: number, vertical = true) => {
    const steps = 50;
    const stepHeight = height / steps;
    for (let i = 0; i < steps; i++) {
      const ratio = i / steps;
      const r = Math.round(darkNavy[0] + (turquoise[0] - darkNavy[0]) * ratio);
      const g = Math.round(darkNavy[1] + (turquoise[1] - darkNavy[1]) * ratio);
      const b = Math.round(darkNavy[2] + (turquoise[2] - darkNavy[2]) * ratio);
      doc.setFillColor(r, g, b);
      doc.rect(x, y + (i * stepHeight), width, stepHeight + 0.5, 'F');
    }
  };

  // Helper: Draw medical icon (simple cross)
  const drawMedicalIcon = (x: number, y: number, size: number) => {
    doc.setFillColor(...white);
    // Horizontal bar
    doc.roundedRect(x - size, y - size * 0.3, size * 2, size * 0.6, 1, 1, 'F');
    // Vertical bar
    doc.roundedRect(x - size * 0.3, y - size, size * 0.6, size * 2, 1, 1, 'F');
  };

  // Helper: Draw heartbeat icon
  const drawHeartbeatIcon = (x: number, y: number, size: number) => {
    doc.setDrawColor(...white);
    doc.setLineWidth(1.5);
    // Simple heartbeat line
    doc.line(x - size, y, x - size * 0.5, y);
    doc.line(x - size * 0.5, y, x - size * 0.3, y - size * 0.5);
    doc.line(x - size * 0.3, y - size * 0.5, x, y + size * 0.3);
    doc.line(x, y + size * 0.3, x + size * 0.3, y - size * 0.2);
    doc.line(x + size * 0.3, y - size * 0.2, x + size, y);
  };

  // Modern footer with clean light background
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setPage(pageNum);

    const footerHeight = 18;
    const footerY = pageHeight - footerHeight;

    // Clean light footer background
    doc.setFillColor(245, 248, 250); // Light blue-grey
    doc.rect(0, footerY, pageWidth, footerHeight, 'F');

    // Turquoise accent line at top
    doc.setDrawColor(...turquoise);
    doc.setLineWidth(1);
    doc.line(0, footerY, pageWidth, footerY);

    // Company name on left
    doc.setTextColor(...darkNavy);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('UPSCALE DEVELOPMENT GROUP', 12, footerY + 11);

    // Confidential notice center
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...oceanBlue);
    doc.text('Confidential - For Client Review Only', pageWidth / 2, footerY + 11, { align: 'center' });

    // Page number on right
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...tealBlue);
    doc.text(`${pageNum} of ${totalPages}`, pageWidth - 12, footerY + 11, { align: 'right' });
  };

  // ===== PAGE 1: STUNNING COVER PAGE =====

  // Beautiful gradient background (Navy to Turquoise)
  drawGradient(0, 0, pageWidth, pageHeight, true);

  // Medical icons in background
  doc.setFillColor(255, 255, 255, 0.08);
  doc.circle(30, 40, 15, 'F');
  doc.circle(pageWidth - 30, 60, 12, 'F');
  doc.circle(40, pageHeight - 60, 10, 'F');
  doc.circle(pageWidth - 35, pageHeight - 80, 13, 'F');

  // Draw medical icons
  drawMedicalIcon(30, 40, 5);
  drawHeartbeatIcon(pageWidth - 30, 60, 4);

  // Top accent bar
  doc.setFillColor(...turquoise);
  doc.rect(0, 0, pageWidth, 3, 'F');

  // Modern company logo area
  doc.setFillColor(255, 255, 255, 0.15);
  doc.roundedRect(pageWidth / 2 - 80, 35, 160, 45, 4, 4, 'F');

  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text('UPSCALE', pageWidth / 2, 55, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mintAccent);
  doc.text('DEVELOPMENT GROUP', pageWidth / 2, 67, { align: 'center' });

  // Decorative line
  doc.setDrawColor(...turquoise);
  doc.setLineWidth(2);
  doc.line(pageWidth / 2 - 60, 85, pageWidth / 2 + 60, 85);

  // Main title card
  doc.setFillColor(255, 255, 255, 0.95);
  doc.roundedRect(25, 100, pageWidth - 50, 70, 6, 6, 'F');

  // Shadow effect
  doc.setFillColor(0, 0, 0, 0.1);
  doc.roundedRect(26, 102, pageWidth - 50, 70, 6, 6, 'F');
  doc.setFillColor(255, 255, 255, 0.95);
  doc.roundedRect(25, 100, pageWidth - 50, 70, 6, 6, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...tealBlue);
  doc.text('MEDICAL FACILITY', pageWidth / 2, 115, { align: 'center' });

  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkNavy);
  doc.text('COST ESTIMATION', pageWidth / 2, 135, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...oceanBlue);
  doc.text('Professional Analysis & Proposal', pageWidth / 2, 150, { align: 'center' });

  // Project name card
  doc.setFillColor(255, 255, 255, 0.9);
  doc.roundedRect(20, 185, pageWidth - 40, 35, 5, 5, 'F');

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkNavy);
  const projectNameLines = doc.splitTextToSize(projectInputs.projectName, pageWidth - 60);
  doc.text(projectNameLines, pageWidth / 2, 200, { align: 'center' });

  // Client info card with gradient accent
  doc.setFillColor(...darkNavy);
  doc.roundedRect(20, 235, pageWidth - 40, 50, 5, 5, 'F');

  // Accent bar in client card
  doc.setFillColor(...turquoise);
  doc.roundedRect(20, 235, pageWidth - 40, 4, 5, 5, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mintAccent);
  doc.text('PREPARED FOR', pageWidth / 2, 248, { align: 'center' });

  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...white);
  doc.text(projectInputs.clientName, pageWidth / 2, 261, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...mintAccent);
  doc.text(projectInputs.location, pageWidth / 2, 273, { align: 'center' });

  // Bottom info bar
  doc.setFillColor(255, 255, 255, 0.12);
  doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...white);
  doc.text(`${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2 - 50, pageHeight - 15, { align: 'center' });

  doc.setTextColor(...turquoise);
  doc.setFont('helvetica', 'bold');
  doc.text('•', pageWidth / 2, pageHeight - 15, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...white);
  doc.text(`${projectInputs.scenario.charAt(0).toUpperCase() + projectInputs.scenario.slice(1)} Scenario`, pageWidth / 2 + 50, pageHeight - 15, { align: 'center' });

  // ===== PAGE 2: EXECUTIVE SUMMARY =====
  doc.addPage();
  currentPage++;

  // Modern clean header
  const headerHeight = 32;

  // Clean light header background
  doc.setFillColor(245, 248, 250); // Light blue-grey
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  // Turquoise accent line under header
  doc.setDrawColor(...turquoise);
  doc.setLineWidth(2);
  doc.line(0, headerHeight, pageWidth, headerHeight);

  doc.setTextColor(...darkNavy);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE SUMMARY', 15, 20);

  // Project overview section
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Overview', 14, 50);

  const projectDetails = [
    ['Project Name:', projectInputs.projectName],
    ['Client:', projectInputs.clientName],
    ['Location:', projectInputs.location],
    ['Facility Size:', `${projectInputs.squareFootage.toLocaleString()} square feet`],
    ['Project Start:', format(new Date(projectInputs.startDate), 'MMMM dd, yyyy')],
    ['Target Completion:', format(new Date(projectInputs.endDate), 'MMMM dd, yyyy')],
    ['Complexity Score:', `${projectInputs.complexityScore}/10`],
    ['Estimation Scenario:', projectInputs.scenario.charAt(0).toUpperCase() + projectInputs.scenario.slice(1)],
  ];

  autoTable(doc, {
    startY: 55,
    body: projectDetails,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: [100, 116, 139] },
      1: { cellWidth: 'auto' },
    },
  });

  // Key Performance Indicators
  let yPos = (doc as any).lastAutoTable.finalY + 15;

  // Modern KPI section header
  doc.setFillColor(...tealBlue);
  doc.roundedRect(14, yPos, pageWidth - 28, 10, 3, 3, 'F');
  doc.setTextColor(...white);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('KEY PERFORMANCE INDICATORS', pageWidth / 2, yPos + 7, { align: 'center' });

  yPos += 18;

  // Modern KPI cards with gradients
  const kpiBoxWidth = (pageWidth - 46) / 3;
  const kpiBoxHeight = 32;

  // Box 1: Total Cost (Gradient background)
  const box1X = 15;
  for (let i = 0; i < 15; i++) {
    const ratio = i / 15;
    const r = Math.round(tealBlue[0] + (turquoise[0] - tealBlue[0]) * ratio);
    const g = Math.round(tealBlue[1] + (turquoise[1] - tealBlue[1]) * ratio);
    const b = Math.round(tealBlue[2] + (turquoise[2] - tealBlue[2]) * ratio);
    doc.setFillColor(r, g, b);
    const stepH = kpiBoxHeight / 15;
    doc.roundedRect(box1X, yPos + (i * stepH), kpiBoxWidth - 3, stepH + 0.5, 4, 4, 'F');
  }

  doc.setTextColor(...white);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PROJECT COST', box1X + (kpiBoxWidth - 3) / 2, yPos + 10, { align: 'center' });
  doc.setFontSize(15);
  doc.text(formatCurrency(kpis.totalProjectCost), box1X + (kpiBoxWidth - 3) / 2, yPos + 23, { align: 'center' });

  // Box 2: Cost per Sq Ft
  const box2X = 15 + kpiBoxWidth + 3;
  doc.setFillColor(...lightBg);
  doc.roundedRect(box2X, yPos, kpiBoxWidth - 3, kpiBoxHeight, 4, 4, 'F');
  doc.setDrawColor(...tealBlue);
  doc.setLineWidth(1.5);
  doc.roundedRect(box2X, yPos, kpiBoxWidth - 3, kpiBoxHeight, 4, 4, 'S');

  doc.setTextColor(...oceanBlue);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('COST PER SQ FT', box2X + (kpiBoxWidth - 3) / 2, yPos + 10, { align: 'center' });
  doc.setTextColor(...darkNavy);
  doc.setFontSize(15);
  doc.text(formatCurrency(kpis.costPerSqFt), box2X + (kpiBoxWidth - 3) / 2, yPos + 23, { align: 'center' });

  // Box 3: Profit Margin
  const box3X = 15 + (kpiBoxWidth + 3) * 2;
  doc.setFillColor(...lightBg);
  doc.roundedRect(box3X, yPos, kpiBoxWidth - 3, kpiBoxHeight, 4, 4, 'F');
  doc.setDrawColor(...turquoise);
  doc.setLineWidth(1.5);
  doc.roundedRect(box3X, yPos, kpiBoxWidth - 3, kpiBoxHeight, 4, 4, 'S');

  doc.setTextColor(...oceanBlue);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PROFIT MARGIN', box3X + (kpiBoxWidth - 3) / 2, yPos + 10, { align: 'center' });
  doc.setTextColor(...turquoise);
  doc.setFontSize(15);
  doc.text(formatPercent(kpis.marginProjection), box3X + (kpiBoxWidth - 3) / 2, yPos + 23, { align: 'center' });

  yPos += kpiBoxHeight + 12;

  // Cost breakdown table
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Cost Breakdown Summary', 14, yPos);

  const summaryData = [
    ['Materials', formatCurrency(kpis.materialCost)],
    ['Medical Staff Labor', formatCurrency(kpis.laborCost)],
    ['Equipment & Construction', formatCurrency(kpis.equipmentCost)],
    ['Soft Costs (Permits, Insurance, etc.)', formatCurrency(kpis.softCosts)],
    ['Contingency Reserve', formatCurrency(kpis.contingency)],
    ['Profit Margin', formatCurrency(kpis.profitMargin)],
  ];

  autoTable(doc, {
    startY: yPos + 5,
    head: [['Category', 'Amount']],
    body: summaryData,
    foot: [['TOTAL PROJECT COST', formatCurrency(kpis.totalProjectCost)]],
    theme: 'striped',
    headStyles: {
      fillColor: darkNavy,
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    footStyles: {
      fillColor: tealBlue,
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 12
    },
    alternateRowStyles: {
      fillColor: lightBg
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 125, textColor: [...darkNavy] },
      1: { halign: 'right', fontStyle: 'bold', cellWidth: 55, textColor: [...tealBlue] },
    },
  });

  // ===== PAGE 3: MEDICAL STAFF LABOR =====
  doc.addPage();
  currentPage++;

  // Modern clean header
  doc.setFillColor(245, 248, 250); // Light blue-grey
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setDrawColor(...turquoise);
  doc.setLineWidth(2);
  doc.line(0, 32, pageWidth, 32);

  doc.setTextColor(...darkNavy);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL STAFF LABOR', 15, 20);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Oklahoma Market Rates 2025-2026 (Fully Burdened)', 14, 45);

  const laborData = trades.map(trade => [
    trade.name,
    formatCurrency(trade.burdenedRate) + '/hr',
    trade.estimatedHours.toLocaleString() + ' hrs',
    formatCurrency(trade.totalCost),
    ((trade.totalCost / kpis.laborCost) * 100).toFixed(1) + '%',
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Position', 'Burdened Rate', 'Est. Hours', 'Total Cost', '% of Labor']],
    body: laborData,
    foot: [['TOTAL MEDICAL STAFF LABOR', '', trades.reduce((sum, t) => sum + t.estimatedHours, 0).toLocaleString() + ' hrs', formatCurrency(kpis.laborCost), '100%']],
    theme: 'striped',
    headStyles: {
      fillColor: darkNavy,
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'center'
    },
    footStyles: {
      fillColor: tealBlue,
      textColor: [...white],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: lightBg
    },
    styles: { fontSize: 9, cellPadding: 4, lineColor: [220, 220, 220], lineWidth: 0.1 },
    columnStyles: {
      0: { textColor: [...darkNavy] },
      1: { halign: 'right', textColor: [...oceanBlue] },
      2: { halign: 'right', textColor: [...oceanBlue] },
      3: { halign: 'right', fontStyle: 'bold', textColor: [...tealBlue] },
      4: { halign: 'center', textColor: [...oceanBlue] },
    },
  });

  // Modern info box
  yPos = (doc as any).lastAutoTable.finalY + 12;

  // Gradient info box
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, yPos, pageWidth - 28, 32, 4, 4, 'F');
  doc.setDrawColor(...tealBlue);
  doc.setLineWidth(1);
  doc.roundedRect(14, yPos, pageWidth - 28, 32, 4, 4, 'S');

  // Accent bar
  doc.setFillColor(...turquoise);
  doc.roundedRect(14, yPos, 5, 32, 4, 4, 'F');

  doc.setTextColor(...darkNavy);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Note on Burdened Rates:', 24, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...oceanBlue);
  const laborNote = 'Burdened rates include all employer costs: malpractice insurance (10-40% depending on role), health benefits and retirement (~12-15%), payroll taxes (FICA, unemployment ~10%), continuing education and licensing (~2-5%). Total burden factor approximately 55% above base hourly rates.';
  const laborLines = doc.splitTextToSize(laborNote, pageWidth - 48);
  doc.text(laborLines, 24, yPos + 16);

  // ===== PAGE 4: MEDICAL EQUIPMENT =====
  doc.addPage();
  currentPage++;

  // Modern clean header
  doc.setFillColor(245, 248, 250); // Light blue-grey
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setDrawColor(...turquoise);
  doc.setLineWidth(2);
  doc.line(0, 32, pageWidth, 32);

  doc.setTextColor(...darkNavy);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('MEDICAL EQUIPMENT & SYSTEMS', 15, 20);

  const equipmentTotal = equipment.reduce((sum, item) => sum + item.totalCost, 0);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Equipment Investment: ${formatCurrency(equipmentTotal)}`, 14, 45);

  const equipmentData = equipment.map(item => [
    item.name,
    item.vendor,
    item.itemType,
    `${formatCurrency(item.rate)}/${item.rateType}`,
    item.duration + (item.rateType === 'Lump Sum' ? '' : ' periods'),
    formatCurrency(item.totalCost),
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Equipment/System', 'Vendor', 'Type', 'Rate', 'Duration', 'Total Cost']],
    body: equipmentData,
    foot: [['TOTAL EQUIPMENT & SYSTEMS', '', '', '', '', formatCurrency(equipmentTotal)]],
    theme: 'striped',
    headStyles: {
      fillColor: darkNavy,
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'center',
      cellPadding: 2.5
    },
    footStyles: {
      fillColor: tealBlue,
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 8
    },
    alternateRowStyles: {
      fillColor: lightBg
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      overflow: 'linebreak',
      cellWidth: 'wrap'
    },
    columnStyles: {
      0: { cellWidth: 45, textColor: [...darkNavy], overflow: 'linebreak' },
      1: { cellWidth: 32, textColor: [...oceanBlue], overflow: 'linebreak' },
      2: { cellWidth: 25, textColor: [...oceanBlue] },
      3: { halign: 'right', cellWidth: 28, textColor: [...oceanBlue] },
      4: { halign: 'right', cellWidth: 18, textColor: [...oceanBlue] },
      5: { halign: 'right', fontStyle: 'bold', cellWidth: 28, textColor: [...tealBlue] },
    },
    margin: { left: 14, right: 14 },
  });

  // Equipment notes
  yPos = (doc as any).lastAutoTable.finalY + 10;

  equipment.forEach((item, index) => {
    if (item.notes && yPos < pageHeight - 50) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...darkNavy);
      doc.text(`${item.name}:`, 14, yPos);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...oceanBlue);
      doc.text(item.notes, 14, yPos + 4, { maxWidth: pageWidth - 28 });
      yPos += 10;
    }
  });

  // ===== PAGE 5: DETAILED CONSTRUCTION COSTS =====
  doc.addPage();
  currentPage++;

  // Modern clean header
  doc.setFillColor(245, 248, 250); // Light blue-grey
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setDrawColor(...turquoise);
  doc.setLineWidth(2);
  doc.line(0, 32, pageWidth, 32);

  doc.setTextColor(...darkNavy);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('DETAILED CONSTRUCTION COSTS', 15, 20);

  yPos = 45;

  categories.forEach((category, catIndex) => {
    // Check if we need a new page
    if (yPos > pageHeight - 80) {
      doc.addPage();
      currentPage++;
      yPos = 20;
    }

    // Modern category header
    doc.setFillColor(...tealBlue);
    doc.roundedRect(14, yPos - 5, pageWidth - 28, 12, 3, 3, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...white);
    doc.text(category.name, 20, yPos + 2);
    doc.setFontSize(10);
    doc.text(formatCurrency(category.subtotal), pageWidth - 20, yPos + 2, { align: 'right' });

    yPos += 5;

    const categoryData = category.items.map(item => [
      item.description,
      item.quantity.toLocaleString(),
      item.unit,
      formatCurrency(item.unitCost),
      formatCurrency(item.totalCost),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Description', 'Qty', 'Unit', 'Unit Cost', 'Total']],
      body: categoryData,
      theme: 'striped',
      headStyles: {
        fillColor: lightBg,
        textColor: [...darkNavy],
        fontStyle: 'bold',
        fontSize: 8
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      },
      styles: { fontSize: 8, cellPadding: 2.5, lineColor: [230, 230, 230], lineWidth: 0.1 },
      columnStyles: {
        0: { cellWidth: 80, textColor: [...darkNavy] },
        1: { halign: 'right', cellWidth: 20, textColor: [...oceanBlue] },
        2: { cellWidth: 15, textColor: [...oceanBlue] },
        3: { halign: 'right', cellWidth: 25, textColor: [...oceanBlue] },
        4: { halign: 'right', fontStyle: 'bold', cellWidth: 30, textColor: [...tealBlue] },
      },
    });

    yPos = (doc as any).lastAutoTable.finalY + 8;
  });

  // ===== PAGE 6: FINANCIAL SUMMARY & ASSUMPTIONS =====
  doc.addPage();
  currentPage++;

  // Modern clean header
  doc.setFillColor(245, 248, 250); // Light blue-grey
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setDrawColor(...turquoise);
  doc.setLineWidth(2);
  doc.line(0, 32, pageWidth, 32);

  doc.setTextColor(...darkNavy);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FINANCIAL SUMMARY', 15, 20);

  // Final cost buildup
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Complete Project Financial Summary', 14, 50);

  const financialData = [
    ['Direct Materials', formatCurrency(kpis.materialCost)],
    ['Medical Staff Labor', formatCurrency(kpis.laborCost)],
    ['Medical Equipment & Systems', formatCurrency(equipmentTotal)],
    ['Construction & Build-Out', formatCurrency(kpis.equipmentCost - equipmentTotal)],
    ['', ''],
    ['Subtotal (Hard Costs)', formatCurrency(kpis.materialCost + kpis.laborCost + kpis.equipmentCost)],
    ['', ''],
    ['Soft Costs', ''],
    ['  Permits & Fees', formatCurrency(kpis.softCosts * 0.14)],
    ['  Insurance & Bonds', formatCurrency(kpis.softCosts * 0.10)],
    ['  Professional Fees', formatCurrency(kpis.softCosts * 0.35)],
    ['  Financing & Legal', formatCurrency(kpis.softCosts * 0.26)],
    ['  Project Management', formatCurrency(kpis.softCosts * 0.15)],
    ['Total Soft Costs', formatCurrency(kpis.softCosts)],
    ['', ''],
    ['Subtotal Before Contingency', formatCurrency(kpis.materialCost + kpis.laborCost + kpis.equipmentCost + kpis.softCosts)],
    ['Contingency Reserve', formatCurrency(kpis.contingency)],
    ['Subtotal Before Profit', formatCurrency(kpis.totalProjectCost - kpis.profitMargin)],
    ['Profit Margin (' + formatPercent(kpis.marginProjection) + ')', formatCurrency(kpis.profitMargin)],
  ];

  autoTable(doc, {
    startY: 55,
    body: financialData,
    foot: [['TOTAL PROJECT COST', formatCurrency(kpis.totalProjectCost)]],
    theme: 'plain',
    footStyles: {
      fillColor: tealBlue,
      textColor: [...white],
      fontStyle: 'bold',
      fontSize: 14
    },
    styles: { fontSize: 10, cellPadding: 3.5, lineColor: [230, 230, 230], lineWidth: 0.1 },
    columnStyles: {
      0: { cellWidth: 120, textColor: [...darkNavy] },
      1: { halign: 'right', fontStyle: 'bold', cellWidth: 60, textColor: [...tealBlue] },
    },
    didParseCell: function(data) {
      // Highlight key rows
      if (data.row.index === 5 || data.row.index === 13 || data.row.index === 15 || data.row.index === 17 || data.row.index === 18) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [...lightBg];
      }
      // Indent soft cost items
      if (data.row.index >= 8 && data.row.index <= 12 && data.column.index === 0) {
        data.cell.styles.cellPadding = { left: 15, top: 3, right: 3, bottom: 3 };
        data.cell.styles.textColor = [...oceanBlue];
      }
    },
  });

  // Modern assumptions section
  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Gradient accent header
  doc.setFillColor(...tealBlue);
  doc.roundedRect(14, yPos, pageWidth - 28, 10, 3, 3, 'F');
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('KEY ASSUMPTIONS & NOTES', pageWidth / 2, yPos + 7, { align: 'center' });

  yPos += 18;

  // Modern info box
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, yPos, pageWidth - 28, 68, 4, 4, 'F');
  doc.setDrawColor(...tealBlue);
  doc.setLineWidth(1);
  doc.roundedRect(14, yPos, pageWidth - 28, 68, 4, 4, 'S');

  // Accent bar
  doc.setFillColor(...turquoise);
  doc.roundedRect(14, yPos, 4, 68, 4, 4, 'F');

  doc.setTextColor(...darkNavy);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');

  const assumptions = [
    `• This estimate is based on the ${projectInputs.scenario} scenario with associated risk factors.`,
    `• All labor rates reflect Oklahoma market conditions for 2025-2026 and include full burden costs.`,
    `• Medical equipment costs include 5-year leasing/rental agreements where applicable.`,
    `• Contingency reserve (${formatPercent((kpis.contingency / (kpis.totalProjectCost - kpis.profitMargin - kpis.contingency)) * 100)}) accounts for unforeseen conditions and market volatility.`,
    `• Soft costs include permits, insurance, professional fees, financing, and project management.`,
    `• This estimate is valid for 90 days from the date of this report.`,
    `• Final costs may vary based on final design, material selections, and market conditions.`,
  ];

  let assumptionY = yPos + 8;
  assumptions.forEach(assumption => {
    const lines = doc.splitTextToSize(assumption, pageWidth - 50);
    doc.text(lines, 23, assumptionY);
    assumptionY += lines.length * 4.5;
  });

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    addFooter(i, totalPages);
  }

  // Save the PDF
  const filename = `${projectInputs.projectName.replace(/\s+/g, '_')}_Cost_Estimate_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(filename);
}
