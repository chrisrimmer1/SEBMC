import jsPDF from 'jspdf';
import type { CanvasData, ContentItem, SectionId } from '../types';

export async function exportToPDF(canvasData: CanvasData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - (2 * margin);

  let currentY = margin;

  // Helper to check page breaks
  const checkPageBreak = (height: number): void => {
    if (currentY + height > pageHeight - margin - 10) {
      pdf.addPage();
      currentY = margin;
    }
  };

  // Strip markdown formatting
  const stripMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1');
  };

  // Add title
  const title = canvasData.headerTitle || 'Social Enterprise Business Model Canvas';
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  
  const titleLines = pdf.splitTextToSize(title, contentWidth);
  titleLines.forEach((line: string) => {
    checkPageBreak(8);
    pdf.text(line, pageWidth / 2, currentY, { align: 'center' });
    currentY += 8;
  });
  currentY += 5;

  // Add subtitle
  const subtitle = canvasData.canvasSubtitle || 'Plan your social impact venture';
  if (subtitle) {
    const cleanSubtitle = stripMarkdown(subtitle);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(102, 102, 102);
    
    const subtitleLines = pdf.splitTextToSize(cleanSubtitle, contentWidth);
    subtitleLines.forEach((line: string) => {
      checkPageBreak(5);
      pdf.text(line, pageWidth / 2, currentY, { align: 'center' });
      currentY += 5;
    });
    currentY += 10;
  }

  // Section order
  const sectionOrder: SectionId[] = [
    'social-problem',
    'service-portfolio',
    'core-value',
    'beneficiaries',
    'impact',
    'network-partners',
    'channels',
    'costs',
    'revenue-stream'
  ];

  // Add sections
  sectionOrder.forEach((sectionId, index) => {
    const section = canvasData.sections[sectionId];
    if (!section) return;

    checkPageBreak(40);
    
    const textX = margin;
    const textMaxWidth = contentWidth;

    // Add top divider line (except for first section)
    if (index > 0) {
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, currentY, margin + contentWidth, currentY);
      currentY += 8;
    }

    // Section title
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const titleLines = pdf.splitTextToSize(section.title, textMaxWidth);
    titleLines.forEach((line: string, index: number) => {
      checkPageBreak(7);
      pdf.text(line, textX, currentY);
      if (index < titleLines.length - 1) {
        currentY += 7;
      }
    });
    currentY += 7;

    // Section subtitle
    if (section.subtitle) {
      const cleanSubtitle = stripMarkdown(section.subtitle);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(102, 102, 102);
      const subLines = pdf.splitTextToSize(cleanSubtitle, textMaxWidth);
      subLines.forEach((line: string, index: number) => {
        checkPageBreak(4.5);
        pdf.text(line, textX, currentY);
        if (index < subLines.length - 1) {
          currentY += 4.5;
        }
      });
      currentY += 5;
    }

    // Divider line under subtitle
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.3);
    pdf.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 5;

    // Items
    if (section.items && section.items.length > 0) {
      section.items.forEach((item: ContentItem, itemIdx: number) => {
        checkPageBreak(15);

        // Item title
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        const itemTitleLines = pdf.splitTextToSize(item.title, textMaxWidth);
        itemTitleLines.forEach((line: string, index: number) => {
          checkPageBreak(5);
          pdf.text(line, textX, currentY);
          if (index < itemTitleLines.length - 1) {
            currentY += 5;
          }
        });
        currentY += 5;

        // Item description
        if (item.description) {
          const lines = item.description.split('\n');
          lines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) {
              currentY += 2;
              return;
            }

            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(51, 51, 51);

            // Bullet point
            if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
              const bulletText = stripMarkdown(trimmed.replace(/^[-•]\s*/, ''));
              checkPageBreak(5);
              
              // Draw bullet
              pdf.setFont('helvetica', 'bold');
              pdf.text('•', textX + 2, currentY);
              
              // Text after bullet with proper wrapping
              pdf.setFont('helvetica', 'normal');
              const bulletLines = pdf.splitTextToSize(bulletText, textMaxWidth - 8);
              bulletLines.forEach((bLine: string, idx: number) => {
                checkPageBreak(4);
                pdf.text(bLine, textX + 7, currentY);
                if (idx < bulletLines.length - 1) {
                  currentY += 4;
                }
              });
              currentY += 4;
            } else {
              // Regular text with proper wrapping
              const cleanText = stripMarkdown(trimmed);
              const textLines = pdf.splitTextToSize(cleanText, textMaxWidth);
              textLines.forEach((tLine: string, idx: number) => {
                checkPageBreak(4);
                pdf.text(tLine, textX, currentY);
                if (idx < textLines.length - 1) {
                  currentY += 4;
                }
              });
              currentY += 4;
            }
          });
        }

        // Add spacing between items (except last)
        if (itemIdx < section.items.length - 1) {
          currentY += 3;
        }
      });
    } else {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(153, 153, 153);
      pdf.text('No items added yet', textX, currentY);
      currentY += 5;
    }

    // Add spacing after section
    currentY += 10;
  });

  // Footer
  checkPageBreak(25);
  currentY += 5;
  
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 5;

  const currentDate = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(102, 102, 102);
  
  const footerTexts = [
    'Based on the Social Enterprise Business Model Canvas by HotCubator,',
    'adapted from the original Business Model Canvas by Alexander Osterwalder.',
    'hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas',
    `Exported: ${currentDate}`
  ];

  footerTexts.forEach((text) => {
    checkPageBreak(4);
    pdf.text(text, pageWidth / 2, currentY, { align: 'center' });
    currentY += 4;
  });

  // Download
  const filename = `SEBMC-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.pdf`;
  pdf.save(filename);
}
