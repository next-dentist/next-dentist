// utils/htmlCleaner.ts

export interface HtmlCleanerOptions {
  removeAttributes?: boolean;
  removeInlineStyles?: boolean;
  removeClassesAndIds?: boolean;
  removeSuccessiveNbsp?: boolean;
  removeTagsWithOnlyNbsp?: boolean;
  removeSpanTags?: boolean;
  removeImages?: boolean;
  removeLinks?: boolean;
  removeTables?: boolean;
  removeComments?: boolean;
  encodeSpecialChars?: boolean;
  formatWithLineBreaks?: boolean;
  allowedAttributes?: string[];
  allowedTags?: string[];
  indentSize?: number;
  convertPlainTextToHtml?: boolean;
}

const defaultOptions: HtmlCleanerOptions = {
  removeAttributes: true,
  removeInlineStyles: true,
  removeClassesAndIds: true,
  removeSuccessiveNbsp: true,
  removeTagsWithOnlyNbsp: true,
  removeSpanTags: true,
  removeImages: true,
  removeLinks: true,
  removeTables: true,
  removeComments: true,
  encodeSpecialChars: true,
  formatWithLineBreaks: true,
  allowedAttributes: ['href'],
  allowedTags: ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'blockquote'],
  indentSize: 1,
  convertPlainTextToHtml: true
};

/**
 * Convert plain text with markdown-like formatting to HTML
 * Matches the specific structure from procced.html
 */
export function convertPlainTextToHtml(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  // Check if the text already contains HTML tags
  if (/<[^>]+>/.test(text)) {
    return text; // Already HTML, return as-is
  }
  
  let html = text;
  
  // First, let's identify and extract the main title and intro
  const titleMatch = html.match(/## 🦷 (.+)/);
  const mainTitle = titleMatch ? titleMatch[1] : 'Dental Implant Instructions';
  
  // Extract intro paragraph (everything before the first ###)
  const introMatch = html.match(/^([\s\S]+?)(?=###)/);
  const intro = introMatch ? introMatch[1].replace(/## 🦷.+?\n/, '').trim() : '';
  
  // Start building the HTML structure
  let result = '';
  
  // Add title and intro
  result += `<p>\n\tDental Implant Instructions\n</p>\n`;
  result += `<h1>\n\t🦷 ${mainTitle}\n</h1>\n`;
  if (intro) {
    const cleanIntro = intro.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/---/g, '').trim();
    if (cleanIntro) {
      result += `<p>\n\t${cleanIntro}\n</p>\n`;
    }
  }
  
  // Split content into major sections (### 1., ### 2., etc.)
  const sections = html.split(/(?=### \d+\.)/);
  
  sections.forEach((section, index) => {
    if (index === 0) return; // Skip the intro part
    
    const sectionLines = section.trim().split('\n');
    if (sectionLines.length === 0) return;
    
    // Extract section title
    const sectionTitleMatch = sectionLines[0].match(/### (\d+\.) \*\*(.+?)\*\*/);
    if (!sectionTitleMatch) return;
    
    const sectionNumber = sectionTitleMatch[1];
    const sectionTitle = sectionTitleMatch[2];
    
    result += `<div>\n`;
    result += `\t<h2>\n\t\t${sectionNumber} ${sectionTitle}\n\t</h2>\n`;
    
    // Process subsections (#### A., #### B., etc.)
    let currentContent = sectionLines.slice(1).join('\n');
    
    // Handle blockquotes first
    currentContent = currentContent.replace(/^> (.+)$/gm, '<p>\n\t\t$1\n\t</p>');
    
    // Split by subsections
    const subsections = currentContent.split(/(?=#### [A-Z]\.)/);
    
    subsections.forEach((subsection, subIndex) => {
      if (!subsection.trim()) return;
      
      const subLines = subsection.trim().split('\n');
      const subTitleMatch = subLines[0].match(/#### ([A-Z]\.) (.+)/);
      
      if (subTitleMatch) {
        const subLetter = subTitleMatch[1];
        const subTitle = subTitleMatch[2];
        
        result += `\t<h3>\n\t\t${subLetter} ${subTitle}\n\t</h3>\n`;
        
        // Process the content after the subtitle
        const subContent = subLines.slice(1).join('\n');
        result += processSubsectionContent(subContent);
      } else {
        // No subtitle, just process content
        result += processSubsectionContent(subsection);
      }
    });
    
    result += `</div>\n`;
  });
  
  // Handle the summary checklist table
  if (html.includes('## ✅ Summary Checklist')) {
    const tableMatch = html.match(/## ✅ Summary Checklist\s*\n\s*\|(.+?)\|\s*\n\s*\|(.+?)\|\s*\n((?:\|.+?\|\s*\n?)+)/);
    if (tableMatch) {
      result += `<div>\n\t<h2>\n\t\t✅ Summary Checklist\n\t</h2>\n`;
      result += `\t<table>\n\t\t<thead>\n\t\t\t<tr>\n`;
      
      // Headers
      const headers = tableMatch[1].split('|').map(h => h.trim()).filter(h => h);
      headers.forEach(header => {
        result += `\t\t\t\t<th>\n\t\t\t\t\t${header}\n\t\t\t\t</th>\n`;
      });
      result += `\t\t\t</tr>\n\t\t</thead>\n\t\t<tbody>\n`;
      
      // Rows
      const rows = tableMatch[3].trim().split('\n');
      rows.forEach(row => {
        if (row.includes('|')) {
          const cells = row.split('|').map(c => c.trim()).filter(c => c);
          if (cells.length >= 2) {
            result += `\t\t\t<tr>\n`;
            cells.forEach(cell => {
              result += `\t\t\t\t<td>\n\t\t\t\t\t${cell}\n\t\t\t\t</td>\n`;
            });
            result += `\t\t\t</tr>\n`;
          }
        }
      });
      
      result += `\t\t</tbody>\n\t</table>\n</div>\n`;
    }
  }
  
  // Add footer
  result += `<footer>\n\t&copy; 2025 Your Dental Clinic Name. All rights reserved.\n</footer>\n`;
  
  return result;
}

/**
 * Process subsection content (lists, paragraphs, etc.)
 */
function processSubsectionContent(content: string): string {
  if (!content.trim()) return '';
  
  let result = '';
  const lines = content.trim().split('\n');
  let currentList: string[] = [];
  let inList = false;
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    // Check if it's a list item
    if (trimmedLine.startsWith('- ')) {
      if (!inList) {
        inList = true;
        currentList = [];
      }
      
      let listItem = trimmedLine.substring(2);
      // Handle bold text in list items
      listItem = listItem.replace(/\*\*([^*]+)\*\*/g, '$1');
      currentList.push(listItem);
    } else {
      // Not a list item, so close any open list
      if (inList) {
        result += '\t<ul>\n';
        currentList.forEach(item => {
          result += `\t\t<li>\n\t\t\t${item}\n\t\t</li>\n`;
        });
        result += '\t</ul>\n';
        inList = false;
        currentList = [];
      }
      
      // Handle regular paragraphs
      if (trimmedLine && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('>')) {
        let paragraph = trimmedLine.replace(/\*\*([^*]+)\*\*/g, '$1');
        result += `\t<p>\n\t\t${paragraph}\n\t</p>\n`;
      }
    }
  });
  
  // Close any remaining list
  if (inList) {
    result += '\t<ul>\n';
    currentList.forEach(item => {
      result += `\t\t<li>\n\t\t\t${item}\n\t\t</li>\n`;
    });
    result += '\t</ul>\n';
  }
  
  return result;
}

/**
 * Comprehensive HTML cleaner utility
 * Removes unwanted attributes, styles, tags, and formats content
 */
export function cleanHtml(html: string, options: Partial<HtmlCleanerOptions> = {}): string {
  if (!html || typeof html !== 'string') return '';

  const opts = { ...defaultOptions, ...options };

  try {
    let processedHtml = html;
    
    // Convert plain text to HTML if enabled and content appears to be plain text
    if (opts.convertPlainTextToHtml && !/<[^>]+>/.test(html.trim())) {
      processedHtml = convertPlainTextToHtml(html);
    }

    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = processedHtml;

    // Function to recursively clean elements
    const cleanElement = (element: Element): void => {
      if (opts.removeAttributes) {
        // Remove all attributes except allowed ones
        const attributesToRemove: string[] = [];
        
        for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          if (!opts.allowedAttributes?.includes(attr.name)) {
            attributesToRemove.push(attr.name);
          }
        }
        
        attributesToRemove.forEach(attrName => {
          try {
            element.removeAttribute(attrName);
          } catch (e) {
            // Ignore errors when removing attributes
          }
        });
      }

      if (opts.removeInlineStyles) {
        try {
          element.removeAttribute('style');
        } catch (e) {
          // Ignore errors
        }
      }
      
      if (opts.removeClassesAndIds) {
        try {
          element.removeAttribute('class');
          element.removeAttribute('id');
        } catch (e) {
          // Ignore errors
        }
      }
    };

    // Get all elements and clean them
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(cleanElement);

    // Remove unwanted tags
    const tagsToRemove: string[] = [];
    
    if (opts.removeSpanTags) tagsToRemove.push('span');
    if (opts.removeImages) tagsToRemove.push('img');
    if (opts.removeLinks) tagsToRemove.push('a');
    if (opts.removeTables) tagsToRemove.push('table', 'tbody', 'tr', 'td', 'th', 'thead', 'tfoot');

    tagsToRemove.forEach(tagName => {
      const elements = tempDiv.querySelectorAll(tagName);
      elements.forEach(element => {
        try {
          if (opts.removeImages && tagName === 'img') {
            // Remove images completely
            element.remove();
          } else if (opts.removeTables && ['table', 'tbody', 'tr', 'td', 'th', 'thead', 'tfoot'].includes(tagName)) {
            // Remove tables completely
            element.remove();
          } else {
            // For other tags, replace with their content
            const parent = element.parentNode;
            if (parent) {
              while (element.firstChild) {
                parent.insertBefore(element.firstChild, element);
              }
              parent.removeChild(element);
            }
          }
        } catch (e) {
          // Ignore errors when removing elements
        }
      });
    });

    // Remove HTML comments
    if (opts.removeComments) {
      const removeComments = (node: Node): void => {
        try {
          if (node.nodeType === Node.COMMENT_NODE) {
            node.parentNode?.removeChild(node);
          } else {
            const children = Array.from(node.childNodes);
            children.forEach(removeComments);
          }
        } catch (e) {
          // Ignore errors
        }
      };
      removeComments(tempDiv);
    }

    // Get the cleaned HTML
    let cleanedHtml = tempDiv.innerHTML;

    if (opts.removeSuccessiveNbsp) {
      // Remove successive &nbsp;s (replace multiple with single space)
      cleanedHtml = cleanedHtml.replace(/(&nbsp;\s*){2,}/g, ' ');
    }
    
    if (opts.removeTagsWithOnlyNbsp) {
      // Remove tags that contain only &nbsp; (including divs with classes)
      cleanedHtml = cleanedHtml.replace(/<div[^>]*>\s*&nbsp;\s*<\/div>/gi, '');
      cleanedHtml = cleanedHtml.replace(/<p[^>]*>\s*&nbsp;\s*<\/p>/gi, '');
      cleanedHtml = cleanedHtml.replace(/<span[^>]*>\s*&nbsp;\s*<\/span>/gi, '');
      cleanedHtml = cleanedHtml.replace(/<[^>]*>\s*&nbsp;\s*<\/[^>]*>/g, '');
    }

    if (opts.encodeSpecialChars) {
      // Encode special characters (basic encoding)
      const specialChars: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      // Don't encode if already part of HTML tags or entities
      cleanedHtml = cleanedHtml.replace(/[&<>"']/g, (match, offset, string) => {
        // Check if this character is part of an HTML tag or entity
        const beforeChar = string.substring(Math.max(0, offset - 10), offset);
        const afterChar = string.substring(offset, Math.min(string.length, offset + 10));
        
        // Skip if it's part of an HTML tag
        if (beforeChar.includes('<') && afterChar.includes('>')) {
          return match;
        }
        
        // Skip if it's part of an HTML entity
        if (beforeChar.includes('&') && afterChar.includes(';')) {
          return match;
        }
        
        return specialChars[match] || match;
      });
    }

    if (opts.formatWithLineBreaks) {
      // Format with proper line breaks and indentation
      cleanedHtml = formatHtmlWithIndentation(cleanedHtml, opts.indentSize || 1);
    }

    return cleanedHtml;
  } catch (error) {
    console.warn('HTML cleaning failed, returning original content:', error);
    return html; // Return original HTML if cleaning fails
  }
}

/**
 * Format HTML with proper indentation and line breaks
 */
function formatHtmlWithIndentation(html: string, indentSize: number = 1): string {
  if (!html || typeof html !== 'string') return '';
  
  try {
    const tab = '\t'.repeat(Math.max(1, indentSize));
    let formatted = '';
    let indent = 0;
    
    // Split by tags while preserving them - improved regex
    const tokens = html.split(/(<\/?[^>]*>)/);
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!token) continue;
      
      const trimmedToken = token.trim();
      if (!trimmedToken) continue;
      
      if (trimmedToken.startsWith('<')) {
        // This is a tag
        const isClosingTag = trimmedToken.startsWith('</');
        const isSelfClosing = trimmedToken.endsWith('/>') || 
          /^<(br|hr|img|input|meta|link|area|base|col|embed|source|track|wbr)\b[^>]*>$/i.test(trimmedToken);
        
        // Extract tag name for better detection
        const tagMatch = trimmedToken.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
        
        const isBlockElement = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 
          'blockquote', 'section', 'article', 'header', 'footer', 'main', 'nav', 'aside', 
          'form', 'fieldset', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th'].includes(tagName);
        
        if (isClosingTag) {
          // Ensure indent never goes negative
          indent = Math.max(0, indent - 1);
          if (isBlockElement) {
            formatted += '\n' + tab.repeat(indent) + trimmedToken;
          } else {
            formatted += trimmedToken;
          }
        } else {
          if (isBlockElement) {
            formatted += '\n' + tab.repeat(indent) + trimmedToken;
            if (!isSelfClosing) {
              indent++;
            }
          } else {
            formatted += trimmedToken;
          }
        }
      } else {
        // This is text content
        if (trimmedToken) {
          // Check if we need to add indentation for text content
          const needsIndent = formatted.endsWith('\n') || 
            (formatted.endsWith('>') && !formatted.endsWith('</strong>') && !formatted.endsWith('</em>'));
          
          if (needsIndent) {
            formatted += '\n' + tab.repeat(Math.max(0, indent)) + trimmedToken;
          } else {
            formatted += (formatted.endsWith('>') && isBlockContext(formatted) ? 
              '\n' + tab.repeat(Math.max(0, indent)) : '') + trimmedToken;
          }
        }
      }
    }
    
    // Clean up extra whitespace and ensure proper line breaks
    formatted = formatted
      .replace(/\n\s*\n/g, '\n') // Remove multiple consecutive newlines
      .replace(/^\n+/, '') // Remove leading newlines
      .replace(/\n+$/, '\n') // Ensure single trailing newline
      .trim();
    
    return formatted;
  } catch (error) {
    console.warn('HTML formatting failed, returning original content:', error);
    return html;
  }
}

/**
 * Helper function to determine if we're in a block context
 */
function isBlockContext(formatted: string): boolean {
  const blockTags = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote'];
  return blockTags.some(tag => formatted.includes(`<${tag}>`));
}

/**
 * Quick clean function with default settings
 */
export function quickCleanHtml(html: string): string {
  return cleanHtml(html);
}

/**
 * Clean HTML for paste operations with plain text conversion
 */
export function cleanPastedHtml(html: string): string {
  return cleanHtml(html, {
    removeAttributes: true,
    removeInlineStyles: true,
    removeClassesAndIds: true,
    removeSpanTags: true,
    removeImages: true,
    removeLinks: false, // Keep links for pasted content
    removeTables: false, // Keep tables for converted content
    removeComments: true,
    encodeSpecialChars: false, // Don't encode for pasted content
    formatWithLineBreaks: true,
    removeTagsWithOnlyNbsp: true,
    removeSuccessiveNbsp: true,
    convertPlainTextToHtml: true // Enable plain text conversion
  });
}

/**
 * Clean HTML for final output/saving
 */
export function cleanFinalHtml(html: string): string {
  return cleanHtml(html, {
    removeAttributes: true,
    removeInlineStyles: true,
    removeClassesAndIds: true,
    removeSuccessiveNbsp: true,
    removeTagsWithOnlyNbsp: true,
    removeSpanTags: true,
    removeImages: false, // Keep images in final output
    removeLinks: false, // Keep links in final output
    removeTables: false, // Keep tables in final output
    removeComments: true,
    encodeSpecialChars: false, // Don't encode for final output to preserve HTML entities
    formatWithLineBreaks: true,
    convertPlainTextToHtml: false // Don't convert in final output
  });
} 