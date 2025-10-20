import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { CanvasData, ContentItem, SectionId } from '../types';

export async function exportToPDF(canvasData: CanvasData): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const margin = 15; // margins in mm
  const contentWidth = pageWidth - (2 * margin);

  let currentY = margin;

  // Helper function to add new page if needed
  const checkPageBreak = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // Helper function to render HTML to canvas and add to PDF
  const addHtmlElement = async (html: string): Promise<number> => {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '794px'; // A4 width in pixels at 96 DPI
    container.style.backgroundColor = '#ffffff';
    container.style.padding = '20px';
    container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    container.innerHTML = html;

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if we need a new page
      checkPageBreak(imgHeight);

      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        margin,
        currentY,
        imgWidth,
        imgHeight
      );

      currentY += imgHeight;
      return imgHeight;
    } finally {
      document.body.removeChild(container);
    }
  };

  // Title and subtitle
  const title = canvasData.headerTitle || 'Social Enterprise Business Model Canvas';
  const subtitle = canvasData.canvasSubtitle || 'Plan your social impact venture';

  const headerHtml = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 28px; margin-bottom: 10px; color: #000; font-weight: 700;">${title}</h1>
      <p style="font-size: 14px; color: #666; line-height: 1.6;">${subtitle}</p>
    </div>
  `;

  await addHtmlElement(headerHtml);
  currentY += 5; // Add some spacing

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

    let sectionHtml = `
      <div style="border: 2px solid #000; border-radius: 8px; padding: 15px; background: #fff;">
        <div style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #000;">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 4px; color: #000;">${section.title}</h3>
          <p style="font-size: 12px; color: #666; font-style: italic; line-height: 1.4;">${section.subtitle}</p>
        </div>
        <div style="min-height: 40px;">
    `;

    if (section.items && section.items.length > 0) {
      section.items.forEach((item: ContentItem) => {
        const descriptionLines = item.description.split('\n').map((line: string) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
            return `<div style="padding-left: 18px; position: relative; margin: 2px 0;"><span style="position: absolute; left: 0; font-weight: bold;">•</span> ${trimmed.substring(1).trim()}</div>`;
          }
          return `<div style="margin: 2px 0;">${trimmed || '&nbsp;'}</div>`;
        }).join('');

        sectionHtml += `
          <div style="margin-bottom: 10px; padding: 12px; background: #f5f5f5; border-radius: 6px; border-left: 3px solid #000;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 6px; color: #000;">${item.title}</div>
            <div style="font-size: 12px; color: #333; line-height: 1.6;">
              ${descriptionLines}
            </div>
          </div>
        `;
      });
    } else {
      sectionHtml += '<div style="color: #999; font-size: 12px; font-style: italic; padding: 10px 0;">No items added yet</div>';
    }

    sectionHtml += `
        </div>
      </div>
    `;

    await addHtmlElement(sectionHtml);
    currentY += 8; // Add spacing between sections
  }

  // Add footer on last page
  const currentDate = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  checkPageBreak(20);

  const footerHtml = `
    <div style="padding-top: 15px; border-top: 2px solid #000; text-align: center;">
      <p style="font-size: 10px; color: #666; margin: 5px 0;">
        Based on the Social Enterprise Business Model Canvas by HotCubator,
        adapted from the original Business Model Canvas by Alexander Osterwalder.
      </p>
      <p style="font-size: 9px; color: #999; margin: 5px 0;">hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas</p>
      <p style="font-size: 10px; color: #666; margin: 5px 0;">Exported: ${currentDate}</p>
    </div>
  `;

  await addHtmlElement(footerHtml);

  // Generate filename with date and time
  const filename = `SEBMC-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.pdf`;

  // Download
  pdf.save(filename);
}
