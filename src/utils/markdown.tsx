// Simple markdown parser for canvas subtitle
// Supports: **bold**, *italic*, and line breaks

import React from 'react';

export function parseMarkdown(text: string): React.ReactElement {
  if (!text) return <></>;

  // Split by lines first to preserve line breaks
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, lineIndex) => {
        const parts: React.ReactElement[] = [];
        let remaining = line;
        let keyCounter = 0;

        while (remaining.length > 0) {
          // Check for **bold** (must come before *italic*)
          const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
          if (boldMatch) {
            parts.push(<strong key={`${lineIndex}-${keyCounter++}`}>{boldMatch[1]}</strong>);
            remaining = remaining.slice(boldMatch[0].length);
            continue;
          }

          // Check for __bold__ alternative
          const boldUnderscoreMatch = remaining.match(/^__(.+?)__/);
          if (boldUnderscoreMatch) {
            parts.push(<strong key={`${lineIndex}-${keyCounter++}`}>{boldUnderscoreMatch[1]}</strong>);
            remaining = remaining.slice(boldUnderscoreMatch[0].length);
            continue;
          }

          // Check for *italic*
          const italicMatch = remaining.match(/^\*(.+?)\*/);
          if (italicMatch) {
            parts.push(<em key={`${lineIndex}-${keyCounter++}`}>{italicMatch[1]}</em>);
            remaining = remaining.slice(italicMatch[0].length);
            continue;
          }

          // Check for _italic_ alternative
          const italicUnderscoreMatch = remaining.match(/^_(.+?)_/);
          if (italicUnderscoreMatch) {
            parts.push(<em key={`${lineIndex}-${keyCounter++}`}>{italicUnderscoreMatch[1]}</em>);
            remaining = remaining.slice(italicUnderscoreMatch[0].length);
            continue;
          }

          // No match - take the next character as plain text
          // Find the next markdown character or end of string
          const nextSpecial = remaining.search(/[\*_]/);
          const plainText = nextSpecial === -1
            ? remaining
            : remaining.slice(0, nextSpecial);

          if (plainText) {
            parts.push(<span key={`${lineIndex}-${keyCounter++}`}>{plainText}</span>);
            remaining = remaining.slice(plainText.length);
          } else {
            // Single character that didn't match - just add it
            parts.push(<span key={`${lineIndex}-${keyCounter++}`}>{remaining[0]}</span>);
            remaining = remaining.slice(1);
          }
        }

        // Add line break after each line except the last
        if (lineIndex < lines.length - 1) {
          return (
            <span key={`line-${lineIndex}`}>
              {parts}
              <br />
            </span>
          );
        }

        return <span key={`line-${lineIndex}`}>{parts}</span>;
      })}
    </>
  );
}
