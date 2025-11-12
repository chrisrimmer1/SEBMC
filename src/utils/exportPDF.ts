import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import type { TDocumentDefinitions, Content, ContentText } from 'pdfmake/interfaces';
import type { CanvasData, ContentItem, SectionId } from '../types';

// Set up fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Helper to parse markdown text into pdfmake text array
function parseMarkdownToPdfText(text: string): ContentText[] {
  const parts: ContentText[] = [];
  let remaining = text;
  
  while (remaining.length > 0) {
    // Check for **bold**
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    if (boldMatch) {
      parts.push({ text: boldMatch[1], bold: true });
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }
    
    // Check for __bold__
    const boldUnderscoreMatch = remaining.match(/^__(.+?)__/);
    if (boldUnderscoreMatch) {
      parts.push({ text: boldUnderscoreMatch[1], bold: true });
      remaining = remaining.slice(boldUnderscoreMatch[0].length);
      continue;
    }
    
    // Check for *italic*
    const italicMatch = remaining.match(/^\*(.+?)\*/);
    if (italicMatch) {
      parts.push({ text: italicMatch[1], italics: true });
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }
    
    // Check for _italic_
    const italicUnderscoreMatch = remaining.match(/^_(.+?)_/);
    if (italicUnderscoreMatch) {
      parts.push({ text: italicUnderscoreMatch[1], italics: true });
      remaining = remaining.slice(italicUnderscoreMatch[0].length);
      continue;
    }
    
    // No match - take next character(s) as plain text
    const nextSpecial = remaining.search(/[\*_]/);
    const plainText = nextSpecial === -1 ? remaining : remaining.slice(0, nextSpecial);
    if (plainText) {
      parts.push({ text: plainText });
      remaining = remaining.slice(plainText.length);
    } else {
      parts.push({ text: remaining[0] });
      remaining = remaining.slice(1);
    }
  }
  
  return parts;
}

export async function exportToPDF(canvasData: CanvasData): Promise<void> {
  const content: Content[] = [];

  // Title
  const title = canvasData.headerTitle || 'Social Enterprise Business Model Canvas';
  content.push({
    text: title,
    style: 'header',
    alignment: 'center',
    margin: [0, 0, 0, 10]
  });

  // Subtitle
  const subtitle = canvasData.canvasSubtitle || 'Plan your social impact venture';
  if (subtitle) {
    const subtitleText = subtitle
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/__(.+?)__/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/_(.+?)_/g, '$1');
    
    content.push({
      text: subtitleText,
      style: 'subtitle',
      alignment: 'center',
      margin: [0, 0, 0, 20]
    });
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

  // Add each section
  sectionOrder.forEach((sectionId) => {
    const section = canvasData.sections[sectionId];
    if (!section) return;

    const sectionContent: Content[] = [];

    // Section title
    sectionContent.push({
      text: section.title,
      style: 'sectionTitle',
      margin: [5, 5, 5, 5]
    });

    // Section subtitle
    if (section.subtitle) {
      const cleanSubtitle = section.subtitle
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1');
      
      sectionContent.push({
        text: cleanSubtitle,
        style: 'sectionSubtitle',
        margin: [5, 0, 5, 5]
      });
    }

    // Line under header
    sectionContent.push({
      canvas: [
        {
          type: 'line',
          x1: 5,
          y1: 0,
          x2: 535,
          y2: 0,
          lineWidth: 0.5
        }
      ],
      margin: [0, 0, 0, 5]
    });

    // Add items
    if (section.items && section.items.length > 0) {
      section.items.forEach((item: ContentItem) => {
        // Item title
        sectionContent.push({
          text: item.title,
          style: 'itemTitle',
          margin: [7, 5, 7, 3]
        });

        // Item description
        if (item.description) {
          const descLines = item.description.split('\n');
          const descContent: Content[] = [];

          descLines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) return;

            // Check for bullet points
            if (trimmed.startsWith('-') || trimmed.startsWith('•')) {
              const bulletText = trimmed.replace(/^[-•]\s*/, '');
              descContent.push({
                text: bulletText,
                style: 'itemDescription',
                margin: [15, 2, 7, 2]
              });
            } else {
              // Regular text with markdown support
              const hasMarkdown = trimmed.includes('**') || trimmed.includes('__') || 
                                  trimmed.includes('*') || trimmed.includes('_');
              
              if (hasMarkdown) {
                descContent.push({
                  text: parseMarkdownToPdfText(trimmed),
                  style: 'itemDescription',
                  margin: [7, 2, 7, 2]
                });
              } else {
                descContent.push({
                  text: trimmed,
                  style: 'itemDescription',
                  margin: [7, 2, 7, 2]
                });
              }
            }
          });

          sectionContent.push({
            stack: descContent,
            margin: [0, 0, 0, 5]
          });
        }
      });
    } else {
      sectionContent.push({
        text: 'No items added yet',
        style: 'emptyText',
        margin: [7, 5, 7, 5]
      });
    }

    // Section box
    content.push({
      stack: sectionContent,
      margin: [0, 0, 0, 10],
      unbreakable: false
    } as Content);

    // Add border around section using canvas
    content.push({
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: -(sectionContent.length * 20 + 20), // Approximate height
          w: 545,
          h: sectionContent.length * 20 + 20,
          lineWidth: 1,
          lineColor: '#000000'
        }
      ],
      absolutePosition: { x: 40, y: content.length * 10 },
      margin: [0, -10, 0, 10]
    } as Content);
  });

  // Footer
  const currentDate = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  content.push({
    canvas: [
      {
        type: 'line',
        x1: 0,
        y1: 0,
        x2: 545,
        y2: 0,
        lineWidth: 0.5
      }
    ],
    margin: [0, 10, 0, 5]
  });

  content.push({
    stack: [
      {
        text: 'Based on the Social Enterprise Business Model Canvas by HotCubator,',
        style: 'footer',
        alignment: 'center'
      },
      {
        text: 'adapted from the original Business Model Canvas by Alexander Osterwalder.',
        style: 'footer',
        alignment: 'center'
      },
      {
        text: 'hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas',
        style: 'footerSmall',
        alignment: 'center'
      },
      {
        text: `Exported: ${currentDate}`,
        style: 'footer',
        alignment: 'center',
        margin: [0, 3, 0, 0]
      }
    ]
  });

  // Document definition
  const docDefinition: TDocumentDefinitions = {
    content,
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: '#000000'
      },
      subtitle: {
        fontSize: 11,
        color: '#666666'
      },
      sectionTitle: {
        fontSize: 13,
        bold: true,
        color: '#000000'
      },
      sectionSubtitle: {
        fontSize: 9,
        italics: true,
        color: '#666666'
      },
      itemTitle: {
        fontSize: 10,
        bold: true,
        color: '#000000'
      },
      itemDescription: {
        fontSize: 9,
        color: '#333333'
      },
      emptyText: {
        fontSize: 9,
        italics: true,
        color: '#999999'
      },
      footer: {
        fontSize: 8,
        color: '#666666'
      },
      footerSmall: {
        fontSize: 7,
        color: '#999999'
      }
    },
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    defaultStyle: {
      font: 'Roboto'
    }
  };

  // Generate filename
  const filename = `SEBMC-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.pdf`;

  // Create and download PDF
  pdfMake.createPdf(docDefinition).download(filename);
}
