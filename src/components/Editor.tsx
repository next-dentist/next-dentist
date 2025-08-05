// components/Editor.tsx

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ContentEditableEvent,
  EditorProvider,
  Editor as SimpleEditor,
} from 'react-simple-wysiwyg';
import {
  cleanFinalHtml,
  cleanPastedHtml,
  HtmlCleanerOptions,
} from '../utils/htmlCleaner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface EditorProps {
  value: string;
  onChange?: (newValue: string) => void;
  showPreview?: boolean;
  autoClean?: boolean; // New prop to enable/disable auto cleaning
  cleanerOptions?: Partial<HtmlCleanerOptions>; // Custom cleaner options
  pasteMode?: 'replace' | 'insert'; // New prop to control paste behavior
}

const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  showPreview = false,
  autoClean = true,
  cleanerOptions,
  pasteMode = 'replace', // Default to replace mode for better reliability
}) => {
  // Internal state for value in both modes, always synced with parent
  const [visualValue, setVisualValue] = useState<string>(value);
  const [htmlValue, setHtmlValue] = useState<string>(value);
  const [tab, setTab] = useState<'visual' | 'html'>('visual');
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  // Debounced cleanup function
  const debouncedCleanup = useCallback(
    (html: string, callback: (cleaned: string) => void) => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }

      cleanupTimeoutRef.current = setTimeout(() => {
        const cleaned = cleanFinalHtml(html);
        if (cleaned !== html) {
          callback(cleaned);
        }
      }, 1000); // Clean after 1 second of inactivity
    },
    []
  );

  // When incoming prop value changes, update internal state
  useEffect(() => {
    setVisualValue(value);
    setHtmlValue(value);
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
      }
    };
  }, []);

  // Handle paste events for automatic cleaning
  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      if (!autoClean) return;

      // Always prevent default to ensure we control the paste behavior
      event.preventDefault();

      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      // Check if this is a plain text paste (Ctrl+Shift+V) by detecting the event
      const isPlainTextPaste =
        event.nativeEvent &&
        (event.nativeEvent as any).inputType === 'insertFromPaste';

      // Get the appropriate content based on paste type
      let pastedContent = '';

      if (isPlainTextPaste || !clipboardData.getData('text/html')) {
        // For plain text paste or when no HTML is available, use plain text
        pastedContent = clipboardData.getData('text/plain') || '';
        // Convert line breaks to proper HTML
        pastedContent = pastedContent
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => `<p>${line}</p>`)
          .join('');
      } else {
        // For rich text paste, get HTML content
        pastedContent =
          clipboardData.getData('text/html') ||
          clipboardData.getData('text/plain') ||
          '';
      }

      if (pastedContent) {
        // Always clean the content, whether it's HTML or converted plain text
        const cleanedHtml = cleanPastedHtml(pastedContent);

        if (pasteMode === 'replace') {
          // Replace entire content - most reliable for complex HTML
          setVisualValue(cleanedHtml);
          setHtmlValue(cleanedHtml);
          if (onChange) onChange(cleanedHtml);

          // Focus the editor after paste
          setTimeout(() => {
            const editorElement = editorRef.current?.querySelector(
              '[contenteditable="true"]'
            ) as HTMLElement;
            if (editorElement) {
              editorElement.focus();
              // Set cursor to end of content
              const range = document.createRange();
              const selection = window.getSelection();
              range.selectNodeContents(editorElement);
              range.collapse(false);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
          }, 10);
        } else {
          // Insert mode - append to existing content
          const newValue = visualValue + '\n' + cleanedHtml;
          setVisualValue(newValue);
          setHtmlValue(newValue);
          if (onChange) onChange(newValue);

          // Focus the editor after paste
          setTimeout(() => {
            const editorElement = editorRef.current?.querySelector(
              '[contenteditable="true"]'
            ) as HTMLElement;
            if (editorElement) {
              editorElement.focus();
              // Set cursor to end of content
              const range = document.createRange();
              const selection = window.getSelection();
              range.selectNodeContents(editorElement);
              range.collapse(false);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
          }, 10);
        }
      }
    },
    [autoClean, onChange, pasteMode, visualValue]
  );

  // Handle keyboard events to catch Ctrl+Shift+V specifically
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      // Detect Ctrl+Shift+V (paste as plain text)
      if (event.ctrlKey && event.shiftKey && event.key === 'v') {
        event.preventDefault();

        // Use the Clipboard API for plain text
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard
            .readText()
            .then(text => {
              if (text && autoClean) {
                // Convert plain text to clean HTML paragraphs
                const cleanedText = text
                  .replace(/\r\n/g, '\n')
                  .replace(/\r/g, '\n')
                  .split('\n')
                  .map(line => line.trim())
                  .filter(line => line.length > 0)
                  .map(line => `<p>${line}</p>`)
                  .join('');

                // Apply the same cleaning process
                const cleanedHtml = cleanPastedHtml(cleanedText);

                if (pasteMode === 'replace') {
                  setVisualValue(cleanedHtml);
                  setHtmlValue(cleanedHtml);
                  if (onChange) onChange(cleanedHtml);
                } else {
                  const newValue = visualValue + '\n' + cleanedHtml;
                  setVisualValue(newValue);
                  setHtmlValue(newValue);
                  if (onChange) onChange(newValue);
                }

                // Focus the editor
                setTimeout(() => {
                  const editorElement = editorRef.current?.querySelector(
                    '[contenteditable="true"]'
                  ) as HTMLElement;
                  if (editorElement) {
                    editorElement.focus();
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(editorElement);
                    range.collapse(false);
                    selection?.removeAllRanges();
                    selection?.addRange(range);
                  }
                }, 10);
              }
            })
            .catch(err => {
              console.error('Failed to read clipboard:', err);
            });
        }
      }
    },
    [autoClean, onChange, pasteMode, visualValue]
  );

  // Handle keyboard events for textarea
  const handleTextareaKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Detect Ctrl+Shift+V (paste as plain text)
      if (event.ctrlKey && event.shiftKey && event.key === 'v') {
        event.preventDefault();

        // Use the Clipboard API for plain text
        if (navigator.clipboard && navigator.clipboard.readText) {
          navigator.clipboard
            .readText()
            .then(text => {
              if (text && autoClean) {
                // Convert plain text to clean HTML paragraphs
                const cleanedText = text
                  .replace(/\r\n/g, '\n')
                  .replace(/\r/g, '\n')
                  .split('\n')
                  .map(line => line.trim())
                  .filter(line => line.length > 0)
                  .map(line => `<p>${line}</p>`)
                  .join('');

                // Apply the same cleaning process
                const cleanedHtml = cleanPastedHtml(cleanedText);

                if (pasteMode === 'replace') {
                  setVisualValue(cleanedHtml);
                  setHtmlValue(cleanedHtml);
                  if (onChange) onChange(cleanedHtml);
                } else {
                  const newValue = visualValue + '\n' + cleanedHtml;
                  setVisualValue(newValue);
                  setHtmlValue(newValue);
                  if (onChange) onChange(newValue);
                }
              }
            })
            .catch(err => {
              console.error('Failed to read clipboard:', err);
            });
        }
      }
    },
    [autoClean, onChange, pasteMode, visualValue]
  );

  // Change handlers for both editors
  const handleVisualChange = (event: ContentEditableEvent) => {
    const newValue = event.target.value;
    setVisualValue(newValue);
    setHtmlValue(newValue);
    if (onChange) onChange(newValue);

    // Debounced cleanup after editing
    if (autoClean) {
      debouncedCleanup(newValue, cleaned => {
        setVisualValue(cleaned);
        setHtmlValue(cleaned);
        if (onChange) onChange(cleaned);
      });
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    setHtmlValue(html);
    setVisualValue(html);
    if (onChange) onChange(html);

    // Debounced cleanup after editing
    if (autoClean) {
      debouncedCleanup(html, cleaned => {
        setHtmlValue(cleaned);
        setVisualValue(cleaned);
        if (onChange) onChange(cleaned);
      });
    }
  };

  // Sync values on tab switch (for best user experience)
  const handleTabChange = (nextTab: string) => {
    setTab(nextTab === 'html' ? 'html' : 'visual');
    // If switching to HTML, make sure text reflects visual editor's latest value
    if (nextTab === 'html') {
      setHtmlValue(visualValue);
    } else {
      // If switching to Visual, make sure visual editor reflects HTML's latest value
      setVisualValue(htmlValue);
    }
  };

  return (
    <EditorProvider>
      <div className="editor-container mx-auto w-full max-w-2xl">
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
          <TabsList aria-label="Editor modes" className="mb-2">
            <TabsTrigger value="visual">Visual</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            {autoClean && (
              <div className="text-muted-foreground ml-auto px-2 py-1 text-xs">
                Auto-clean enabled
              </div>
            )}
          </TabsList>
          <TabsContent value="visual">
            <div
              ref={editorRef}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              className="relative"
            >
              <SimpleEditor
                value={visualValue}
                onChange={handleVisualChange}
                placeholder="Type your content here…"
                className="border-muted bg-background focus:ring-primary/50 min-h-[200px] flex-1 rounded border px-3 shadow-sm focus:ring-2 focus:outline-none"
                style={{ minHeight: '200px' }}
                aria-label="Visual editor"
              />
            </div>
          </TabsContent>
          <TabsContent value="html">
            <textarea
              value={htmlValue}
              onChange={handleHtmlChange}
              onKeyDown={handleTextareaKeyDown}
              spellCheck
              rows={10}
              className="border-muted bg-background resize-vertical focus:ring-primary/50 min-h-[200px] w-full rounded border px-3 py-2 font-mono shadow-sm focus:ring-2 focus:outline-none"
              aria-label="HTML editor"
            />
          </TabsContent>
        </Tabs>
        {showPreview && (
          <div className="bg-muted mt-5 rounded border p-4">
            <div className="text-muted-foreground mb-2 font-semibold">
              Preview
            </div>
            <div
              className="prose max-w-none"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: visualValue }}
            />
          </div>
        )}
      </div>
    </EditorProvider>
  );
};

export default Editor;
