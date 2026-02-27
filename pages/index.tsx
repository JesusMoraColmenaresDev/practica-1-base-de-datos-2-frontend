import React, { useState, FormEvent } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Record<string, string|number|null> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) return alert('Selecciona un archivo .xlsx');

    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);

    try {
      const res = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Error subiendo archivo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Subir Excel (.xlsx)</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={!file || loading}>
            {loading ? 'Subiendo...' : 'Subir y procesar'}
          </button>
        </div>
      </form>

      {result && (
        <section style={{ marginTop: 20 }}>
          <h2>Resultado</h2>
          <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 400, overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}
    </main>
  );
}
