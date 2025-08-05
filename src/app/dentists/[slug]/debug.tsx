'use client';

type SchemaDebugProps = {
  schemaData: any;
};

export function SchemaDebug({ schemaData }: SchemaDebugProps) {
  if (!schemaData) {
    return (
      <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-800">
        <h2 className="font-bold">Schema Error</h2>
        <p>No schema data was generated.</p>
      </div>
    );
  }

  return (
    <div className="hidden">
      {/* This component doesn't render anything visible, but confirms schema data exists */}
      <script
        data-testid="schema-debug"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({ schemaExists: true }),
        }}
      />
    </div>
  );
}
