import jsPDF from 'jspdf';
import type { CanvasData, ContentItem, SectionId } from '../types';

export async function exportToPDF(canvasData: CanvasData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 15; // margins in mm
  const contentWidth = pageWidth - (2 * margin);

  let currentY = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number): void => {
    if (currentY + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
    }
  };

  // Add title
  checkPageBreak(15);
  const title = canvasData.headerTitle || 'Social Enterprise Business Model Canvas';
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0);
  const titleLines = pdf.splitTextToSize(title, contentWidth);
  titleLines.forEach((line: string, index: number) => {
    checkPageBreak(7);
    pdf.text(line, margin + contentWidth / 2, currentY, { align: 'center' });
    if (index < titleLines.length - 1) {
      currentY += 7;
    }
  });
  currentY += 10;

  // Add subtitle (canvas subtitle) - strip markdown
  const subtitle = canvasData.canvasSubtitle || 'Plan your social impact venture';
  if (subtitle) {
    const cleanSubtitle = subtitle
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1');
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(102, 102, 102);
    const subtitleLines = pdf.splitTextToSize(cleanSubtitle, contentWidth);
    subtitleLines.forEach((line: string, index: number) => {
      checkPageBreak(5);
      pdf.text(line, margin + contentWidth / 2, currentY, { align: 'center' });
      if (index < subtitleLines.length - 1) {
        currentY += 5;
      }
    });
    currentY += 12;
  }

  // Section order for stacked layout
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

  // Add each section
  for (const sectionId of sectionOrder) {
    const section = canvasData.sections[sectionId];
    if (!section) continue;

    // Check if we need a new page for the section
    checkPageBreak(40);
    
    const sectionStartY = currentY;
    const sectionPadding = 5;
    const sectionInnerX = margin + sectionPadding + 3;
    const sectionInnerWidth = contentWidth - (2 * sectionPadding) - 10; // More padding
    
    // Move down to leave space for border
    currentY += 7;
    
    // Section title
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const sectionTitleLines = pdf.splitTextToSize(section.title, sectionInnerWidth);
    sectionTitleLines.forEach((line: string, index: number) => {
      checkPageBreak(6);
      pdf.text(line, sectionInnerX, currentY);
      if (index < sectionTitleLines.length - 1) {
        currentY += 6;
      }
    });
    currentY += 6;

    // Section subtitle
    if (section.subtitle) {
      const cleanSubtitle = section.subtitle
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1');
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(102, 102, 102);
      const sectionSubtitleLines = pdf.splitTextToSize(cleanSubtitle, sectionInnerWidth);
      sectionSubtitleLines.forEach((line: string, index: number) => {
        checkPageBreak(4);
        pdf.text(line, sectionInnerX, currentY);
        if (index < sectionSubtitleLines.length - 1) {
          currentY += 4;
        }
      });
      currentY += 5;
    }

    // Draw line under header
    checkPageBreak(3);
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.3);
    pdf.line(sectionInnerX, currentY, margin + contentWidth - sectionPadding - 3, currentY);
    currentY += 5;

    // Add items
    if (section.items && section.items.length > 0) {
      section.items.forEach((item: ContentItem, itemIndex: number) => {
        checkPageBreak(20);
        
        // Item title (bold)
        let itemTitle = item.title;
        const isBoldTitle = itemTitle.startsWith('**') && itemTitle.endsWith('**');
        if (isBoldTitle) {
          itemTitle = itemTitle.slice(2, -2);
        }
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        const itemTitleLines = pdf.splitTextToSize(itemTitle, sectionInnerWidth - 5);
        itemTitleLines.forEach((line: string, index: number) => {
          checkPageBreak(5);
          pdf.text(line, sectionInnerX + 2, currentY);
          if (index < itemTitleLines.length - 1) {
            currentY += 5;
          }
        });
        currentY += 4;

        // Item description
        if (item.description) {
          const descLines = item.description.split('\n');
          descLines.forEach((descLine) => {
            const trimmed = descLine.trim();
            if (!trimmed) {
              currentY += 2;
              return;
            }
            
            // Check for bullet points
            if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
              const bulletText = trimmed.replace(/^[-•]\s*/, '');
              checkPageBreak(5);
              
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'bold');
              pdf.setTextColor(51, 51, 51);
              pdf.text('•', sectionInnerX + 2, currentY);
              
              // Render bullet text
              pdf.setFont('helvetica', 'normal');
              const bulletLines = pdf.splitTextToSize(bulletText, sectionInnerWidth - 15);
              bulletLines.forEach((line: string, index: number) => {
                checkPageBreak(4);
                pdf.text(line, sectionInnerX + 6, currentY);
                if (index < bulletLines.length - 1) {
                  currentY += 4;
                }
              });
              currentY += 4;
            } else {
              // Regular text - strip markdown
              const cleanText = trimmed
                .replace(/\*\*(.+?)\*\*/g, '$1')
                .replace(/__(.+?)__/g, '$1')
                .replace(/\*(.+?)\*/g, '$1')
                .replace(/_(.+?)_/g, '$1');
              
              pdf.setFontSize(9);
              pdf.setFont('helvetica', 'normal');
              pdf.setTextColor(51, 51, 51);
              const textLines = pdf.splitTextToSize(cleanText, sectionInnerWidth - 8);
              textLines.forEach((line: string, index: number) => {
                checkPageBreak(4);
                pdf.text(line, sectionInnerX + 2, currentY);
                if (index < textLines.length - 1) {
                  currentY += 4;
                }
              });
              currentY += 4;
            }
          });
        }

        // Spacing between items (but not after last item)
        if (itemIndex < section.items.length - 1) {
          currentY += 3;
        }
      });
    } else {
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(153, 153, 153);
      checkPageBreak(5);
      pdf.text('No items added yet', sectionInnerX + 2, currentY);
      currentY += 5;
    }

    const sectionEndY = currentY + 4;

    // Draw border around section
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(margin + sectionPadding, sectionStartY, contentWidth - (2 * sectionPadding), sectionEndY - sectionStartY);

    currentY = sectionEndY + 8; // Spacing between sections
  }

  // Add footer on last page
  checkPageBreak(25);
  currentY += 5;
  
  pdf.setDrawColor(0, 0, 0);
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
    pdf.text(text, margin + contentWidth / 2, currentY, { align: 'center' });
    currentY += 4;
  });

  // Generate filename with date and time
  const filename = `SEBMC-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.pdf`;

  // Download
  pdf.save(filename);
}
