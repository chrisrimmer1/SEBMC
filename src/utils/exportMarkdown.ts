import type { CanvasData, ContentItem, SectionId } from '../types';

export function exportToMarkdown(canvasData: CanvasData): void {
  const lines: string[] = [];

  // Title
  const title = canvasData.headerTitle || 'Social Enterprise Business Model Canvas';
  lines.push(`# ${title}`);
  lines.push('');

  // Subtitle
  const subtitle = canvasData.canvasSubtitle || 'Plan your social impact venture';
  if (subtitle) {
    lines.push(subtitle);
    lines.push('');
  }

  lines.push('---');
  lines.push('');

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
  sectionOrder.forEach((sectionId) => {
    const section = canvasData.sections[sectionId];
    if (!section) return;

    // Section title
    lines.push(`## ${section.title}`);
    lines.push('');

    // Section subtitle
    if (section.subtitle) {
      lines.push(`*${section.subtitle}*`);
      lines.push('');
    }

    // Add items
    if (section.items && section.items.length > 0) {
      section.items.forEach((item: ContentItem) => {
        // Item title
        lines.push(`### ${item.title}`);
        lines.push('');

        // Item description
        if (item.description) {
          const descLines = item.description.split('\n');
          descLines.forEach((line) => {
            const trimmed = line.trim();
            if (trimmed) {
              lines.push(trimmed);
            } else {
              lines.push('');
            }
          });
          lines.push('');
        }
      });
    } else {
      lines.push('*No items added yet*');
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  });

  // Add footer
  const currentDate = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('**Based on the Social Enterprise Business Model Canvas by HotCubator,**  ');
  lines.push('**adapted from the original Business Model Canvas by Alexander Osterwalder.**');
  lines.push('');
  lines.push('[hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas](https://hotcubator.com.au/social-entrepreneurship/social-enterprise-business-model-canvas)');
  lines.push('');
  lines.push(`*Exported: ${currentDate}*`);

  // Create markdown content
  const markdownContent = lines.join('\n');

  // Create blob and download
  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const filename = `SEBMC-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}.md`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

