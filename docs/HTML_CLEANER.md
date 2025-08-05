# HTML Editor with Auto-Clean

## Overview

The HTML Editor component provides automatic HTML cleaning functionality that sanitizes and formats HTML content when users paste content or finish editing. This ensures consistent, clean markup across your application.

## Features

### Automatic Cleaning Triggers

1. **Paste Events**: Automatically cleans content when users paste from external sources
2. **Edit Completion**: Cleans content after 1 second of inactivity
3. **Manual Cleaning**: Can be triggered programmatically

### Cleaning Operations

#### Removes:
- ✅ Tag attributes (class, id, style, data-*, etc.)
- ✅ Inline styles
- ✅ Classes and IDs
- ✅ Successive `&nbsp;` entities
- ✅ Tags containing only `&nbsp;`
- ✅ Span tags (preserves content)
- ✅ Images
- ✅ Links (preserves content)
- ✅ Tables and table elements
- ✅ HTML comments

#### Formats:
- ✅ Encodes special characters
- ✅ Adds proper line breaks
- ✅ Indents content
- ✅ Cleans up whitespace
- ✅ Preserves semantic structure

## Usage

### Basic Implementation

```tsx
import Editor from '@/components/Editor';

function MyComponent() {
  const [content, setContent] = useState('');

  return (
    <Editor
      value={content}
      onChange={setContent}
      autoClean={true}
      showPreview={true}
    />
  );
}
```

### Advanced Configuration

```tsx
import Editor from '@/components/Editor';
import { HtmlCleanerOptions } from '@/utils/htmlCleaner';

function MyComponent() {
  const [content, setContent] = useState('');

  const customCleanerOptions: Partial<HtmlCleanerOptions> = {
    removeImages: false, // Keep images
    removeLinks: false,  // Keep links
    removeTables: false, // Keep tables
    allowedAttributes: ['href', 'src', 'alt'], // Allow specific attributes
  };

  return (
    <Editor
      value={content}
      onChange={setContent}
      autoClean={true}
      cleanerOptions={customCleanerOptions}
      showPreview={true}
    />
  );
}
```

### Using Utility Functions Directly

```tsx
import { 
  cleanHtml, 
  cleanPastedHtml, 
  cleanFinalHtml, 
  quickCleanHtml 
} from '@/utils/htmlCleaner';

// Clean with default settings
const cleaned = quickCleanHtml(dirtyHtml);

// Clean pasted content (preserves links, removes images)
const pastedCleaned = cleanPastedHtml(pastedHtml);

// Clean for final output (preserves images and links)
const finalCleaned = cleanFinalHtml(contentHtml);

// Custom cleaning
const customCleaned = cleanHtml(html, {
  removeImages: false,
  removeLinks: false,
  allowedAttributes: ['href', 'src', 'alt']
});
```

## Configuration Options

### Editor Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `""` | The HTML content value |
| `onChange` | `(value: string) => void` | `undefined` | Callback when content changes |
| `showPreview` | `boolean` | `false` | Show HTML preview below editor |
| `autoClean` | `boolean` | `true` | Enable automatic cleaning |
| `cleanerOptions` | `Partial<HtmlCleanerOptions>` | `undefined` | Custom cleaner configuration |

### HtmlCleanerOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `removeAttributes` | `boolean` | `true` | Remove all attributes except allowed ones |
| `removeInlineStyles` | `boolean` | `true` | Remove style attributes |
| `removeClassesAndIds` | `boolean` | `true` | Remove class and id attributes |
| `removeSuccessiveNbsp` | `boolean` | `true` | Replace multiple `&nbsp;` with single space |
| `removeTagsWithOnlyNbsp` | `boolean` | `true` | Remove tags containing only `&nbsp;` |
| `removeSpanTags` | `boolean` | `true` | Remove span tags (preserve content) |
| `removeImages` | `boolean` | `true` | Remove img tags completely |
| `removeLinks` | `boolean` | `true` | Remove link tags (preserve content) |
| `removeTables` | `boolean` | `true` | Remove table elements completely |
| `removeComments` | `boolean` | `true` | Remove HTML comments |
| `encodeSpecialChars` | `boolean` | `true` | Encode special characters |
| `formatWithLineBreaks` | `boolean` | `true` | Add proper line breaks and formatting |
| `allowedAttributes` | `string[]` | `['href']` | Attributes to preserve |
| `allowedTags` | `string[]` | `[...]` | Tags to preserve |

## Examples

### Before and After Cleaning

#### Input (Dirty HTML):
```html
<div style="color: red; font-size: 16px;" class="some-class" id="test-id">
  <span style="background: yellow;">This is a span with styles</span>
  <p style="margin: 10px;">Paragraph with margin</p>
  <img src="test.jpg" alt="test" width="100" height="100" />
  <a href="https://example.com" style="text-decoration: none;">Link with styles</a>
</div>
```

#### Output (Cleaned HTML):
```html
<div>
  This is a span with styles
  <p>Paragraph with margin</p>
  Link with styles
</div>
```

### Common Use Cases

#### 1. Content Management System
```tsx
// Clean content before saving to database
const handleSave = (content: string) => {
  const cleanedContent = cleanFinalHtml(content);
  saveToDatabase(cleanedContent);
};
```

#### 2. Email Template Editor
```tsx
// Preserve some formatting for emails
const emailCleanerOptions = {
  removeImages: false,
  removeLinks: false,
  allowedAttributes: ['href', 'src', 'alt', 'style'],
  encodeSpecialChars: false
};
```

#### 3. Blog Post Editor
```tsx
// Allow rich formatting but remove dangerous content
const blogCleanerOptions = {
  removeImages: false,
  removeLinks: false,
  removeTables: false,
  allowedAttributes: ['href', 'src', 'alt']
};
```

## Testing

Visit `/editor-demo` to test the functionality with various HTML samples:

1. Rich text with styles and attributes
2. Table content
3. Multiple `&nbsp;` and empty tags
4. Comments and special characters
5. Complex nested structures

## Performance Considerations

- Cleaning is debounced (1 second delay) to avoid excessive processing
- DOM manipulation is optimized for performance
- Large HTML documents are processed efficiently
- Memory cleanup prevents memory leaks

## Browser Compatibility

- Modern browsers with DOM API support
- Uses native `document.createElement` and DOM manipulation
- No external dependencies for HTML parsing

## Security

- Removes potentially dangerous attributes and styles
- Encodes special characters to prevent XSS
- Sanitizes pasted content from external sources
- Preserves semantic structure while removing formatting

## Integration with Appointment Booking System

This editor can be integrated into various parts of the dental appointment booking system:

1. **Treatment Descriptions**: Clean HTML content for treatment details
2. **Dentist Profiles**: Sanitize bio and description content
3. **Blog Posts**: Ensure consistent formatting across articles
4. **Email Templates**: Clean templates while preserving necessary formatting
5. **Patient Communications**: Sanitize user-generated content

## Troubleshooting

### Common Issues

1. **Content disappearing**: Check if `autoClean` is enabled and adjust `cleanerOptions`
2. **Formatting lost**: Modify `allowedAttributes` and `allowedTags` to preserve needed elements
3. **Performance issues**: Increase debounce delay or disable auto-clean for large documents

### Debug Mode

```tsx
// Enable debug logging
const debugClean = (html: string) => {
  console.log('Before cleaning:', html);
  const cleaned = cleanHtml(html);
  console.log('After cleaning:', cleaned);
  return cleaned;
};
``` 