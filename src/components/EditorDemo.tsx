'use client';

import React, { useState } from 'react';
import {
  expectedHtml,
  plainTextInstructions,
  rawHtml,
  rawHtmlContent,
} from '../utils/testCleaner';
import Editor from './Editor';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

const EditorDemo: React.FC = () => {
  const [editorValue, setEditorValue] = useState<string>('');
  const [autoClean, setAutoClean] = useState<boolean>(true);
  const [pasteMode, setPasteMode] = useState<'replace' | 'insert'>('replace');

  // Sample dirty HTML for testing
  const dirtyHtmlSamples = [
    {
      name: 'Raw.html Content (Exact Match)',
      html: rawHtmlContent,
      description:
        'Exact content from raw.html file that should convert to procced.html format',
    },
    {
      name: 'Plain Text Instructions (Auto-Convert)',
      html: plainTextInstructions,
      description:
        'Plain text with markdown-like formatting that will be converted to HTML automatically',
    },
    {
      name: 'Dental Content (Your Example)',
      html: rawHtml,
      description:
        'Real example from raw.html with data attributes and spacer divs',
    },
    {
      name: 'Rich Text with Styles',
      html: `<div style="color: red; font-size: 16px;" class="some-class" id="test-id">
        <span style="background: yellow;">This is a span with styles</span>
        <p style="margin: 10px;">Paragraph with margin</p>
        <img src="test.jpg" alt="test" width="100" height="100" />
        <a href="https://example.com" style="text-decoration: none;">Link with styles</a>
      </div>`,
      description: 'HTML with inline styles, classes, and various elements',
    },
    {
      name: 'Table Content',
      html: `<table border="1" cellpadding="5" cellspacing="0" style="width: 100%;">
        <thead>
          <tr>
            <th style="background: #f0f0f0;">Header 1</th>
            <th style="background: #f0f0f0;">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
          </tr>
        </tbody>
      </table>`,
      description: 'Table structure that will be completely removed',
    },
    {
      name: 'Multiple &nbsp; and Empty Tags',
      html: `<p>&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <div><span>&nbsp;</span></div>
        <p>Normal text&nbsp;&nbsp;&nbsp;&nbsp;with multiple spaces</p>
        <span></span>
        <div style="color: blue;">&nbsp;</div>`,
      description: 'Various empty tags and multiple non-breaking spaces',
    },
    {
      name: 'Comments and Special Characters',
      html: `<!-- This is a comment -->
        <p>Text with special chars: &lt; &gt; &amp; "quotes" 'apostrophes'</p>
        <!-- Another comment -->
        <div>More content & symbols < > "</div>`,
      description: 'HTML comments and special characters',
    },
    {
      name: 'Complex Nested Structure',
      html: `<div class="container" id="main" style="padding: 20px;">
        <span style="font-weight: bold;">
          <img src="logo.png" alt="Logo" />
          <a href="#" class="link" style="color: blue;">
            <span style="text-decoration: underline;">Nested link text</span>
          </a>
        </span>
        <table style="border-collapse: collapse;">
          <tr><td style="border: 1px solid #ccc;">Table cell</td></tr>
        </table>
      </div>`,
      description: 'Deeply nested structure with various elements',
    },
  ];

  const handleSampleLoad = (html: string) => {
    setEditorValue(html);
  };

  const handleClear = () => {
    setEditorValue('');
  };

  const handleLoadExpected = () => {
    setEditorValue(expectedHtml);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>HTML Editor with Auto-Clean</CardTitle>
          <CardDescription>
            This editor automatically cleans HTML content when you paste or
            finish editing. It removes unwanted attributes, styles, tags, and
            formats the content properly. Test with your dental content example
            below!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant={autoClean ? 'default' : 'outline'}
                onClick={() => setAutoClean(!autoClean)}
              >
                Auto-Clean: {autoClean ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant={pasteMode === 'replace' ? 'default' : 'outline'}
                onClick={() =>
                  setPasteMode(pasteMode === 'replace' ? 'insert' : 'replace')
                }
              >
                Paste Mode: {pasteMode.toUpperCase()}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear Editor
              </Button>
              <Button variant="secondary" onClick={handleLoadExpected}>
                Load Expected Output
              </Button>
            </div>

            <Editor
              value={editorValue}
              onChange={setEditorValue}
              showPreview={true}
              autoClean={autoClean}
              pasteMode={pasteMode}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Samples</CardTitle>
          <CardDescription>
            Click on any sample below to load it into the editor and see the
            auto-cleaning in action. The first sample demonstrates automatic
            plain text to HTML conversion!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dirtyHtmlSamples.map((sample, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-shadow hover:shadow-md ${
                  index === 0
                    ? 'bg-green-50 ring-2 ring-green-200'
                    : index === 1
                      ? 'bg-blue-50 ring-2 ring-blue-200'
                      : ''
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    {sample.name}
                    {index === 0 && (
                      <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
                        NEW: Auto-Convert
                      </span>
                    )}
                    {index === 1 && (
                      <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        Your Example
                      </span>
                    )}
                  </CardTitle>
                  <p className="text-xs text-gray-600">{sample.description}</p>
                </CardHeader>
                <CardContent>
                  <pre className="mb-2 max-h-32 overflow-x-auto rounded bg-gray-100 p-2 text-xs">
                    {sample.html.length > 300
                      ? sample.html.substring(0, 300) + '...'
                      : sample.html}
                  </pre>
                  <Button
                    size="sm"
                    onClick={() => handleSampleLoad(sample.html)}
                    className="w-full"
                    variant={
                      index === 0
                        ? 'default'
                        : index === 1
                          ? 'default'
                          : 'outline'
                    }
                  >
                    Load Sample
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expected vs Actual Comparison</CardTitle>
          <CardDescription>
            Compare the raw input with the expected clean output for your dental
            content example.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-red-700">
                Raw Input (with attributes & spacers):
              </h4>
              <pre className="max-h-64 overflow-x-auto rounded border border-red-200 bg-red-50 p-3 text-xs">
                {rawHtml}
              </pre>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-green-700">
                Expected Clean Output:
              </h4>
              <pre className="max-h-64 overflow-x-auto rounded border border-green-200 bg-green-50 p-3 text-xs">
                {expectedHtml}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto-Clean Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <h4 className="mb-2 font-semibold text-green-700">
                Converts Plain Text:
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• **Bold** and *italic* text</li>
                <li>• ## Headers (H1-H6)</li>
                <li>• - Bullet lists</li>
                <li>• 1. Numbered lists</li>
                <li>• | Table | Format |</li>
                <li>• &gt; Blockquotes</li>
                <li>• --- Horizontal rules</li>
                <li>• Automatic paragraphs</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-red-700">Removes:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Tag attributes (class, id, style, data-*, etc.)</li>
                <li>• Inline styles</li>
                <li>• Classes and IDs</li>
                <li>• Successive &nbsp; entities</li>
                <li>• Tags containing only &nbsp;</li>
                <li>
                  • Empty spacer divs (like &lt;div
                  class="my-2"&gt;&amp;nbsp;&lt;/div&gt;)
                </li>
                <li>• Span tags (preserves content)</li>
                <li>• Images</li>
                <li>• Links (preserves content)</li>
                <li>• HTML comments</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold text-blue-700">Formats:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Adds proper line breaks</li>
                <li>• Indents content with tabs</li>
                <li>• Cleans up whitespace</li>
                <li>• Preserves semantic structure</li>
                <li>• Maintains HTML entities (like &amp;mdash;)</li>
                <li>• Creates clean, readable HTML</li>
                <li>• Converts plain text to HTML</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Automatic Paste Cleaning:</strong> When you paste content
              from Word, web pages, or other sources, the editor automatically
              cleans the HTML and removes unwanted formatting.
            </div>
            <div>
              <strong>Paste Modes:</strong>
              <ul className="mt-1 ml-4 list-disc space-y-1">
                <li>
                  <strong>REPLACE mode (recommended):</strong> Replaces all
                  editor content with the pasted content. This prevents
                  paragraph shifting and positioning issues.
                </li>
                <li>
                  <strong>INSERT mode:</strong> Appends the pasted content to
                  existing content. Use this if you want to add content without
                  replacing what's already there.
                </li>
              </ul>
            </div>
            <div>
              <strong>Edit Completion Cleaning:</strong> After you stop typing
              for 1 second, the editor automatically cleans the content to
              ensure consistency.
            </div>
            <div>
              <strong>Manual Testing:</strong> Use the test samples above to see
              how different types of dirty HTML are cleaned automatically. Try
              the dental content example first!
            </div>
            <div>
              <strong>Toggle Auto-Clean:</strong> You can disable auto-cleaning
              if you need to preserve the original HTML structure for specific
              use cases.
            </div>
            <div>
              <strong>Visual vs HTML Mode:</strong> Switch between Visual and
              HTML tabs to see how the content appears in both modes. The
              cleaning works in both modes.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditorDemo;
