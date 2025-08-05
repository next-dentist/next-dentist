'use client';

import { useEffect, useState } from 'react';

export function SchemaRenderer({ schema }: { schema: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only render after component is mounted on client
    setMounted(true);

    // Create and inject schema script during client-side rendering
    if (typeof window !== 'undefined' && schema) {
      try {
        // Remove any existing schema scripts to prevent duplicates
        const existingScript = document.getElementById('person-schema');
        if (existingScript) {
          existingScript.remove();
        }

        // Create a new script element
        const scriptElement = document.createElement('script');
        scriptElement.id = 'person-schema';
        scriptElement.type = 'application/ld+json';
        scriptElement.textContent = JSON.stringify(schema);

        // Append to head
        document.head.appendChild(scriptElement);
      } catch (error) {
        console.error('Error injecting schema script:', error);
      }
    }
  }, [schema]);

  if (!mounted) return null;

  // This component doesn't render any visible content
  return null;
}
